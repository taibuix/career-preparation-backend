# 🚀 Career Prep Backend

![CI](https://github.com/buitai97/career-preparation-backend/actions/workflows/ci.yml/badge.svg)

Backend API for the Career Prep Platform — an AI-powered resume builder and interview practice system.

Frontend Repository:
https://github.com/buitai97/career-prep-frontend

Built with Express, TypeScript, Prisma, and PostgreSQL (Docker).

---

## 🌍 Live API

Production API:
https://career-preparation-backend.onrender.com

Swagger Docs:
https://career-preparation-backend.onrender.com/api/docs

## 🏗 Tech Stack

- **Node.js**
- **Express**
- **TypeScript**
- **Prisma 7**
- **PostgreSQL (Docker)**
- **JWT (Authentication)**
- **Bcrypt (Password hashing)**

---

## 📦 Project Structure

src/ <br>
├──config/ # Prisma & environment config <br>
├──modules/ # Feature-based modules (auth, resume, interview) <br>
├──middleware/ # Express middleware (auth, error handling) <br>
├──app.ts <br>
├──server.ts <br>

prisma/ <br>
├── schema.prisma <br>
└── migrations/ <br>

docker-compose.yml

## 🐳 Database Setup (Docker)

Start PostgreSQL:

```bash
docker compose up -d
```

Database runs on:

```bash
localhost:5433
```

Stop and remove database:

```bash
docker compose down -v
```

## ⚙️ Environment Variables

Create a .env file in the project root and add your KEYS:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/career_prep
PORT=5000
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
SECRET_KEY=YOUR_JWT_SECRET_KEY
```

## 📦 Install Dependencies

```bash
npm install
```

## 🧬 Run Database Migration

```bash
npx prisma migrate dev --name init
```

## ▶️ Run Development Server

```bash
npm run dev
```

Server runs at:

```bash
http://localhost:5000

```

## 🔁 CI/CD Pipeline (GitHub Actions)

This repo now includes:
- CI workflow: `.github/workflows/ci.yml`
- CD workflow (EC2 deploy): `.github/workflows/cd-ec2.yml`

CD deploy runs when CI succeeds on `main` (or manually via `workflow_dispatch`).

Set these repository secrets in GitHub before using CD:
- `EC2_HOST` (example: `3.144.30.109`)
- `EC2_PORT` (usually `22`)
- `EC2_USER` (example: `ubuntu`)
- `EC2_SSH_PRIVATE_KEY` (private key content for SSH)
- `EC2_APP_DIR` (example: `/home/ubuntu/career-preparation-backend`)
