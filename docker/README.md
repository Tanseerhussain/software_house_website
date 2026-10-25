# Docker (local and host)

Separate Docker files only. Application logic is not modified.

## Local

```powershell
cd docker
Copy-Item env.local.example .env.local
docker compose up --build
```

- Site: http://localhost:3000
- MongoDB: `mongodb://localhost:27017` (from the host) or `mongodb://mongodb:27017` (inside Compose)

Logs go to container stdout (`docker compose logs -f`).

Mongo only (keep `npm run dev` on the host):

```powershell
docker compose up mongodb
```

Then set `MONGODB_URI=mongodb://localhost:27017` in the project `.env`.

## Host

```powershell
cd docker
Copy-Item env.host.example .env.host
# Put Atlas or other host Mongo URI in .env.host
docker compose -f docker-compose.host.yml up -d --build
```

Optional Mongo on the same host:

```powershell
docker compose -f docker-compose.host.yml --profile mongo up -d --build
```

Use `MONGODB_URI=mongodb://mongodb:27017` in `.env.host` when the mongo profile is on.
