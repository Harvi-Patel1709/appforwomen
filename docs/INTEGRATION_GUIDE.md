# Integration Guide
 
[Back to README](../README.md) | [Architecture](ARCHITECTURE.md) | [API Reference](API_REFERENCE.md) | [Frontend Flows](FRONTEND_FLOWS.md) | [Deployment and Operations](DEPLOYMENT_OPERATIONS.md)
 
This guide covers how Eraya integrates with external services, how the frontend communicates with the backend, and how to configure or extend each integration.
 
---
 
## Table of Contents
 
- [1. Frontend-Backend Communication](#1-frontend-backend-communication)
- [2. Authentication Integration](#2-authentication-integration)
- [3. EmailJS Integration](#3-emailjs-integration)
- [4. OpenStreetMap / Overpass API](#4-openstreetmap--overpass-api)
- [5. Nominatim Reverse Geocoding](#5-nominatim-reverse-geocoding)
- [6. Gemini AI Chatbot](#6-gemini-ai-chatbot)
- [7. React Component Integration](#7-react-component-integration)
- [8. Local Storage Strategy](#8-local-storage-strategy)
- [9. Adding New Integrations](#9-adding-new-integrations)
 
---
 
## 1. Frontend-Backend Communication
 
### Architecture
 
Eraya uses a **same-origin** architecture where the Flask backend serves both the API and frontend assets. This eliminates CORS complexity and simplifies cookie handling.
 
```
Browser
  |
  |-- GET /index.html          (static file)
  |-- GET /styles.css           (static asset, cached 24h)
  |-- POST /api/login           (JSON API, session cookie set)
  |-- GET /api/symptoms         (JSON API, cookie sent automatically)
  |
Flask (main.py)
  |-- serves static files from project root
  |-- serves API endpoints under /api/*
  |-- manages session cookies
```
 
### Request Pattern
 
All API calls from the frontend follow this pattern:
 
```javascript
// Standard authenticated request
const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',  // Required: sends session cookie
  body: JSON.stringify(payload)
});
 
const data = await response.json();
```
 
Key requirements:
- **`credentials: 'include'`** must be present on every API call for session cookies to be sent
- **`Content-Type: application/json`** for POST/PUT request bodies
- All responses are JSON (except static file routes)
 
### The `fetchWithAuth` Helper
 
`auth.js` provides `ErayaAuth.fetchWithAuth()` which wraps `fetch` with:
- Automatic `credentials: 'include'`
- 6-second timeout for API calls
- 401 detection with redirect to login page
 
```javascript
// Using the auth helper
const data = await ErayaAuth.fetchWithAuth('/api/symptoms', {
  method: 'POST',
  body: JSON.stringify({ log_date: '2026-04-11', symptoms: ['Cramps'] })
});
```
 
### Error Handling
 
API errors follow a consistent format:
 
```json
{ "error": "Human-readable error message" }
```
 
| HTTP Status | Meaning | Frontend Action |
|-------------|---------|-----------------|
| `200` | Success | Process response data |
| `400` | Bad request / missing fields | Show validation error |
| `401` | Not authenticated | Redirect to login |
| `404` | Not found | Show not found message |
| `409` | Conflict (duplicate email) | Show conflict error |
 
### Static Asset Caching
 
The backend applies different caching strategies:
 
| Asset Type | Cache Duration | Extensions |
|------------|---------------|------------|
| Static assets | 24 hours | `.css`, `.js`, `.png`, `.jpg`, `.svg`, `.ico`, `.woff`, `.woff2` |
| HTML pages | No cache | `.html` |
| API responses | No cache | `/api/*` |
 
---
 
## 2. Authentication Integration
 
### Session Flow
 
```
Register/Login                     Protected Request
    |                                     |
    v                                     v
POST /api/register              GET /api/symptoms
    |                                     |
    v                                     v
Flask sets session cookie        Flask reads session cookie
(HttpOnly, SameSite=Lax)        checks user_id in session
    |                                     |
    v                                     v
Cookie stored in browser         If valid: return data
                                 If invalid: return 401
```
 
### Frontend Auth State Management
 
`auth.js` exposes the `ErayaAuth` object:
 
```javascript
// Check if user is logged in
const user = await ErayaAuth.getCurrentUser(timeoutMs);
// Returns: { id, email, name, created_at } or null
 
// Require login (redirect if not authenticated)
await ErayaAuth.requireLogin();
 
// Render login/logout UI in header
ErayaAuth.renderAuthStatus(containerElement);
```
 
### Dual-Layer Auth (Server + Local)
 
Eraya maintains authentication state in two layers:
 
1. **Server-side (authoritative):** Flask session cookie checked via `GET /api/me`
2. **Client-side (fallback):** `localStorage` keys `erayaUser` and `erayaUsers`
 
This dual approach ensures:
- The server remains the source of truth
- UI renders immediately using cached local state
- Users experience graceful degradation during brief network outages
 
### Integrating Auth Into New Pages
 
To protect a new page with authentication:
 
```html
<script src="auth.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', async () => {
    // Require login - redirects to login.html if not authenticated
    await ErayaAuth.requireLogin();
 
    // Render login/logout button in header
    const authContainer = document.getElementById('auth-status');
    ErayaAuth.renderAuthStatus(authContainer);
 
    // Access current user
    const user = await ErayaAuth.getCurrentUser();
    console.log('Logged in as:', user.name);
  });
</script>
```
 
---
 
## 3. EmailJS Integration
 
### Overview
 
Eraya uses [EmailJS](https://www.emailjs.com/) to send transactional emails without a backend email server. Emails are sent directly from the browser.
 
### Configuration
 
The integration is configured in `login.html`:
 
| Parameter | Value | Purpose |
|-----------|-------|---------|
| Service ID | `service_zgu4e7q` | EmailJS service identifier |
| Welcome Template | `template_welcome` | Sent on new user registration |
| Login Template | `template_login` | Sent on successful login |
| Public Key | `KZ10m_Ad5pUFr8-eQ` | EmailJS API authentication |
 
### How It Works
 
```javascript
// EmailJS is loaded via CDN in login.html
// <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
 
// Initialize
emailjs.init('KZ10m_Ad5pUFr8-eQ');
 
// Send welcome email on registration
emailjs.send('service_zgu4e7q', 'template_welcome', {
  to_email: userEmail,
  to_name: userName,
  message: 'Welcome to Eraya!'
});
 
// Send login notification
emailjs.send('service_zgu4e7q', 'template_login', {
  to_email: userEmail,
  to_name: userName
});
```
 
### Customizing Email Templates
 
1. Log in to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Navigate to **Email Templates**
3. Edit `template_welcome` or `template_login`
4. Available template variables: `{{to_email}}`, `{{to_name}}`, `{{message}}`
 
### Replacing EmailJS
 
To switch to a backend email service:
 
1. Remove EmailJS script tag from `login.html`
2. Add a backend endpoint (e.g., `POST /api/send-email`)
3. Use a Python email library (e.g., `Flask-Mail`, `SendGrid`, `Amazon SES`)
4. Update `login.html` to call the backend endpoint instead of `emailjs.send()`
 
---
 
## 4. OpenStreetMap / Overpass API
 
### Overview
 
The doctor discovery feature (`doctors.html` + `doctors.js`) uses OpenStreetMap's Overpass API to find nearby healthcare facilities.
 
### How It Works
 
```
User grants location permission
        |
        v
Browser Geolocation API returns (lat, lon)
        |
        v
Overpass API query for healthcare facilities
within a radius of user's location
        |
        v
Results filtered by specialty categories
        |
        v
Doctor cards rendered with details
```
 
### Overpass Query
 
```javascript
// Query healthcare facilities near user location
const query = `
  [out:json][timeout:25];
  (
    node["healthcare"~"clinic|doctor|hospital"](around:5000,${lat},${lon});
    way["healthcare"~"clinic|doctor|hospital"](around:5000,${lat},${lon});
  );
  out center;
`;
 
const response = await fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  body: `data=${encodeURIComponent(query)}`
});
```
 
### Specialty Mapping
 
OSM healthcare specialties are mapped to app categories:
 
| App Category | OSM Specialty Tags |
|-------------|-------------------|
| Gynecologist | `gynaecology`, `gynecology`, `obstetrics` |
| Endocrinologist | `endocrinology` |
| Nutritionist | `nutrition`, `dietetics` |
| Therapist | `psychotherapy`, `psychology`, `psychiatry` |
| PCOS Specialist | `endocrinology`, `gynaecology` (combined) |
 
### Rate Limiting
 
- The Overpass API has usage limits. The app includes a 5-second search radius.
- Results are cached locally to avoid repeat queries for the same location.
 
### Customizing Search Radius
 
In `doctors.js`, modify the `around` parameter in the Overpass query:
 
```javascript
// Change from 5000 meters to 10000 meters
node["healthcare"~"clinic|doctor|hospital"](around:10000,${lat},${lon});
```
 
---
 
## 5. Nominatim Reverse Geocoding
 
### Overview
 
After the Overpass API returns healthcare facility coordinates, Nominatim converts `(lat, lon)` pairs into human-readable street addresses.
 
### How It Works
 
```javascript
// Reverse geocode a coordinate
const response = await fetch(
  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
);
const data = await response.json();
const address = data.display_name;
```
 
### Rate Limiting
 
Nominatim has a strict **1 request per second** policy. The app implements throttled requests:
 
```javascript
// Requests are chained with delays to respect rate limits
async function geocodeWithDelay(locations) {
  for (const loc of locations) {
    await reverseGeocode(loc.lat, loc.lon);
    await new Promise(resolve => setTimeout(resolve, 1100)); // 1.1s delay
  }
}
```
 
### Fallback Behavior
 
If Nominatim fails or returns incomplete data:
- Falls back to the OSM node's `display_name` property
- If no address data is available, shows "Address not available"
 
### Usage Policy
 
Per [Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/):
- Maximum 1 request per second
- Include a valid `User-Agent` header
- Do not bulk-geocode large datasets
 
---
 
## 6. Gemini AI Chatbot
 
### Overview
 
The wellness hub includes an AI chatbot powered by Google's Gemini API for personalized health guidance.
 
### Configuration
 
Set the environment variable:
 
```bash
export GEMINI_API_KEY="your-gemini-api-key"
```
 
### Frontend Integration
 
The chatbot UI is in `chatbot.js` and `chatbot.css`, integrated into `wellness.html`:
 
```
User types message in chat input
        |
        v
Message sent to Gemini API
        |
        v
Response displayed in chat window
        |
        v
Conversation history maintained in session
```
 
### Obtaining a Gemini API Key
 
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create or select a project
3. Navigate to **API Keys**
4. Generate a new API key
5. Set it as the `GEMINI_API_KEY` environment variable
 
### Replacing the AI Provider
 
To use a different AI service (e.g., Claude, OpenAI):
 
1. Update `chatbot.js` to call the alternative API
2. Adjust the request/response format for the new provider
3. Update the environment variable name and documentation
 
---
 
## 7. React Component Integration
 
### Architecture
 
Eraya uses React loaded as UMD bundles from CDN. Components are written using `React.createElement()` directly, so no build step (Webpack, Babel, Vite) is required.
 
### How Components Are Loaded
 
```html
<!-- In index.html -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="js/eraya-react-dashboard.js"></script>
```
 
### Available Components
 
| Component | File | Purpose |
|-----------|------|---------|
| `CalendarComponent` | `components/CalendarComponent.jsx` | Interactive cycle calendar |
| `SymptomTracker` | `components/SymptomTracker.jsx` | Symptom logging modal |
| `CycleCounter` | `components/CycleCounter.jsx` | Cycle day counter display |
| `HistorySection` | `components/HistorySection.jsx` | Symptom history viewer |
 
### Pre-built Bundle
 
`js/eraya-react-dashboard.js` (54KB) contains all four components compiled into plain JavaScript. This bundle:
- Uses `React.createElement()` instead of JSX
- Requires no transpilation step
- Self-registers components on the global `window` object
 
### Adding New React Components
 
1. Create a new `.jsx` file in `components/`
2. Write the component using `React.createElement()` syntax:
 
```javascript
// components/NewComponent.jsx
const NewComponent = () => {
  return React.createElement('div', { className: 'new-component' },
    React.createElement('h2', null, 'New Feature'),
    React.createElement('p', null, 'Component content here')
  );
};
 
window.NewComponent = NewComponent;
```
 
3. Add the component to the React bundle or load it as a separate script
4. Mount it in the target HTML page:
 
```javascript
const container = document.getElementById('new-component-root');
ReactDOM.createRoot(container).render(React.createElement(NewComponent));
```
 
---
 
## 8. Local Storage Strategy
 
### Purpose
 
Local storage provides:
- **Instant UI rendering** before API responses arrive
- **Offline fallback** when the backend is temporarily unreachable
- **UX continuity** across page navigations
 
### Storage Keys
 
| Key | Data Stored | Sync Behavior |
|-----|------------|---------------|
| `erayaUser` | Current user identity | Updated on login/logout, synced with `/api/me` |
| `erayaUsers` | Local user registry | Fallback auth data when API is slow |
| `userData` | Setup/profile form data | Written during onboarding, read on profile page |
| `userDataByEmail` | Profile data by email | Per-user profile isolation |
| `symptomsData` | Symptom log entries | Written on save, synced with `POST /api/symptoms` |
| `wellnessStats` | Hydration/meditation counters | Client-only, not synced to backend |
| `rememberedEmail` | Last login email | Login form convenience |
 
### Sync Strategy
 
```
Page Load
    |
    +-- Read local storage (immediate UI)
    |
    +-- Fetch from API (background)
            |
            +-- Success: Update UI + local storage
            |
            +-- Failure: Keep local storage data (graceful degradation)
 
Save Action
    |
    +-- Write to local storage (immediate feedback)
    |
    +-- POST to API (background)
            |
            +-- Success: Confirm save
            |
            +-- Failure: Data preserved in local storage
```
 
### Data Conflict Resolution
 
- **Server wins**: When the API returns data, it overwrites the local cache
- **Local fallback**: If the API is unreachable, local data is used as-is
- **No merge logic**: The app does not attempt to merge conflicting local/remote data
 
---
 
## 9. Adding New Integrations
 
### Adding a New API Endpoint
 
1. **Backend** (`main.py`): Add a route function with the `@require_login` decorator if auth is needed:
 
```python
@app.route('/api/new-feature', methods=['POST'])
@require_login
def api_new_feature():
    data = request.get_json() or {}
    # Process data
    return jsonify({'message': 'Success'})
```
 
2. **Database** (`db.py`): Add table creation in `init_db()` and CRUD functions:
 
```python
def init_db():
    with get_db() as conn:
        conn.executescript("""
            -- existing tables...
            CREATE TABLE IF NOT EXISTS new_feature (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                data TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        """)
```
 
3. **Frontend**: Call the endpoint using `fetchWithAuth`:
 
```javascript
const result = await ErayaAuth.fetchWithAuth('/api/new-feature', {
  method: 'POST',
  body: JSON.stringify({ data: 'value' })
});
```
 
### Adding a New External Service
 
1. Add any API keys as environment variables
2. For browser-side integrations, load SDKs via CDN in the relevant HTML page
3. For server-side integrations, add Python packages to `requirements.txt`
4. Document the integration in this guide
5. Add fallback behavior for when the service is unavailable