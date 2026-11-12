# Daily Briefing

A self-hosted dashboard for a morning brief with a phone-friendly layout and ntfy notifications.

## Features

- Today page with Needs you / All normal / Body / Money / Services / Coming up
- Evening ntfy nudge for tomorrow's prep
- Background refresh cycle that persists state
- Zero-dependency local data store for the brief state

## Run locally

1. Install dependencies:
   npm install
2. Copy the sample environment file:
   copy .env.example .env
3. Start the app:
   npm start
4. Open the dashboard:
   http://localhost:3000

## Run with Docker

Build locally:

```bash
docker build -t daily-briefing .
docker run --rm -p 3000:3000 --env-file .env -v ${PWD}/data:/app/data daily-briefing
```

This app also includes a GitHub Actions workflow that builds and pushes a GHCR image whenever changes land on `main`.

## GitHub Actions

The workflow in `.github/workflows/docker-build.yml` runs on pushes to `main` and publishes a container image to GitHub Container Registry using the `latest` tag and the current commit SHA.

## Environment

- PORT: dashboard port, default 3000
- NTFY_URL: ntfy server URL, default https://ntfy.sh
- NTFY_TOPIC: topic to publish to
- NTFY_TOKEN: optional bearer token
- DATA_DIR: where state is stored, default ./data

## Data model

The app is structured around three stages:

- Collectors: read values from services and store a snapshot
- Rules: turn snapshots into actionable issues and summary cards
- Builders: render the dashboard page and notification content

The current implementation uses canned data for the initial build and is ready to replace each collector with real API calls.
