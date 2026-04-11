# Production Readiness Presentation
 
[Back to README](../README.md) | [Architecture](ARCHITECTURE.md) | [Deployment and Operations](DEPLOYMENT_OPERATIONS.md) | [Integration Guide](INTEGRATION_GUIDE.md)
 
This document provides a comprehensive production readiness overview of Eraya, covering system architecture, deployment strategies, security posture, scaling considerations, and operational monitoring. It is intended for technical stakeholders, DevOps teams, and engineering leadership.
 
---
 
## Table of Contents
 
- [1. Executive Summary](#1-executive-summary)
- [2. System Architecture](#2-system-architecture)
- [3. Technology Decisions](#3-technology-decisions)
- [4. Security Posture](#4-security-posture)
- [5. Deployment Options](#5-deployment-options)
- [6. Database Strategy](#6-database-strategy)
- [7. Performance Characteristics](#7-performance-characteristics)
- [8. Scaling Roadmap](#8-scaling-roadmap)
- [9. Monitoring & Observability](#9-monitoring--observability)
- [10. Risk Assessment & Mitigations](#10-risk-assessment--mitigations)
- [11. Production Checklist](#11-production-checklist)
- [12. Cost Considerations](#12-cost-considerations)
- [13. Future Roadmap](#13-future-roadmap)
 
---
 
## 1. Executive Summary
 
**Eraya** is a personalized menstrual wellness web application that helps women track cycles, log symptoms, find healthcare providers, and access wellness tools.
 
### Key Facts
 
| Attribute | Value |
|-----------|-------|
| **Application type** | Full-stack web application |
| **Backend** | Python (Flask) |
| **Frontend** | Vanilla JavaScript + React (UMD) |
| **Database** | SQLite (dev) / Cloud SQL (prod) |
| **Deployment** | Docker, Google App Engine, Google Cloud Run |
| **API endpoints** | 9 REST endpoints |
| **Authentication** | Session cookie-based (Werkzeug) |
| **External services** | EmailJS, OpenStreetMap, Nominatim, Gemini AI |
| **Build dependencies** | None (no transpilation required) |
 
### Value Proposition
 
- Privacy-first design with same-origin architecture
- Zero build step frontend for fast iteration
- Cloud-native deployment with Docker and GCP support
- Offline-capable with local storage fallback
- AI-powered wellness guidance
 
---
 
## 2. System Architecture
 
### High-Level Architecture
 
```
                        INTERNET
                           |
                     +-----------+
                     | Load      |
                     | Balancer  |
                     | (GCP/CDN) |
                     +-----------+
                           |
                    +------+------+
                    |             |
               +---------+  +---------+
               | Gunicorn |  | Gunicorn |
               | Worker 1 |  | Worker N |
               +---------+  +---------+
                    |             |
                    +------+------+
                           |
                    +-----------+
                    | Flask App |
                    | (main.py) |
                    +-----------+
                     /         \
                    /           \
          +----------+    +-----------+
          | API      |    | Static    |
          | Routes   |    | Files     |
          | /api/*   |    | HTML/CSS  |
          +----------+    | JS/Images |
               |          +-----------+
               |
          +----------+
          | Database |
          | (db.py)  |
          +----------+
               |
     +-------------------+
     | SQLite (dev)      |
     | Cloud SQL (prod)  |
     +-------------------+
```
 
### Request Flow
 
```
Browser Request
     |
     v
[1] Gunicorn receives request
     |
     v
[2] Flask routing
     |
     +-- /api/* routes --> JSON API handler
     |       |
     |       +-- Check session cookie
     |       +-- Query database (db.py)
     |       +-- Return JSON response
     |
     +-- /* static routes --> File server
             |
             +-- Serve HTML (no cache)
             +-- Serve CSS/JS/images (24h cache)
```
 
### Component Interaction Map
 
```
+------------------+     +------------------+     +------------------+
|   login.html     |     |   index.html     |     |  symptoms.html   |
|   + EmailJS      |     |   + React        |     |  + symptoms.js   |
+--------+---------+     +--------+---------+     +--------+---------+
         |                        |                         |
         v                        v                         v
+------------------------------------------------------------------+
|                    auth.js (shared)                               |
|              getCurrentUser / fetchWithAuth                       |
+------------------------------------------------------------------+
         |                        |                         |
         v                        v                         v
+------------------------------------------------------------------+
|                    Flask API (main.py)                            |
|     /api/register  /api/login  /api/me  /api/symptoms            |
+------------------------------------------------------------------+
         |                        |                         |
         v                        v                         v
+------------------------------------------------------------------+
|                    Database (db.py)                               |
|              users | appointments | symptom_logs                 |
+------------------------------------------------------------------+
 
+------------------+     +------------------+
|   doctors.html   |     |  wellness.html   |
|   + doctors.js   |     |  + wellness.js   |
+--------+---------+     +--------+---------+
         |                        |
         v                        v
+------------------+     +------------------+
| OpenStreetMap    |     | Gemini AI API    |
| Overpass API     |     | (chatbot)        |
| Nominatim API   |     +------------------+
+------------------+
```
 
---
 
## 3. Technology Decisions
 
### Why Flask?
 
| Factor | Rationale |
|--------|-----------|
| **Simplicity** | Single file backend (`main.py` + `db.py`) - easy to understand and maintain |
| **Same-origin** | Serves both API and frontend - no CORS, simple cookie auth |
| **Python ecosystem** | Rich libraries for data processing, ML integration, and cloud SDKs |
| **GCP native** | First-class support on App Engine and Cloud Run |
| **Low overhead** | Minimal dependencies (Flask + Gunicorn only) |
 
### Why No Frontend Build Step?
 
| Factor | Rationale |
|--------|-----------|
| **Developer velocity** | Edit and refresh - no compile/bundle wait time |
| **Simplicity** | No Webpack/Vite/Babel configuration to maintain |
| **React without JSX** | UMD React loaded from CDN, components use `React.createElement()` |
| **Fewer moving parts** | Reduces CI/CD complexity and build failures |
| **Contribution friendly** | Lower barrier to entry for new contributors |
 
### Why SQLite (Development)?
 
| Factor | Rationale |
|--------|-----------|
| **Zero setup** | No database server installation required |
| **Single file** | Database is a single file (`eraya.db`) |
| **Good enough** | Handles development and low-traffic deployments well |
| **Easy migration** | Same SQL schema works with Cloud SQL (PostgreSQL/MySQL) |
 
---
 
## 4. Security Posture
 
### Authentication Security
 
| Control | Implementation | Status |
|---------|---------------|--------|
| Password hashing | Werkzeug `generate_password_hash` (PBKDF2) | Implemented |
| Session cookies | HttpOnly, SameSite=Lax | Implemented |
| Secret key | Configurable via `SECRET_KEY` env var | Implemented |
| Session hijacking prevention | HttpOnly cookies prevent JS access | Implemented |
| CSRF protection | SameSite=Lax cookie policy | Implemented |
| SQL injection | Parameterized queries throughout `db.py` | Implemented |
 
### Production Security Requirements
 
| Requirement | Action Needed |
|-------------|---------------|
| **HTTPS** | Deploy behind HTTPS-terminating load balancer (GCP handles this) |
| **Strong SECRET_KEY** | Generate with `python -c "import secrets; print(secrets.token_hex(32))"` |
| **Database credentials** | Use Cloud SQL IAM authentication or connection pooling |
| **API rate limiting** | Add Flask-Limiter or use GCP Cloud Armor |
| **Input validation** | Current: basic type checking. Recommended: add schema validation |
| **HSTS headers** | Configure in load balancer or add Flask-Talisman |
| **Content Security Policy** | Add CSP headers to restrict script sources |
 
### Data Privacy
 
- User data is stored server-side in the database
- No third-party analytics or tracking scripts
- Local storage is used only for UX performance (not as primary data store)
- EmailJS sends emails directly from browser (email addresses are shared with EmailJS)
- OpenStreetMap queries include user coordinates (location is shared with OSM)
 
---
 
## 5. Deployment Options
 
### Option A: Google Cloud Run (Recommended)
 
```
                   +-------------------+
                   | Cloud Run Service |
                   | (auto-scaling)    |
                   +--------+----------+
                            |
                   +--------+----------+
                   | Docker Container  |
                   | Gunicorn + Flask  |
                   +--------+----------+
                            |
                   +--------+----------+
                   | Cloud SQL         |
                   | (PostgreSQL)      |
                   +-------------------+
```
 
**Advantages:**
- Auto-scaling from 0 to N instances
- Pay-per-request pricing
- Managed HTTPS and custom domains
- Built-in health checks and rolling deploys
 
**Deploy command:**
```bash
gcloud run deploy eraya \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars SECRET_KEY=<your-secret>,FLASK_ENV=production
```
 
### Option B: Google App Engine
 
```
                   +-------------------+
                   | App Engine (F1)   |
                   | (managed scaling) |
                   +--------+----------+
                            |
                   +--------+----------+
                   | Gunicorn + Flask  |
                   | (app.yaml config) |
                   +--------+----------+
                            |
                   +--------+----------+
                   | Cloud SQL         |
                   +-------------------+
```
 
**Advantages:**
- Zero infrastructure management
- Automatic HTTPS
- Built-in versioning and traffic splitting
 
**Deploy command:**
```bash
gcloud app deploy
```
 
### Option C: Docker on Any Infrastructure
 
```bash
# Build
docker build -t eraya .
 
# Run
docker run -p 8080:8080 \
  -e SECRET_KEY="$(python3 -c 'import secrets; print(secrets.token_hex(32))')" \
  -e WEB_CONCURRENCY=2 \
  -e WEB_THREADS=8 \
  eraya
```
 
**Works with:** AWS ECS, Azure Container Apps, DigitalOcean App Platform, Kubernetes, or any Docker host.
 
### Deployment Comparison
 
| Factor | Cloud Run | App Engine | Docker (self-managed) |
|--------|-----------|------------|----------------------|
| **Scaling** | Auto (0-N) | Auto (1-N) | Manual |
| **Pricing** | Pay-per-request | Per-instance-hour | Infrastructure cost |
| **HTTPS** | Automatic | Automatic | Manual (Let's Encrypt) |
| **Setup effort** | Low | Low | Medium |
| **Flexibility** | Medium | Low | High |
| **Cold starts** | Yes (mitigable) | Minimal | None |
| **Database** | Cloud SQL | Cloud SQL | Any |
 
---
 
## 6. Database Strategy
 
### Development: SQLite
 
```python
# db.py - current implementation
DATABASE = os.environ.get('ERAYA_DB', './eraya.db')
conn = sqlite3.connect(DATABASE)
```
 
### Production: Cloud SQL (PostgreSQL)
 
**Migration path:**
 
1. Create a Cloud SQL PostgreSQL instance
2. Apply the same schema (minimal SQL syntax changes)
3. Update `db.py` to use `psycopg2` or `SQLAlchemy`
4. Set connection string via environment variable
 
**Schema compatibility:**
 
| SQLite | PostgreSQL | Changes Needed |
|--------|-----------|---------------|
| `INTEGER PRIMARY KEY AUTOINCREMENT` | `SERIAL PRIMARY KEY` | Syntax change |
| `TEXT` | `TEXT` or `VARCHAR` | Compatible |
| `datetime('now')` | `NOW()` | Function change |
| `sqlite3.Row` | `psycopg2.extras.RealDictCursor` | Driver change |
 
### Database Tables
 
```
+------------------+     +------------------+     +------------------+
|     users        |     |  appointments    |     |  symptom_logs    |
+------------------+     +------------------+     +------------------+
| id (PK)          |<-+  | id (PK)          |     | id (PK)          |
| email (UNIQUE)   |  |  | user_id (FK) ----+---->| user_id (FK) ----|-->
| password_hash    |  |  | doctor_id        |     | log_date         |
| name             |  |  | doctor_name      |     | symptoms_json    |
| created_at       |  |  | preferred_date   |     | intensity        |
+------------------+  |  | preferred_time   |     | notes            |
                      |  | patient_name     |     | created_at       |
                      |  | patient_phone    |     +------------------+
                      |  | reason           |
                      |  | status           |
                      |  | created_at       |
                      |  +------------------+
                      |          |
                      +----------+
```
 
### Scaling Database Recommendations
 
| Scale | Recommendation |
|-------|---------------|
| **< 1,000 users** | SQLite is sufficient |
| **1,000 - 50,000 users** | Cloud SQL (PostgreSQL) with connection pooling |
| **50,000+ users** | Cloud SQL with read replicas, or Firestore for symptom logs |
| **Global deployment** | Cloud Spanner or regional Cloud SQL instances |
 
---
 
## 7. Performance Characteristics
 
### Current Configuration
 
| Parameter | Value | Impact |
|-----------|-------|--------|
| Gunicorn workers | 1 | Sequential request processing per worker |
| Gunicorn threads | 8 | 8 concurrent requests per worker |
| Worker class | gthread | Thread-based concurrency |
| Request timeout | 120s | Max time per request |
| Static cache | 24 hours | CSS/JS/images cached by browser |
| HTML cache | None | Always fresh on page load |
 
### Request Latency Targets
 
| Endpoint | Target | Notes |
|----------|--------|-------|
| `GET /` (HTML) | < 50ms | Static file serving |
| `GET /api/me` | < 100ms | Session lookup only |
| `POST /api/login` | < 200ms | Password hash verification |
| `POST /api/symptoms` | < 100ms | Single DB insert |
| `GET /api/symptoms` | < 150ms | DB query with limit |
| `GET /api/appointments` | < 150ms | DB query |
 
### Frontend Performance
 
| Optimization | Implementation |
|-------------|---------------|
| Static asset caching | 24-hour `Cache-Control` on CSS/JS/images |
| No build step | Zero compile time; instant deploy |
| Local storage prefetch | UI renders from cache before API responds |
| API timeout | 6-second timeout prevents indefinite waits |
| React UMD | Loaded from CDN with browser caching |
| Bundle size | 54KB React dashboard bundle |
 
---
 
## 8. Scaling Roadmap
 
### Phase 1: Single Instance (Current)
 
```
Users: 1 - 1,000
Infrastructure: 1 Cloud Run instance
Database: SQLite or Cloud SQL (single instance)
Cost: ~$0-10/month (Cloud Run free tier)
```
 
**Actions needed:** Deploy to Cloud Run, set strong SECRET_KEY, enable HTTPS.
 
### Phase 2: Multi-Instance
 
```
Users: 1,000 - 10,000
Infrastructure: 2-5 Cloud Run instances (auto-scaled)
Database: Cloud SQL (PostgreSQL, db-f1-micro or db-g1-small)
Cost: ~$20-50/month
```
 
**Actions needed:**
- Migrate from SQLite to Cloud SQL
- Configure Cloud SQL connection pooling
- Add server-side session store (Redis or Cloud Memorystore) to share sessions across instances
- Add CDN for static assets (Cloud CDN or Cloudflare)
 
### Phase 3: Production Scale
 
```
Users: 10,000 - 100,000
Infrastructure: Auto-scaled Cloud Run (up to 20+ instances)
Database: Cloud SQL (db-custom, 2+ vCPUs)
Caching: Redis/Memorystore for sessions and hot data
CDN: Cloud CDN for all static assets
Cost: ~$100-500/month
```
 
**Actions needed:**
- Add Redis-backed session store
- Implement API rate limiting
- Add structured logging (Cloud Logging)
- Set up error reporting (Cloud Error Reporting)
- Add database connection pooling (PgBouncer or Cloud SQL proxy)
- Implement background jobs for email and notifications
 
### Phase 4: Enterprise Scale
 
```
Users: 100,000+
Infrastructure: Multi-region Cloud Run
Database: Cloud SQL with read replicas or Cloud Spanner
Caching: Multi-tier (CDN + Redis + application cache)
Cost: Depends on traffic and SLA requirements
```
 
**Actions needed:**
- Multi-region deployment
- Database read replicas
- Async task queue (Cloud Tasks or Celery)
- Comprehensive monitoring and alerting
- SLA-based architecture decisions
 
---
 
## 9. Monitoring & Observability
 
### Health Check Endpoint
 
```bash
# Liveness probe
curl https://your-host/healthz
# Expected: { "ok": true }
```
 
### Recommended Monitoring Setup
 
#### Application Metrics
 
| Metric | Source | Alert Threshold |
|--------|--------|----------------|
| Request latency (p50, p95, p99) | Cloud Run metrics | p95 > 500ms |
| Error rate (5xx) | Cloud Run metrics | > 1% of requests |
| Request count | Cloud Run metrics | Anomaly detection |
| Instance count | Cloud Run metrics | > max expected |
| Login failures | Application logs | > 10/minute |
| Database query time | Application logs | > 200ms |
 
#### Infrastructure Metrics
 
| Metric | Source | Alert Threshold |
|--------|--------|----------------|
| CPU utilization | Cloud Run | > 80% sustained |
| Memory utilization | Cloud Run | > 85% |
| Cloud SQL connections | Cloud SQL metrics | > 80% of max |
| Cloud SQL CPU | Cloud SQL metrics | > 70% sustained |
| Cloud SQL storage | Cloud SQL metrics | > 80% capacity |
 
### Logging Strategy
 
Current: Gunicorn access logs to stdout (`--access-logfile -`).
 
Recommended additions:
```python
import logging
import json
 
# Structured JSON logging for Cloud Logging
class JSONFormatter(logging.Formatter):
    def format(self, record):
        return json.dumps({
            'severity': record.levelname,
            'message': record.getMessage(),
            'timestamp': self.formatTime(record),
            'module': record.module
        })
```
 
### Key Dashboards to Build
 
1. **Application Health**: Request rate, error rate, latency percentiles
2. **Authentication**: Login attempts, failures, registrations per day
3. **Feature Usage**: Symptoms logged, appointments booked, wellness sessions
4. **Infrastructure**: Instance count, CPU, memory, database connections
 
---
 
## 10. Risk Assessment & Mitigations
 
### Technical Risks
 
| Risk | Severity | Likelihood | Mitigation |
|------|----------|-----------|------------|
| SQLite data loss in cloud | **High** | High (if not migrated) | Migrate to Cloud SQL before production |
| SECRET_KEY leak | **High** | Low | Use GCP Secret Manager; rotate periodically |
| Session fixation | **Medium** | Low | Regenerate session ID on login |
| API abuse (no rate limiting) | **Medium** | Medium | Add Flask-Limiter or Cloud Armor WAF |
| EmailJS API key exposure | **Low** | Medium | Public key is by design; monitor usage in dashboard |
| Nominatim rate limit exceeded | **Low** | Medium | Implement request queuing and caching |
| Gemini API cost overrun | **Medium** | Low | Set API quotas and per-user limits |
 
### Operational Risks
 
| Risk | Severity | Mitigation |
|------|----------|------------|
| Single point of failure (1 instance) | Medium | Scale to 2+ instances with Cloud Run |
| No database backups | High | Enable Cloud SQL automated backups |
| No CI/CD pipeline | Medium | Set up Cloud Build or GitHub Actions |
| No staging environment | Medium | Create a separate staging deployment |
| Secret rotation | Medium | Use GCP Secret Manager with rotation |
 
---
 
## 11. Production Checklist
 
### Before Launch
 
- [ ] **Security**
  - [ ] Generate and set a strong `SECRET_KEY`
  - [ ] Deploy behind HTTPS (automatic on GCP)
  - [ ] Remove default `SECRET_KEY` from code
  - [ ] Audit API endpoints for input validation
  - [ ] Review CORS and cookie settings
 
- [ ] **Database**
  - [ ] Migrate from SQLite to Cloud SQL (PostgreSQL)
  - [ ] Enable automated daily backups
  - [ ] Test database failover and recovery
  - [ ] Set up connection pooling
 
- [ ] **Deployment**
  - [ ] Set up CI/CD pipeline (Cloud Build / GitHub Actions)
  - [ ] Create staging environment
  - [ ] Configure auto-scaling policies
  - [ ] Set appropriate memory and CPU limits
  - [ ] Configure health check endpoint (`/healthz`)
 
- [ ] **Monitoring**
  - [ ] Set up Cloud Logging and Error Reporting
  - [ ] Create alerting policies for error rates and latency
  - [ ] Configure uptime checks
  - [ ] Set up PagerDuty/Slack alert notifications
 
- [ ] **External Services**
  - [ ] Verify EmailJS production limits and billing
  - [ ] Set up Gemini API production key and quotas
  - [ ] Review OSM/Nominatim usage policy compliance
 
- [ ] **Performance**
  - [ ] Load test with expected traffic volume
  - [ ] Verify static asset caching headers
  - [ ] Test cold start performance on Cloud Run
  - [ ] Benchmark database query performance
 
### Post-Launch
 
- [ ] Monitor error rates for the first 48 hours
- [ ] Verify email delivery (EmailJS)
- [ ] Test all user flows in production
- [ ] Review Cloud Run billing and adjust resources
- [ ] Set up regular database backup verification
- [ ] Schedule security dependency updates
 
---
 
## 12. Cost Considerations
 
### Google Cloud Run Pricing (Estimated)
 
| Usage Level | Monthly Requests | Estimated Cost |
|-------------|-----------------|----------------|
| **Free tier** | < 2M requests | $0 |
| **Low traffic** | 2M - 10M requests | $5 - $25 |
| **Medium traffic** | 10M - 50M requests | $25 - $100 |
| **High traffic** | 50M+ requests | $100+ |
 
### Cloud SQL Pricing (Estimated)
 
| Instance | vCPUs | RAM | Monthly Cost |
|----------|-------|-----|-------------|
| db-f1-micro | Shared | 0.6 GB | ~$8 |
| db-g1-small | Shared | 1.7 GB | ~$26 |
| db-custom-2-4096 | 2 | 4 GB | ~$75 |
 
### External Service Costs
 
| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| EmailJS | 200 emails/month | From $9/month (unlimited) |
| Gemini API | Varies by model | Pay-per-token |
| OpenStreetMap | Free (respect usage policy) | N/A |
 
---
 
## 13. Future Roadmap
 
### Short-term Enhancements
 
- **Push notifications**: Remind users to log symptoms and track hydration
- **Data visualization**: Charts for symptom trends and cycle history
- **Multi-language support**: i18n for broader reach
- **Progressive Web App (PWA)**: Install as a mobile app with offline support
 
### Medium-term Features
 
- **Cycle prediction ML model**: Train on anonymized aggregate data for better predictions
- **Partner/family sharing**: Share cycle status with trusted contacts
- **Telehealth integration**: Video consultations with doctors
- **Wearable device sync**: Import data from Fitbit, Apple Watch, etc.
 
### Long-term Vision
 
- **Community features**: Forums and support groups
- **Clinical integration**: EHR (Electronic Health Record) interoperability
- **Research platform**: Opt-in anonymized data contribution for menstrual health research
- **Enterprise/clinic version**: Dashboard for healthcare providers to monitor patient data

Expand lines below

docs/README.md
+17
-5

Expand 3 lines above
 
---
 
- [Architecture](ARCHITECTURE.md)
- [API Reference](API_REFERENCE.md)
- [Frontend Flows](FRONTEND_FLOWS.md)
- [Deployment and Operations](DEPLOYMENT_OPERATIONS.md)
- [Backend Guidance (legacy)](../BACKEND-GUIDANCE.md)
## Architecture & Design
- [Architecture](ARCHITECTURE.md) - System design, components, data flow, and security considerations
 
## API
- [API Reference](API_REFERENCE.md) - Complete endpoint documentation with request/response examples
 
## Guides
- [User Guide](USER_GUIDE.md) - End-user instructions for all app features
- [Integration Guide](INTEGRATION_GUIDE.md) - Third-party service integration, frontend-backend communication, and extension patterns
- [Frontend Flows](FRONTEND_FLOWS.md) - Page mapping, authentication UX, feature gating, and local storage
 
## Operations
- [Deployment and Operations](DEPLOYMENT_OPERATIONS.md) - Deployment runbooks, configuration, and troubleshooting
- [Production Presentation](PRODUCTION_PRESENTATION.md) - Production readiness overview, scaling roadmap, and monitoring strategy
 
## Legacy
- [Backend Guidance](../BACKEND-GUIDANCE.md) - Original backend implementation reference