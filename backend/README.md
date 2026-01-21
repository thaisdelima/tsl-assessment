# The Wall API

A Django REST API for user registration, login, and posting messages on a public wall.

## Features
- Auth handled by `dj-rest-auth` + `django-allauth` (login, logout, registration, password flows).
- Token-based login returns `Authorization: Token <key>` for reuse.
- Registration collects username + email and sends the allauth email (console backend in dev).
- Public wall: anyone can read; only authenticated users can post.
- Automated tests covering auth, wall, and email flows.

## Stack
- Django 5.2.10 + Django REST Framework
- dj-rest-auth + django-allauth
- SQLite (dev)
- Token authentication

## How to run locally
1) Clone and enter:
```bash
git clone <repo-url>
cd backend
```

2) Create and activate the venv:
```bash
python -m venv venv
# Windows
source venv/Scripts/activate
# Linux/Mac
source venv/bin/activate
```

3) Create `.env` (mandatory) and config the basics envs:
```bash
SECRET_KEY=dev-secret-key
DEBUG=1
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
# Optional email/SMTP (if you stop using the console email backend)
SENDGRID_API_KEY=<key>
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=<key>
EMAIL_PORT=587
EMAIL_USE_TLS=True
# PostgreSQL 
POSTGRES_DB=tsl
POSTGRES_USER=tsl
POSTGRES_PASSWORD=tslpassword
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

4) Install the dependencies:
```bash
pip install -r requirements.txt
```

5) Run migrations:
```bash
python manage.py migrate
```

6) Start the server:
```bash
python manage.py runserver
```

## Authentication
- Register: `POST /api/auth/registration/` with `username`, `email`, `password1`, `password2`.
- Login: `POST /api/auth/login/` with `username` or `email` + `password` → returns `{ "key": "<token>" }`.
- Auth header: `Authorization: Token <key>`.
- Logout: `POST /api/auth/logout/` (token required).
- Password reset/change endpoints are also exposed via `dj-rest-auth`.
- Legacy DRF authtoken login remains at `POST /api/login/` if needed.

## Endpoints
| Method | Endpoint                | Description                      | Auth |
|--------|-------------------------|----------------------------------|------|
| POST   | /api/auth/registration/ | Register new user (allauth)      | No   |
| POST   | /api/auth/login/        | Obtain auth token (dj-rest-auth) | No   |
| POST   | /api/auth/logout/       | Invalidate token                 | Yes  |
| GET    | /api/messages           | List wall messages               | No   |
| POST   | /api/messages           | Post a wall message              | Yes  |

## Tests
```bash
python manage.py test
```

## Running with Docker
1) Build:
```bash
docker build -t wall-api .
```
