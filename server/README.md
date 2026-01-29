# Backend (Node.js, minimal)

## Run
```bash
node server/index.js
```

Default port: 4010 (set with `PORT`)

## Endpoints
- GET /api/v1/health
- GET /api/v1/config
- POST /api/v1/diagnoses/score
- POST /api/v1/share
- GET /api/v1/share/{share_id}

## Notes
- In-memory share storage (90 days TTL). No persistence.
- CORS enabled for browser access.
- Scoring logic mirrors the frontend MVP.
