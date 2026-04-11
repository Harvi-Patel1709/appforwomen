# Eraya - Personalized Menstrual Wellness Companion
 
Eraya is a full-stack web application that empowers women to understand, track, and manage their menstrual health. It combines cycle tracking, symptom logging, doctor discovery, wellness tools, and AI-powered guidance in a single, privacy-first platform.
 
---
 
## Table of Contents
 
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [API Overview](#api-overview)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)
 
---
 
## Features
 
### Cycle Tracking & Predictions
- Interactive calendar with color-coded menstrual phases (Menstrual, Follicular, Ovulation/Fertile, Luteal)
- Cycle day counter and phase timeline visualization
- Next period and fertile window predictions based on user data
 
### Symptom Logging
- 8+ symptom categories: mood, physical, sex/drive, flow, discharge, digestion, activity, water intake
- Daily intensity tracking (1-10 scale) with optional notes
- Symptom history and trend visualization
- Offline-capable with local storage fallback
 
### Doctor Directory & Appointments
- Real-time doctor discovery powered by OpenStreetMap/Overpass API
- Specialty filtering: gynecologist, endocrinologist, nutritionist, therapist, PCOS specialist
- In-app appointment booking with status tracking
- Reverse geocoding for human-readable clinic addresses
 
### Wellness Hub
- Guided meditation timer with session tracking
- Daily hydration tracker with goal progress
- Health tips and wellness content
- AI chatbot integration (Gemini API) for personalized guidance
 
### User Management
- Secure registration and login with session-based authentication
- 3-step onboarding wizard (personal info, cycle data, health goals)
- Profile management and data export
- Email notifications via EmailJS (welcome emails, login alerts)
 
---
 
## Tech Stack
 
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | Flask 3.0+ (Python) | REST API and static file serving |
| **Database** | SQLite (dev) / Cloud SQL (prod) | Persistent data storage |
| **Server** | Gunicorn 21.0+ | Production WSGI server with threading |
| **Frontend** | Vanilla JavaScript (ES6+) | Core application logic |
| **UI Components** | React (UMD, no build step) | Interactive dashboard widgets |
| **Styling** | Custom CSS | Responsive design system |
| **Auth** | Flask Sessions + Werkzeug | Cookie-based authentication |
| **Maps** | OpenStreetMap + Nominatim | Doctor discovery and geocoding |
| **Email** | EmailJS | Transactional email notifications |
| **AI** | Gemini API | Wellness chatbot |
| **Deployment** | Docker, Google App Engine, Cloud Run | Cloud-ready containerization |
 
---
 
## Project Structure
 
```
appforwomen/
├── main.py                  # Flask application entry point
├── db.py                    # SQLite database layer (schema + CRUD)
├── auth.js                  # Frontend authentication helper
├── requirements.txt         # Python dependencies
├── Dockerfile               # Container build configuration
├── app.yaml                 # Google App Engine configuration
│
├── index.html               # Dashboard (main entry point)
├── login.html               # Login / Signup page
├── setup.html               # New user onboarding wizard
├── doctors.html             # Doctor directory + appointment booking
├── symptoms.html            # Symptom tracking interface
├── wellness.html            # Wellness hub (meditation, hydration, tips)
├── mycycle.html             # Cycle insights and phase information
├── profile.html             # User profile summary
├── settings.html            # User settings and preferences
│
├── styles.css               # Main stylesheet
├── script.js                # Dashboard utilities
├── setup.js                 # Onboarding flow logic
├── doctors.js               # OSM/Nominatim API integration
├── symptoms.js              # Symptom selection and persistence
├── wellness.js              # Wellness tools and external APIs
├── chatbot.js               # AI chatbot UI and logic
├── chatbot.css              # Chatbot styling
│
├── components/              # React components (JSX-style, no transpiler)
│   ├── CalendarComponent.jsx
│   ├── SymptomTracker.jsx
│   ├── CycleCounter.jsx
│   └── HistorySection.jsx
│
├── js/
│   └── eraya-react-dashboard.js  # Pre-built React bundle (54KB)
│
├── images/                  # Logo and illustration assets
│   ├── logo.png
│   ├── meditation.png
│   ├── doctors.png
│   ├── workout.png
│   ├── breakfast.png
│   ├── focused.png
│   └── holding-flowers.png
│
└── docs/                    # Project documentation
    ├── README.md            # Documentation index
    ├── ARCHITECTURE.md      # System architecture
    ├── API_REFERENCE.md     # Complete API documentation
    ├── FRONTEND_FLOWS.md    # Frontend behavior and flows
    ├── DEPLOYMENT_OPERATIONS.md  # Deployment and ops guide
    ├── INTEGRATION_GUIDE.md # Third-party integration guide
    ├── USER_GUIDE.md        # End-user guide
    └── PRODUCTION_PRESENTATION.md  # Production readiness overview
```
 
---
 
## Quick Start
 
### Prerequisites
 
- Python 3.10+ installed
- pip package manager
 
### 1. Clone the Repository
 
```bash
git clone https://github.com/harvi-patel1709/appforwomen.git
cd appforwomen
```
 
### 2. Install Dependencies
 
```bash
pip install -r requirements.txt
```
 
### 3. Run the Development Server
 
```bash
python3 main.py
```
 
The app starts at **http://localhost:8080**.
 
### 4. First Use
 
1. Open http://localhost:8080 in your browser
2. Click **Sign Up** to create an account
3. Complete the 3-step onboarding wizard
4. Explore the dashboard and start tracking your cycle
 
---
 
## Environment Variables
 
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | HTTP port | `8080` |
| `SECRET_KEY` | Flask session encryption key | `eraya-dev-secret-change-in-production` |
| `ERAYA_DB` | SQLite database file path | `./eraya.db` |
| `WEB_CONCURRENCY` | Gunicorn worker processes | `1` |
| `WEB_THREADS` | Gunicorn threads per worker | `8` |
| `GUNICORN_TIMEOUT` | Request timeout (seconds) | `120` |
| `GEMINI_API_KEY` | Gemini API key for chatbot | _(none)_ |
 
**Important:** Always set a strong, unique `SECRET_KEY` in production environments.
 
---
 
## Deployment
 
### Docker
 
```bash
# Build
docker build -t eraya .
 
# Run
docker run -p 8080:8080 \
  -e SECRET_KEY="your-strong-secret-key" \
  eraya
```
 
### Google App Engine
 
```bash
gcloud app deploy
```
 
### Google Cloud Run
 
```bash
gcloud run deploy eraya --source . --region europe-west1 --allow-unauthenticated
```
 
For detailed deployment instructions, troubleshooting, and production configuration, see [Deployment and Operations](docs/DEPLOYMENT_OPERATIONS.md).
 
---
 
## API Overview
 
All API endpoints are under `/api/*` and return JSON. Authentication uses session cookies (`credentials: 'include'`).
 
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/register` | No | Create account |
| `POST` | `/api/login` | No | Log in |
| `POST` | `/api/logout` | No | Log out |
| `GET` | `/api/me` | No | Current user info |
| `GET` | `/api/appointments` | Yes | List user appointments |
| `POST` | `/api/appointments` | Yes | Book appointment |
| `GET` | `/api/symptoms` | Yes | List symptom logs |
| `GET` | `/api/symptoms?date=YYYY-MM-DD` | Yes | Get log for date |
| `POST` | `/api/symptoms` | Yes | Save symptom log |
| `GET` | `/healthz` | No | Health check |
 
For complete request/response examples, see the [API Reference](docs/API_REFERENCE.md).
 
---
 
## Documentation
 
| Document | Description |
|----------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | System design, components, and data flow |
| [API Reference](docs/API_REFERENCE.md) | Complete endpoint documentation with examples |
| [Frontend Flows](docs/FRONTEND_FLOWS.md) | Page mapping, auth flow, and local storage |
| [Deployment & Operations](docs/DEPLOYMENT_OPERATIONS.md) | Deployment guides, configuration, troubleshooting |
| [Integration Guide](docs/INTEGRATION_GUIDE.md) | Third-party service integration details |
| [User Guide](docs/USER_GUIDE.md) | End-user instructions for all features |
| [Production Presentation](docs/PRODUCTION_PRESENTATION.md) | Production readiness and scaling overview |
| [Backend Guidance](BACKEND-GUIDANCE.md) | Backend implementation reference |
 
---
 
## Contributing
 
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request
 
### Development Guidelines
 
- Keep the no-build-step frontend architecture (no Webpack/Babel required)
- Maintain offline-first patterns with local storage fallback
- Test API endpoints with `curl` or the built-in frontend
- Follow existing code style and naming conventions
 
---
 
## License
 
This project is developed for educational and wellness purposes.
