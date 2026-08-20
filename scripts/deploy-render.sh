#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/backend/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

read_env() {
  grep "^$1=" "$ENV_FILE" | sed "s/^$1=//"
}

MONGODB_URI="$(read_env MONGODB_URI)"
JWT_SECRET="$(read_env JWT_SECRET)"
GOOGLE_CLIENT_ID="$(read_env GOOGLE_CLIENT_ID)"
GOOGLE_CLIENT_SECRET="$(read_env GOOGLE_CLIENT_SECRET)"

FRONTEND_URL="${FRONTEND_URL:-https://task-manager-phi-dun-87.vercel.app}"
API_URL="${API_URL:-https://dexter-api-8l85.onrender.com}"

render workspace set "${RENDER_WORKSPACE:-tea-d1rl8oidbo4c7389mlug}" --confirm

render services create \
  --name dexter-api \
  --type web_service \
  --repo https://github.com/Ashish4895/TaskManager \
  --branch main \
  --runtime node \
  --root-directory backend \
  --build-command "npm install --include=dev && npm run build" \
  --start-command "npm run start:prod" \
  --health-check-path "/api/auth/google/enabled" \
  --plan free \
  --region oregon \
  --env-var "NODE_ENV=production" \
  --env-var "PORT=10000" \
  --env-var "MONGODB_URI=${MONGODB_URI}" \
  --env-var "JWT_SECRET=${JWT_SECRET}" \
  --env-var "FRONTEND_URL=${FRONTEND_URL}" \
  --env-var "GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}" \
  --env-var "GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}" \
  --env-var "GOOGLE_CALLBACK_URL=${API_URL}/api/auth/google/callback" \
  --confirm \
  -o json

echo ""
echo "Backend URL: ${API_URL}"
echo "Next: set NEXT_PUBLIC_API_URL=${API_URL}/api on Vercel, then redeploy frontend."
