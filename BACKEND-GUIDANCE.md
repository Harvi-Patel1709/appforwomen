# Backend Implementation Guidance

This document describes how the three server-side features are implemented and what technologies are used.

---

## Recommended technologies (current stack)

| Layer | Technology | Notes |
|-------|------------|--------|
| **Backend framework** | **Flask** (Python) | Already used to serve the app; minimal and easy to deploy on Google Cloud (App Engine / Cloud Run). |
| **Database** | **SQLite** (dev) | File-based, no extra setup. Use for local development. |
| **Database (production)** | **Cloud SQL** or **Firestore** | On Google Cloud, SQLite is not persistent (read-only or ephemeral). Use Cloud SQL (PostgreSQL/MySQL) or Firestore for production. |
| **Auth** | **Session cookies** | Flask `session` with a secret key; no JWT required for same-origin use. |
| **Password hashing** | **Werkzeug** | `generate_password_hash` / `check_password_hash` (included with Flask). |

**Why Flask?**  
You already serve the app with Flask. Adding JSON API routes keeps one codebase, one deployment, and one language. Alternatives (e.g. Node/Express, Firebase Auth + Firestore) are possible but would require a second backend or more front-end changes.

**Production database:**  
For App Engine or Cloud Run, set `ERAYA_DB` to a path that is writable only in dev, or replace the `db` module with a Cloud SQL / Firestore client and keep the same API so the frontend does not change.

---

## 1. User login

- **Backend:**  
  - `POST /api/register` – create user (email, password, name); sets session.  
  - `POST /api/login` – validate email/password; sets session.  
  - `POST /api/logout` – clear session.  
  - `GET /api/me` – return current user or `{ user: null }` if not logged in.

- **Storage:**  
  - Table `users` (id, email, password_hash, name, created_at). Passwords are hashed with Werkzeug.

- **Frontend:**  
  - `login.html` – login and register forms; submit to `/api/login` and `/api/register`.  
  - `auth.js` – calls `/api/me`, shows Login vs “Name | Logout” and handles redirect when login is required for booking or symptoms.

---

## 2. Doctor appointment booking / scheduling

- **Backend:**  
  - `POST /api/appointments` – create appointment (requires login).  
  - Body: `doctor_id`, `doctor_name`, `preferred_date`, `preferred_time`, `patient_name`, `patient_phone`, `reason` (optional).  
  - `GET /api/appointments` – list appointments for the current user (requires login).

- **Storage:**  
  - Table `appointments` (user_id, doctor_id, doctor_name, preferred_date, preferred_time, patient_name, patient_phone, reason, status, created_at).

- **Frontend:**  
  - Doctors page booking form submits via `fetch` to `POST /api/appointments` with credentials.  
  - If the server returns 401, the user is prompted to log in (or redirected to `login.html`).

---

## 3. Symptoms page

- **Backend:**  
  - `POST /api/symptoms` – save a symptom log (requires login).  
  - Body: `log_date`, `symptoms` (array of strings), `intensity` (1–10), `notes` (optional).  
  - `GET /api/symptoms?date=YYYY-MM-DD` – get log for that date.  
  - `GET /api/symptoms` – list recent logs for the user (for history).

- **Storage:**  
  - Table `symptom_logs` (user_id, log_date, symptoms_json, intensity, notes, created_at).

- **Frontend:**  
  - Symptoms page “Save” sends `POST /api/symptoms` with credentials.  
  - On load, optional `GET /api/symptoms?date=...` to prefill the form for that date.  
  - If the server returns 401, prompt to log in or redirect to `login.html`.

---

## Summary

- **Backend:** Flask + SQLite (dev); same Flask API with Cloud SQL or Firestore for production.  
- **Auth:** Session cookies; `/api/me`, `/api/register`, `/api/login`, `/api/logout`.  
- **Appointments:** `POST/GET /api/appointments` (login required).  
- **Symptoms:** `POST/GET /api/symptoms` (login required).

All API responses are JSON. Use `credentials: 'include'` in `fetch` so session cookies are sent. For production, set `SECRET_KEY` and use a proper database (Cloud SQL or Firestore).
