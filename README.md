# Dexter — Full Stack Task Manager

Technical assessment project: **Next.js (App Router) + Tailwind CSS + NestJS + MongoDB**, matching the **Dexter / Pyramid** Figma design.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16, Tailwind CSS, TypeScript |
| Backend | NestJS, class-validator, JWT (HTTP-only cookies) |
| Database | MongoDB (Mongoose) |

## Features

- **Pyramid login** — Guest login + Google OAuth (when configured)
- **Dexter app shell** — Collapsible sidebar, workspace nav
- **Tasks** — Kanban board + list views, drag-and-drop, search, priority filter
- **Task detail drawer** — Inline edit, status/priority sidebar, persisted subtasks & comments
- **Projects** — Table view; click a project → filtered tasks with breadcrumb
- **Theme** — Light / Dark, persisted in `localStorage`
- **Color modes** — Amber, Blue, Pink, Rose, Emerald, Black
- **Settings** — Profile, Theme, Color pages

## Project structure

```
TaskManager/
├── backend/              # NestJS API
│   └── src/
│       ├── auth/
│       ├── todos/
│       └── projects/
└── frontend/
    └── src/
        ├── app/          # Routes (thin page wrappers)
        ├── components/
        │   ├── auth/     # Login card, Google button
        │   ├── layout/   # App shell, header, breadcrumb
        │   ├── projects/ # Projects table + view
        │   ├── settings/
        │   └── tasks/    # Board, list, detail, filters
        ├── hooks/        # useTasks, useProjects, useTaskFilters, …
        └── lib/          # API client, themes, formatters
```

## Local development

### Prerequisites

- Node.js 20+
- MongoDB (Atlas or local)

### Backend

```bash
cd backend
cp .env.example .env   # MONGODB_URI, JWT_SECRET, FRONTEND_URL
npm install
npm run start:dev      # http://localhost:5001
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:5001/api
npm install
npm run dev            # http://localhost:3000
```

## API endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/signup` | No | Register |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/guest` | No | Guest session |
| GET | `/api/auth/google/enabled` | No | Whether Google OAuth is configured |
| GET | `/api/auth/google` | No | Start Google OAuth redirect |
| GET | `/api/auth/google/callback` | No | Google OAuth callback |
| POST | `/api/auth/logout` | No | Logout |
| GET | `/api/auth/me` | Yes | Current user |
| GET/POST | `/api/todo` | Yes | List / create tasks |
| PUT/DELETE | `/api/todo/:id` | Yes | Update / delete task |
| GET/POST | `/api/project` | Yes | List / create projects |
| PUT/DELETE | `/api/project/:id` | Yes | Update / delete project |
| GET/POST | `/api/todo/:todoId/subtask` | Yes | List / create subtasks |
| PUT/DELETE | `/api/todo/:todoId/subtask/:id` | Yes | Update / delete subtask |
| GET/POST | `/api/todo/:todoId/comment` | Yes | List / create comments |
| DELETE | `/api/todo/:todoId/comment/:id` | Yes | Delete comment |

Tasks optionally link to a project via `projectId`. Subtasks and comments are nested under each task.

## Design notes

UI built from Figma assessment screenshots (Dexter main app, Pyramid login). Intentional gaps:

- Google OAuth requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in backend `.env` (see `.env.example`)
- Field toggles in the Fields dropdown are visual only

## Deployment

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for step-by-step instructions.

| Service | Platform | Notes |
|---------|----------|-------|
| Frontend | [Vercel](https://vercel.com) | Root dir: `frontend`, set `NEXT_PUBLIC_API_URL` |
| Backend | [Render](https://render.com) | Uses `render.yaml` blueprint |

**Live URLs** _(update after deploy):_

- Frontend: https://task-manager-phi-dun-87.vercel.app
- API: https://dexter-api-8l85.onrender.com/api

## Scripts

```bash
# Backend
npm run start:dev
npm run build
npm run start:prod

# Frontend
npm run dev
npm run build
npm run start
```
