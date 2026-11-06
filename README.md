# VetLink

VetLink connects pet owners with vets in Sri Lanka. Pet owners manage their profile and their pets, and vets manage their professional profile.

The project has two parts:

| Part | Folder | Built with |
|---|---|---|
| API | `backend/` | FastAPI, SQLModel, Alembic, PostgreSQL |
| Web app | `frontend/` | HTML, JavaScript, Tailwind CSS (no build step) |

## What you need

- [uv](https://docs.astral.sh/uv/getting-started/installation/), which installs Python 3.12 and the project packages
- [PostgreSQL](https://www.postgresql.org/download/), running on your computer

## Set up

Do these steps once. Run the commands from the repository root.

**1. Install the packages**

```sh
uv sync
```

**2. Create the database**

```sh
createdb vetlink_db
```

**3. Create your `.env` file**

```sh
cp example.env .env
```

Open `.env` and fill in your PostgreSQL details. To generate a value for `JWT_SECRET_KEY`, run:

```sh
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**4. Create the database tables**

```sh
cd backend
uv run alembic upgrade head
```

## Run the app

Use two terminals, both starting from the repository root.

**Terminal 1: start the API**

```sh
cd backend
uv run python main.py
```

The API runs at http://localhost:8000, and its interactive docs are at http://localhost:8000/docs.

**Terminal 2: start the web app**

```sh
cd frontend
python3 -m http.server 5500
```

Then open http://localhost:5500.

Keep the port as `5500`. The API only accepts requests from `http://localhost:5500` and `http://127.0.0.1:5500`, so another port shows "Can't reach the VetLink server". Opening the HTML files directly doesn't work either.

## Run the tests

```sh
cd backend
uv run pytest
```

The tests use a temporary in-memory database, so they don't need PostgreSQL or change your data. Results marked `xfailed` are known issues that are expected to fail.

## Update the database

After pulling changes that include new migrations, run:

```sh
cd backend
uv run alembic upgrade head
```

## Optional settings

Uncomment these in `.env` to change the defaults:

| Setting | Default | Purpose |
|---|---|---|
| `BACKEND_HOST` | `localhost` | Address the API listens on |
| `BACKEND_PORT` | `8000` | API port |
| `BACKEND_DEBUG` | `True` | Restart the API when code changes |
| `JWT_ALGORITHM` | `HS256` | Token signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | How long a login lasts |

If you change the API port, also update `API_BASE_URL` in `frontend/js/api.js`.

## Project structure

```text
backend/
  app/          API routes, services, models and auth
  migrations/   Database migrations
  tests/        Automated tests
  main.py       API entry point
frontend/
  assets/       Logo and photos
  js/           Page scripts and shared code
  *.html        One file per page
docs/           Database diagram
```
