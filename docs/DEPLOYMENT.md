# Deployment Guide

Deploy **frontend** to Vercel and **backend** to Render (or Railway / Fly.io).

## 1. Backend (Render)

1. Push this repo to GitHub.
2. [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint** → connect repo.
3. Render picks up `render.yaml` at the repo root.
4. Set these env vars when prompted:

| Variable | Example |
|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | long random string (Render can auto-generate) |
| `FRONTEND_URL` | `https://your-app.vercel.app` |
| `GOOGLE_CLIENT_ID` | from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | from Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | `https://your-api.onrender.com/api/auth/google/callback` |

5. After deploy, note the API URL: `https://dexter-api.onrender.com` (name may vary).

### Google OAuth (production)

In Google Cloud Console → **Credentials** → your OAuth client:

- **Authorized JavaScript origins:** `https://your-app.vercel.app`
- **Authorized redirect URIs:** `https://your-api.onrender.com/api/auth/google/callback`

## 2. Frontend (Vercel)

1. [Vercel Dashboard](https://vercel.com/new) → import the GitHub repo.
2. Set **Root Directory** to `frontend`.
3. Add environment variable:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-api.onrender.com/api` |

4. Deploy. Note the URL: `https://your-app.vercel.app`.

5. Go back to Render and set `FRONTEND_URL` to your Vercel URL, then redeploy the API (needed for CORS + OAuth redirects).

## 3. Verify

- [ ] Guest login works on production frontend
- [ ] Tasks CRUD persists (MongoDB Atlas IP allowlist includes `0.0.0.0/0` or Render egress IPs)
- [ ] Google login redirects and returns to `/tasks`
- [ ] Theme/color preferences persist in browser

## Live URLs (fill in after deploy)

| Service | URL |
|---------|-----|
| Frontend | https://task-manager-phi-dun-87.vercel.app |
| Backend API | https://dexter-api-8l85.onrender.com |

## Manual deploy (CLI)

```bash
# Backend — from repo root, after linking Render service
cd backend && npm run build

# Frontend
cd frontend && npx vercel --prod
# Set NEXT_PUBLIC_API_URL in Vercel project settings
```

## Troubleshooting

**Cookies / auth not sticking (logged out on refresh)**  
Frontend and API are on different domains. Production cookies use `SameSite=None; Secure`. Both must be served over HTTPS.

**CORS errors**  
Ensure `FRONTEND_URL` on the backend exactly matches the Vercel URL (no trailing slash).

**Google OAuth redirect mismatch**  
`GOOGLE_CALLBACK_URL` must match the URI registered in Google Cloud Console character-for-character.
