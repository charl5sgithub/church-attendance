# Church Attendance Management App

Full-stack church attendance management web application.

## Tech Stack

- **Frontend**: React (Vite, TypeScript), Tailwind CSS, Axios, React Router
- **Backend**: Node.js, Express, Prisma ORM, Supabase (PostgreSQL), JWT auth, Vercel Serverless

## Project Structure

- `api/` – Vercel Serverless Function entrypoint (`api/index.ts`)
- `client/` – React frontend
- `server/` – Express API backend (controllers, routes, services, middleware, Prisma schema)

---

## Local Development Setup

### 1. Database & Environment Configuration

In `server/.env` (see [server/.env.example](file:///e:/ReactProjects/church-attendance/server/.env.example)):
```env
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
PORT=4000
JWT_SECRET="your-jwt-secret-here"
ADMIN_EMAIL="admin@church.local"
ADMIN_PASSWORD="changeme123"
```

### 2. Push Database Schema & Seed Data

```bash
# Push schema to Supabase
npm run prisma:push

# (Optional) Seed members
cd server && npm run prisma:seed
```

### 3. Start Backend & Frontend

```bash
# In terminal 1 (Backend API):
npm run dev:server

# In terminal 2 (Frontend Client):
npm run dev:client
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000/api`

---

## Deployment to Vercel (All-in-One: Frontend + Serverless API)

Both frontend and backend are configured to deploy together to Vercel from the repository root.

### 1. Supabase Setup
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **Project Settings** → **Database** → **Connection strings**:
   - **Transaction mode (pooled)** (port 6543) → use for `DATABASE_URL`
   - **Session mode (direct)** (port 5432) → use for `DIRECT_URL`
3. Run `npm run prisma:push` locally to create the tables in your Supabase database.

### 2. Deploy to Vercel
1. Import your Git repository in [Vercel](https://vercel.com).
2. Leave **Root Directory** as `./` (the root).
3. Under **Environment Variables**, add:
   - `DATABASE_URL` = Your Supabase pooled connection string
   - `DIRECT_URL` = Your Supabase direct connection string
   - `JWT_SECRET` = A strong secret for signing JWTs
   - `ADMIN_EMAIL` = Admin login email
   - `ADMIN_PASSWORD` = Admin login password
4. Click **Deploy**.

Vercel will automatically build the React frontend and serve API requests via `/api/*` using the serverless function.

---

## Login Credentials

- **Email**: value of `ADMIN_EMAIL` (default: `admin@church.local`)
- **Password**: value of `ADMIN_PASSWORD` (default: `changeme123`)

## Features

- **Member Management** – add, edit, delete members
- **Weekly Attendance** – mark members Present / Absent per date
- **Reports & Exports** – monthly summary, custom date range, export as **CSV** or **PDF**
- **Dashboard** – total members, today's attendance count, overall percentage
