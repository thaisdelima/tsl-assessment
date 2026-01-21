# TSL Assessment

Quick guide to run the backend (Django), the frontend (React/Vite), and the full stack via Docker Compose.

## Prerequisites
- Node 20+ and npm for local frontend.
- Python 3.12+ and pip for local backend.
- Docker and Docker Compose for the containerized stack.

## Backend (Django) locally
1) Go to `backend` and create the virtualenv:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # on Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
2) Create a `.env` inside `backend` (required; settings expect these vars):
   ```bash
   SECRET_KEY=dev-secret-key
   DEBUG=1
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   ```
3) Run migrations and start the server:
   ```bash
   python manage.py migrate
   python manage.py runserver 0.0.0.0:8000
   ```
4) API available at `http://127.0.0.1:8000`.
5) Emails are logged to the console during sending; check the logs to confirm the email was sent.

## Frontend (React/Vite) locally
1) Go to `frontend/tsl-assessment` and install dependencies:
   ```bash
   cd frontend/tsl-assessment
   npm ci
   ```
2) Set the API URL (optional, defaults to `http://127.0.0.1:8000`). Example:
   ```bash
   export VITE_API_URL=http://127.0.0.1:8000
   ```
3) Start the dev server:
   ```bash
   npm run dev -- --host --port 5173
   ```
4) Open `http://localhost:5173`.

## Full stack with Docker Compose
1) From the repo root, build and run everything:
   ```bash
   docker compose up --build
   ```
2) Services:
   - Backend: `http://localhost:8000`
   - Frontend : `http://localhost`
3) Backend runs migrations automatically on startup (compose entrypoint).
4) Env vars are set in `docker-compose.yml` (adjust if changing host/port):
   - Backend: `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`
   - Frontend: `VITE_API_URL` pointing to the backend (`http://localhost:8000`)

## Tests
- Backend: `python manage.py test` (with venv activated).
- Frontend: `npm test` (uses Vitest).
