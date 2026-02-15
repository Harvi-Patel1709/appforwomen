"""
Eraya - SQLite database layer for users, appointments, and symptom logs.
"""
import os
import sqlite3
import json
from contextlib import contextmanager
from werkzeug.security import generate_password_hash, check_password_hash

DATABASE = os.environ.get('ERAYA_DB', os.path.join(os.path.dirname(__file__), 'eraya.db'))


@contextmanager
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    """Create tables if they do not exist."""
    with get_db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            );
            CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                doctor_id INTEGER NOT NULL,
                doctor_name TEXT NOT NULL,
                preferred_date TEXT NOT NULL,
                preferred_time TEXT NOT NULL,
                patient_name TEXT NOT NULL,
                patient_phone TEXT NOT NULL,
                reason TEXT,
                status TEXT NOT NULL DEFAULT 'pending',
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
            CREATE TABLE IF NOT EXISTS symptom_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                log_date TEXT NOT NULL,
                symptoms_json TEXT NOT NULL,
                intensity INTEGER NOT NULL,
                notes TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        """)


def user_create(email, password, name):
    """Register a new user. Returns (user_id, None) or (None, error_message)."""
    with get_db() as conn:
        try:
            cur = conn.execute(
                "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
                (email.strip().lower(), generate_password_hash(password), name.strip())
            )
            return (cur.lastrowid, None)
        except sqlite3.IntegrityError:
            return (None, "Email already registered")


def user_get_by_id(user_id):
    """Return user row dict or None."""
    with get_db() as conn:
        row = conn.execute("SELECT id, email, name, created_at FROM users WHERE id = ?", (user_id,)).fetchone()
        return dict(row) if row else None


def user_get_by_email(email):
    """Return user row with password_hash for login, or None."""
    with get_db() as conn:
        row = conn.execute(
            "SELECT id, email, name, password_hash FROM users WHERE email = ?",
            (email.strip().lower(),)
        ).fetchone()
        return dict(row) if row else None


def appointment_create(user_id, doctor_id, doctor_name, preferred_date, preferred_time, patient_name, patient_phone, reason=None):
    """Create an appointment. Returns (appointment_id, None) or (None, error)."""
    with get_db() as conn:
        cur = conn.execute(
            """INSERT INTO appointments
               (user_id, doctor_id, doctor_name, preferred_date, preferred_time, patient_name, patient_phone, reason, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')""",
            (user_id, doctor_id, doctor_name, preferred_date, preferred_time, patient_name, patient_phone, reason or "")
        )
        return (cur.lastrowid, None)


def appointment_list_by_user(user_id):
    """Return list of appointment dicts for the user."""
    with get_db() as conn:
        rows = conn.execute(
            """SELECT id, doctor_id, doctor_name, preferred_date, preferred_time, patient_name, patient_phone, reason, status, created_at
               FROM appointments WHERE user_id = ? ORDER BY preferred_date DESC, preferred_time DESC""",
            (user_id,)
        ).fetchall()
        return [dict(r) for r in rows]


def symptom_log_create(user_id, log_date, symptoms_list, intensity, notes=None):
    """Save a symptom log. Returns (log_id, None) or (None, error)."""
    with get_db() as conn:
        cur = conn.execute(
            """INSERT INTO symptom_logs (user_id, log_date, symptoms_json, intensity, notes)
               VALUES (?, ?, ?, ?, ?)""",
            (user_id, log_date, json.dumps(symptoms_list), int(intensity), notes or "")
        )
        return (cur.lastrowid, None)


def symptom_log_get(user_id, log_date):
    """Get symptom log for user and date. Returns dict or None."""
    with get_db() as conn:
        row = conn.execute(
            "SELECT id, log_date, symptoms_json, intensity, notes, created_at FROM symptom_logs WHERE user_id = ? AND log_date = ?",
            (user_id, log_date)
        ).fetchone()
        if not row:
            return None
        d = dict(row)
        d['symptoms'] = json.loads(d['symptoms_json'])
        return d


def symptom_log_list_recent(user_id, limit=30):
    """Return recent symptom logs for user (for history)."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, log_date, symptoms_json, intensity, notes, created_at FROM symptom_logs WHERE user_id = ? ORDER BY log_date DESC LIMIT ?",
            (user_id, limit)
        ).fetchall()
        out = []
        for r in rows:
            d = dict(r)
            d['symptoms'] = json.loads(d['symptoms_json'])
            out.append(d)
        return out
