<div align="center">
<!-- PROJECT LOGO / BANNER -->
<img src="public/calibrate.svg" alt="Calibrate AI Logo" width="200" />

<p><em>An AI-powered job application tracker that analyzes your resume against job descriptions to calibrate your career moves.</em></p>

<!-- BADGES -->

![License](https://img.shields.io/badge/license-MIT-blue.svg)
[![Version](https://img.shields.io/badge/version-0.1.0-brightgreen.svg)]()
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.6-2D3748?logo=prisma&logoColor=white)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg)

<br />

[Report a Bug](https://github.com/nethangabrielb/calibrate/issues) · [Request a Feature](https://github.com/nethangabrielb/calibrate/issues)

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [AI Analysis Engine](#-ai-analysis-engine)
- [Authentication Flow](#-authentication-flow)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)
- [Contact](#-contact)

---

## Overview

> **Calibrate AI** is a full-stack AI-powered job application tracking platform built with **Next.js 16**, **Prisma 7**, and **Mistral AI**. It allows job seekers to log, manage, and track their job applications, and run AI analysis that scores their resume against a job description.

<img width="1901" height="1097" alt="image" src="https://github.com/user-attachments/assets/b5341c34-96c0-448f-951f-b00c7129d4bf" />
<img width="1919" height="1098" alt="image" src="https://github.com/user-attachments/assets/b0bf8298-e07c-4835-9f24-9c18b07fb0bb" />

This project was built to:

- **Solve a real problem** — Job seekers often apply blindly without knowing how well their profile matches a role. Calibrate AI provides data-driven insights _before_ you apply.
- **Demonstrate modern full-stack architecture** — Server Actions, Next.js App Router, React Server Components, AI SDK structured output, and Prisma ORM with PostgreSQL driver adapters.
- **Showcase AI integration in production applications** — Using Vercel's AI SDK with Mistral's language models for structured, schema-validated JSON output with carefully engineered prompts.

---

## Features

### Core

- [x] **User Registration & Authentication** — Email/password signup with strong validation (12+ char, special chars, numbers) + Google OAuth via Better Auth
- [x] **Job Application Tracking** — Full CRUD for job applications with company, title, description, location, salary, and currency support
- [x] **Application Status Management** — Track status across `APPLIED`, `INTERVIEWING`, `OFFERED`, and `REJECTED` stages
- [x] **AI-Powered Resume Analysis** — Upload a PDF resume and get an instant AI-generated fit score, skill match/gap analysis, and personalized recommendations
- [x] **AI-Powered Resume Analysis** — Upload a PDF resume and get an instant AI-generated fit score, skill match/gap analysis, and personalized recommendations
- [x] **Resume Versioning & History** — Persist multiple uploaded resume versions per application, view a timeline of versions, compare any two versions side-by-side, and track score trends over time
- [x] **Analytics Dashboard** — Overview cards (total applications, average AI score, active applications, offers), bar chart by status, and recent applications table
- [x] **Search & Filter** — Global search across applications with column sorting (salary, date, AI score)
- [x] **Paginated Data Table** — Powered by TanStack Table with 8 items per page, sorting, and global filtering
- [x] **Multi-Currency Salary Support** — ISO 4217 currency codes with `Intl.NumberFormat` rendering

### AI & Intelligence

- [x] **Structured AI Output** — Mistral `ministral-8b-latest` model via Vercel AI SDK with Zod-validated JSON schema output
- [x] **Calibrated Scoring Rubric** — 4-tier scoring system (0–39 Weak → 80–100 Strong) with strict prompt engineering to prevent score inflation
- [x] **Skill Extraction** — Extracts 8–12 matching skills and 5–8 missing skills from both resume and job description, ranked by relevance
- [x] **Actionable Recommendations** — 4-sentence structured recommendation: fit verdict, strongest alignments, critical gap, and concrete next step
- [x] **Re-run Analysis** — Run multiple analyses per application as you update your resume
- [x] **Rate Limiting** — Upstash Redis sliding window rate limiter (**15 requests/hour per user**) to prevent AI API abuse

## Resume Versioning & History

Calibrate AI now supports resume versioning and a dedicated history experience for each job application. Key highlights:

- **Timeline & Versions** — Each uploaded resume is persisted and appears as a version in a timeline view available at `/job-applications/[id]/history`.
- **Compare Versions** — Choose any two versions to compare scores and recommendations side-by-side via the Compare panel.
- **Trend Visualization** — A score progression chart shows versions on the X axis and displays the resume name on hover for each data point; tooltips include the resume label.
- **API Note** — The analyses GET route (`/api/analysis/:applicationId`) includes related resumes for building the history UI.
- **Responsive Layout** — On tablet and smaller screens the history page stacks components as: Resume score progression → Compare versions → Resume timeline (desktop layout preserved on wide screens).
- **Implementation** — Components live under `src/app/job-applications/[id]/history/components` with helpers in `src/lib/history.ts`.

This feature turns Calibrate AI into a longitudinal coaching tool where you can iterate on your resume and track how changes impact your fit over time.

### Technical

- [x] **Server Actions** — Next.js Server Actions for form submissions (create, update, delete applications; signup, login)
- [x] **API Route Handlers** — RESTful API routes for data fetching (dashboard, applications, analyses)
- [x] **Zod Schema Validation** — End-to-end type safety with Zod schemas for forms, API inputs, and AI output
- [x] **React Query** — TanStack Query for client-side data fetching, caching, and cache invalidation
- [x] **Responsive Design** — Mobile-first with collapsible sidebar (Sheet component for mobile/tablet), responsive table columns
- [x] **Loading Skeletons** — Purpose-built skeleton components for dashboard, application table, and analysis panel
- [x] **Toast Notifications** — Sonner for success/error feedback on all user actions
- [x] **Authorization Guards** — Row-level security — users can only access their own applications and analyses

### Upcoming

### Upcoming
- [x] Resume upload (PDF parsing)
- [x] Resume versioning + analysis history
- [ ] AI resume rewriter / optimizer  (currently working)
- [ ] Interview preparation system
- [ ] Analytics intelligence
- [ ] Real-time notifications + background jobs
- [ ] Browser extension (LinkedIn, Indeed, Greenhouse, Lever)
- [ ] AI semantic search
- [ ] Job match recommendation engine
- [ ] Public portfolio dashboard
- [ ] Team / recruiter mode
- [ ] Bulk application import (CSV)
- [ ] Application timeline/activity log
- [ ] Email notifications for status changes
- [ ] Dark mode toggle

---

## Tech Stack

### Frontend

| Technology                                                | Purpose                                                      |
| --------------------------------------------------------- | ------------------------------------------------------------ |
| [Next.js 16](https://nextjs.org/)                         | Full-stack React framework (App Router, RSC, Server Actions) |
| [React 19](https://react.dev/)                            | UI library with Hooks, `useActionState`, `use()`             |
| [Tailwind CSS 4](https://tailwindcss.com/)                | Utility-first CSS with custom teal-centric design tokens     |
| [shadcn/ui](https://ui.shadcn.com/)                       | Radix UI-based component library (New York style)            |
| [TanStack React Query](https://tanstack.com/query)        | Async state management, caching, and cache invalidation      |
| [TanStack React Table](https://tanstack.com/table)        | Headless table with sorting, filtering, pagination           |
| [React Hook Form](https://react-hook-form.com/)           | Performant form handling with `@hookform/resolvers`          |
| [Recharts](https://recharts.org/)                         | Composable React charting (dashboard bar chart)              |
| [Framer Motion](https://www.framer.com/motion/)           | Animation library (available for UI transitions)             |
| [Lucide React](https://lucide.dev/)                       | Icon library                                                 |
| [Sonner](https://sonner.emilkowal.ski/)                   | Toast notification system                                    |
| [next-themes](https://github.com/pacocoursey/next-themes) | Theme management (dark/light mode)                           |

### Backend

| Technology                                                                                                                 | Purpose                                               |
| -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [Next.js 16 API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)                      | REST API route handlers                               |
| [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) | Server-side form mutations                            |
| [Vercel AI SDK](https://sdk.vercel.ai/)                                                                                    | AI model integration with structured output           |
| [Mistral AI](https://mistral.ai/)                                                                                          | LLM provider (`ministral-8b-latest` model)            |
| [Better Auth](https://www.better-auth.com/)                                                                                | Authentication framework (email/password + OAuth)     |
| [Zod](https://zod.dev/)                                                                                                    | Runtime schema validation and type inference          |
| [Upstash Rate Limit](https://upstash.com/)                                                                                 | Serverless Redis-based rate limiting (sliding window) |
| [unpdf](https://www.npmjs.com/package/unpdf)                                                                               | PDF resume text extraction                            |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs)                                                                         | Password hashing                                      |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)                                                                 | JWT token utilities                                   |

### Database & Infrastructure

| Technology                                | Purpose                                                   |
| ----------------------------------------- | --------------------------------------------------------- |
| [PostgreSQL](https://www.postgresql.org/) | Primary relational database                               |
| [Prisma 7](https://www.prisma.io/)        | ORM with PostgreSQL driver adapter (`@prisma/adapter-pg`) |
| [Upstash Redis](https://upstash.com/)     | Serverless Redis for rate limiting & analytics            |
| [Turbopack](https://turbo.build/pack)     | Next.js bundler for development (`next dev --turbopack`)  |
| [@faker-js/faker](https://fakerjs.dev/)   | Database seeding with realistic test data                 |

---

## Architecture

### Project Structure

```
calibrate-ai/
├── prisma/
│   ├── schema.prisma              # Database schema (User, Job, Analysis, Session, Account, Verification)
│   ├── migrations/                # 12 incremental PostgreSQL migrations
│   └── ...
├── prisma.config.ts               # Prisma configuration with dotenv
├── orm/
│   └── generated/prisma/          # Auto-generated Prisma Client (gitignored)
├── public/
│   ├── calibrate.svg              # Logo (sidebar, light variant)
│   ├── calibrate_inverted.svg     # Logo (signup page, inverted)
│   ├── illustration.svg           # Login page illustration
│   └── default-profile.jpg        # Default user avatar
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout (session check, sidebar, QueryProvider)
│   │   ├── page.tsx               # Landing page
│   │   ├── globals.css            # Design system (OKLCH teal tokens, dark mode)
│   │   ├── login/
│   │   │   ├── page.tsx           # Login page
│   │   │   └── components/
│   │   │       └── login-form.tsx # Email/password + Google OAuth login form
│   │   ├── sign-up/
│   │   │   ├── page.tsx           # Signup page
│   │   │   └── components/
│   │   │       └── form.tsx       # Registration form with validation
│   │   ├── dashboard/
│   │   │   ├── page.tsx           # Dashboard page (stats cards, chart, recent table)
│   │   │   └── components/
│   │   │       ├── bar-chart.tsx           # Applications by status bar chart
│   │   │       ├── card.tsx               # Stat card component
│   │   │       ├── dashboard-skeleton.tsx # Loading skeleton
│   │   │       └── recent-applications-table.tsx  # Recent 5 applications
│   │   ├── job-applications/
│   │   │   ├── page.tsx           # Applications list with data table
│   │   │   ├── new/
│   │   │   │   └── page.tsx       # New application form
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx       # Application detail + AI analysis panel
│   │   │   ├── edit/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx   # Edit application form
│   │   │   └── components/
│   │   │       ├── application-form.tsx       # Reusable create/edit form
│   │   │       ├── analysis-panel.tsx         # AI analysis results display
│   │   │       ├── job-application-skeleton.tsx    # Loading skeleton
│   │   │       └── skeleton-analysis-panel.tsx    # Analysis loading skeleton
│   │   └── api/
│   │       ├── auth/[...all]/route.ts         # Better Auth catch-all handler
│   │       ├── applications/
│   │       │   ├── route.ts                   # GET all user applications
│   │       │   └── [id]/route.ts              # GET single application
│   │       ├── analysis/
│   │       │   └── [applicationId]/route.ts   # GET analyses / POST run AI analysis
│   │       ├── dashboard/route.ts             # GET dashboard aggregate data
│   │       └── resume/route.ts                # POST PDF resume upload + text extraction
│   ├── actions/
│   │   ├── application.ts         # Server Actions: create, update, delete
│   │   └── auth.ts                # Server Actions: signup, login
│   ├── components/
│   │   ├── sidebar.tsx                    # Responsive sidebar with navigation
│   │   ├── sidebar-icon.tsx               # Dynamic sidebar icon resolver
│   │   ├── sidebar-profile-dropdown.tsx   # User profile dropdown with logout
│   │   ├── applications-table.tsx         # TanStack Table for applications
│   │   ├── applications-table-skeleton.tsx # Table loading skeleton
│   │   ├── columns.tsx                    # Table column definitions
│   │   ├── create-analysis-dialog.tsx     # AI analysis dialog with resume upload
│   │   ├── delete-dialog.tsx              # Delete confirmation dialog
│   │   ├── input.tsx                      # Custom TextField component
│   │   ├── currency-select.tsx            # Currency selector (ISO 4217)
│   │   ├── status-dropdown.tsx            # Job status dropdown
│   │   └── ui/                            # shadcn/ui primitives (16 components)
│   │       ├── alert-dialog.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── chart.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── field.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── skeleton.tsx
│   │       ├── sonner.tsx
│   │       ├── table.tsx
│   │       └── textarea.tsx
│   ├── lib/
│   │   ├── auth.ts                # Better Auth configuration (Prisma adapter, Google OAuth)
│   │   ├── auth-client.ts         # Client-side auth client instance
│   │   ├── prisma.ts              # Prisma Client singleton with PG adapter
│   │   ├── isAuthenticated.ts     # Server-side authentication guard
│   │   ├── rateLimit.ts           # Upstash Redis rate limiter (15 req/hr sliding window)
│   │   ├── resume.ts              # Client helper to upload PDF resume
│   │   ├── token.ts               # HTTP-only cookie token utility
│   │   ├── data.ts                # Date formatting utility (date-fns)
│   │   └── utils.ts               # cn() — clsx + tailwind-merge utility
│   ├── schemas/
│   │   ├── application.ts         # ApplicationFormSchema, ApplicationSchema, FormState
│   │   ├── analysis.ts            # AnalysisSchema (id, score, skills, recommendation)
│   │   ├── signupForm.ts          # SignupFormSchema (name, email, password, confirm)
│   │   ├── loginForm.ts           # LoginFormSchema (email, password)
│   │   └── user.ts                # User schema
│   ├── types/
│   │   ├── application.ts         # Application, ApplicationFormData types (Zod inferred)
│   │   ├── analysis.ts            # Analysis type (Zod inferred)
│   │   ├── user.ts                # User type (Zod inferred)
│   │   └── actionResult.ts        # Generic ActionResult<T> discriminated union
│   ├── providers/
│   │   └── query-provider.tsx     # TanStack React Query ClientProvider
│   └── seeder/
│       └── application.seeder.ts  # Faker-based job application seeder (25 records)
├── components.json                # shadcn/ui configuration (New York, Neutral base)
├── tsconfig.json                  # TypeScript config (ES2017, bundler resolution)
├── next.config.ts                 # Next.js configuration
├── postcss.config.mjs             # PostCSS with Tailwind CSS plugin
├── eslint.config.mjs              # ESLint with Next.js rules + TanStack Query plugin
├── .prettierrc                    # Prettier configuration
└── package.json                   # Dependencies and scripts
```

### Architecture Pattern

> **Monolith (Next.js Full-Stack)** — A single Next.js 16 application serving both the frontend (React Server Components + Client Components) and backend (API Route Handlers + Server Actions).

### Data Flow Architecture

```mermaid
graph TD
    A[Client Browser] -->|React Query fetch| B[Next.js API Routes]
    A -->|Form submissions| C[Next.js Server Actions]
    B -->|Prisma ORM| D[(PostgreSQL)]
    C -->|Prisma ORM| D
    B -->|AI Analysis POST| E[Vercel AI SDK]
    E -->|generateText| F[Mistral API]
    F -->|Structured JSON| E
    E -->|Zod-validated output| B
    B -->|Rate limit check| G[Upstash Redis]
    A -->|Resume upload| I[POST /api/resume]
    I -->|PDF text extraction| J[unpdf]
```

### Request Flow

```
User Action → Client Component → React Query / useActionState
    → API Route Handler / Server Action
        → isUserAuthenticated() guard
        → Prisma query / mutation
        → (AI route) → Rate limit check → Mistral API → Persist analysis
    → JSON response / revalidation
        → Cache invalidation → UI update
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** `>= 18.x` — [Download](https://nodejs.org/)
- **npm** `>= 9.x` (comes with Node.js)
- **PostgreSQL** `>= 15` — [Download](https://www.postgresql.org/download/)

You will also need API keys for:

- [Mistral AI](https://console.mistral.ai/) — For AI-powered resume analysis
- [Google Cloud Console](https://console.cloud.google.com/) — For Google OAuth (optional)
- [Upstash](https://console.upstash.com/) — For Redis-based rate limiting

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/nethangabrielb/calibrate.git
cd calibrate
```

2. **Install dependencies**

```bash
npm install
```

3. **Generate the Prisma Client**

```bash
npx prisma generate
```

4. **Set up the database**

```bash
# Run all migrations
npx prisma migrate dev

# (Optional) Seed with sample data
npx tsx src/seeder/application.seeder.ts
```

### Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

```env
# ─── Database ───────────────────────────────────────────
DATABASE_URL=postgresql://[USER]:[PASSWORD]@localhost:5432/Calibrate?schema=public

# ─── App ────────────────────────────────────────────────
NODE_ENV=development
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ─── Authentication ─────────────────────────────────────
SECRET_KEY=[YOUR_SECRET_KEY_BASE64]

# ─── OAuth (Google) ─────────────────────────────────────
GOOGLE_CLIENT_ID=[YOUR_GOOGLE_CLIENT_ID]
GOOGLE_CLIENT_SECRET=[YOUR_GOOGLE_CLIENT_SECRET]

# ─── AI (Mistral) ───────────────────────────────────────
MISTRAL_API_KEY=[YOUR_MISTRAL_API_KEY]

# ─── Rate Limiting (Upstash Redis) ──────────────────────
UPSTASH_REDIS_REST_URL=[YOUR_UPSTASH_URL]
UPSTASH_REDIS_REST_TOKEN=[YOUR_UPSTASH_TOKEN]
```

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

### Running the App

**Development** (with Turbopack):

```bash
npm run dev
```

**Production build**:

```bash
npm run build
npm start
```

The app will be available at: `http://localhost:3000`

---

## API Reference

All API routes are located under `src/app/api/` and follow Next.js App Router conventions.

### Base URL

```
http://localhost:3000/api
```

### Authentication

All protected routes use session-based authentication via Better Auth. The `isUserAuthenticated()` server-side guard checks the session cookie on every request.

Better Auth handles all auth endpoints automatically through the catch-all route:

| Method | Endpoint                    | Description                    |
| ------ | --------------------------- | ------------------------------ |
| `POST` | `/api/auth/sign-up/email`   | Register with email & password |
| `POST` | `/api/auth/sign-in/email`   | Login with email & password    |
| `POST` | `/api/auth/sign-out`        | End session                    |
| `GET`  | `/api/auth/get-session`     | Get current session            |
| `GET`  | `/api/auth/sign-in/social`  | Initiate Google OAuth flow     |
| `GET`  | `/api/auth/callback/google` | Google OAuth callback          |

### Applications

| Method | Endpoint                | Description                                                                              | Auth |
| ------ | ----------------------- | ---------------------------------------------------------------------------------------- | ---- |
| `GET`  | `/api/applications`     | List all user applications (ordered by `createdAt DESC`, includes latest analysis score) | ✅   |
| `GET`  | `/api/applications/:id` | Get a single application with analysis scores                                            | ✅   |

**Server Actions** (form-based mutations):

| Action              | File                         | Description                                      |
| ------------------- | ---------------------------- | ------------------------------------------------ |
| `createApplication` | `src/actions/application.ts` | Create a new job application (Zod-validated)     |
| `updateApplication` | `src/actions/application.ts` | Update an existing application (ownership check) |
| `deleteApplication` | `src/actions/application.ts` | Delete application + cascade delete analyses     |

### Resume Upload / Parsing

| Method | Endpoint      | Description                                                 | Auth |
| ------ | ------------- | ----------------------------------------------------------- | ---- |
| `POST` | `/api/resume` | Upload a **PDF** resume and extract plain text for analysis | ✅   |

**POST Request (multipart/form-data):**

- `resume`: PDF file (max **5MB**)

**POST Response (200):**

```json
{ "success": true, "resume": "...extracted text..." }
```

### AI Analysis

| Method | Endpoint                       | Description                                                       | Auth           | Rate Limited |
| ------ | ------------------------------ | ----------------------------------------------------------------- | -------------- | ------------ |
| `GET`  | `/api/analysis/:applicationId` | Get all analyses for an application (ordered by `createdAt DESC`) | ✅ + ownership | No           |
| `POST` | `/api/analysis/:applicationId` | Run AI analysis (resume vs job description)                       | ✅ + ownership | ✅ 15 req/hr |

**POST Request Body:**

```json
{
  "resume": "string (min 10 characters — extracted resume text)"
}
```

**POST Response (201):**

```json
{
  "success": true,
  "message": "Application has been successfully analyzed!",
  "analysis": {
    "id": 1,
    "jobId": 42,
    "score": 72,
    "matchingSkills": [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "REST APIs"
    ],
    "missingSkills": ["Kubernetes", "GraphQL", "Redis/caching"],
    "recommendation": "Moderate fit at 72%. Lead with your strong React/TypeScript stack...",
    "createdAt": "2026-04-14T10:30:00.000Z"
  }
}
```

**Rate Limit Response (429):**

```json
{
  "success": false,
  "message": "Too many requests. Retry after 45 minutes"
}
```

Rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`

### Dashboard

| Method | Endpoint         | Description               | Auth |
| ------ | ---------------- | ------------------------- | ---- |
| `GET`  | `/api/dashboard` | Aggregated dashboard data | ✅   |

**Response:**

```json
{
  "success": true,
  "data": {
    "totalApplications": 25,
    "averageScore": 68,
    "activeApplications": 12,
    "offeredApplications": 3,
    "applicationsChartData": [
      { "status": "APPLIED", "_count": { "_all": 10 } },
      { "status": "INTERVIEWING", "_count": { "_all": 8 } },
      { "status": "OFFERED", "_count": { "_all": 3 } },
      { "status": "REJECTED", "_count": { "_all": 4 } }
    ],
    "recentApplications": [
      /* 5 most recent jobs */
    ]
  }
}
```

---

## Database Schema

> Full schema: [`prisma/schema.prisma`](prisma/schema.prisma)

### Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Job : "has many"
    User ||--o{ Session : "has many"
    User ||--o{ Account : "has many"
    Job ||--o{ Analysis : "has many"

    User {
        string id PK
        string email UK
        string name
        string password
        boolean emailVerified
        string image
        datetime createdAt
        datetime updatedAt
    }

    Job {
        int id PK
        string userId FK
        string company
        string title
        string description
        string location
        int salary
        string salaryCurrency
        enum status
        datetime createdAt
        datetime updatedAt
    }

    Analysis {
        int id PK
        int jobId FK
        int score
        string[] matchingSkills
        string[] missingSkills
        string recommendation
        datetime createdAt
    }

    Session {
        string id PK
        datetime expiresAt
        string token UK
        string ipAddress
        string userAgent
        string userId FK
        datetime createdAt
        datetime updatedAt
    }

    Account {
        string id PK
        string accountId
        string providerId
        string userId FK
        string accessToken
        string refreshToken
        string idToken
        datetime accessTokenExpiresAt
        datetime refreshTokenExpiresAt
        string scope
        string password
        datetime createdAt
        datetime updatedAt
    }

    Verification {
        string id PK
        string identifier
        string value
        datetime expiresAt
        datetime createdAt
        datetime updatedAt
    }
```

### Core Models

| Model          | Key Fields                                                                        | Description                           |
| -------------- | --------------------------------------------------------------------------------- | ------------------------------------- |
| `User`         | id, email, name, password, image, emailVerified                                   | User accounts (Better Auth managed)   |
| `Job`          | id, userId, company, title, description, location, salary, salaryCurrency, status | Job applications with status tracking |
| `Analysis`     | id, jobId, score, matchingSkills[], missingSkills[], recommendation               | AI-generated resume-vs-job analysis   |
| `Session`      | id, token, userId, expiresAt, ipAddress, userAgent                                | Active user sessions                  |
| `Account`      | id, userId, providerId, accountId, accessToken                                    | OAuth provider accounts (Google)      |
| `Verification` | id, identifier, value, expiresAt                                                  | Email verification tokens             |

### Enum: `JobStatus`

| Value          | Description               |
| -------------- | ------------------------- |
| `APPLIED`      | Application submitted     |
| `INTERVIEWING` | Interview process ongoing |
| `OFFERED`      | Received an offer         |
| `REJECTED`     | Application rejected      |

---

## AI Analysis Engine

The AI analysis system is the core differentiator of Calibrate AI. Here's how it works under the hood:

### Architecture

```
User → Upload PDF Resume → POST /api/resume
    → PDF text extraction (unpdf)
    → POST /api/analysis/:applicationId
        → Rate limit check (Upstash Redis, 15 req/hr sliding window)
        → Fetch job description from database
        → Construct prompt with resume + job description
        → Vercel AI SDK generateText() with structured output
        → Mistral ministral-8b-latest model
        → Zod schema validation on response
        → Persist to PostgreSQL via Prisma
        → Return structured analysis
```

### AI Model Configuration

| Setting                | Value                                                                |
| ---------------------- | -------------------------------------------------------------------- |
| **Provider**           | Mistral AI via `@ai-sdk/mistral`                                     |
| **Model**              | `ministral-8b-latest`                                                |
| **Output Mode**        | Structured object (`Output.object()`)                                |
| **Schema Enforcement** | `strictJsonSchema: true`                                             |
| **Output Schema**      | Zod-validated (score, matchingSkills, missingSkills, recommendation) |

### Scoring Rubric

The AI uses a strict 4-tier calibration rubric embedded in the prompt:

| Score Range | Label        | Criteria                                                  |
| ----------- | ------------ | --------------------------------------------------------- |
| **80–100**  | Strong Fit   | Meets most required and preferred qualifications          |
| **60–79**   | Moderate Fit | Core skills align but meaningful gaps exist               |
| **40–59**   | Partial Fit  | Transferable experience but significant skill gaps        |
| **0–39**    | Weak Fit     | Fundamental misalignment in skills, experience, or domain |

### Prompt Engineering Highlights

- **Anti-inflation safeguards** — "Never inflate scores. Never fabricate skills."
- **Concrete skills only** — Excludes soft skills unless the JD explicitly requires certifications
- **Ranked output** — Matching skills ranked by relevance to the role
- **Keyword-only missing skills** — Enforced max 4 words per skill entry
- **Structured recommendation** — Exactly 4 sentences with specific purposes (verdict, strengths, gap, action)

### Rate Limiting

Rate limiting is implemented via Upstash Redis with a sliding window algorithm:

```typescript
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(15, "1 h"),
  analytics: true,
});
```

- **Window**: 1 hour
- **Limit**: 15 requests per user
- **Algorithm**: Sliding window
- **Scope**: Per authenticated user ID

---

## Authentication Flow

### Architecture

Calibrate AI uses [Better Auth](https://www.better-auth.com/) with the Prisma adapter for a complete authentication solution:

```
                    ┌──────────────────────────────┐
                    │        Better Auth            │
                    │   ┌────────┐  ┌────────────┐  │
Client ──────────── │   │ Email/ │  │  Google     │  │ ──── PostgreSQL
                    │   │ Pass   │  │  OAuth 2.0  │  │      (User, Session,
                    │   └────────┘  └────────────┘  │       Account tables)
                    │   ┌─────────────────────────┐ │
                    │   │  Session Management     │ │
                    │   │  (httpOnly cookies)      │ │
                    │   └─────────────────────────┘ │
                    └──────────────────────────────┘
```

### Auth Methods

1. **Email/Password** — Registration with strong password policy (12+ chars, letter, number, special char). Passwords hashed via bcryptjs. Auto sign-in disabled — users must log in after registration.

2. **Google OAuth** — One-click Google sign-in with `select_account` prompt. Callback redirects to `/dashboard`.

### Session Management

- Sessions stored in the `Session` table with token, IP address, and user agent
- Server-side session validation via `auth.api.getSession()` with request headers
- Client-side auth via `authClient.signIn.social()` and `authClient.signOut()`
- `isUserAuthenticated()` helper centralizes server-side auth checks for API routes and Server Actions

### Authorization

Every API endpoint and Server Action performs:

1. **Authentication check** — Verify active session
2. **Ownership check** — Verify `job.userId === user.id` before any read/write operation

---

## Project Structure

### Key Design Decisions

| Decision                           | Rationale                                                                                                       |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Server Actions for mutations**   | Co-located form handling with automatic revalidation, progressive enhancement, and `useActionState` integration |
| **API Routes for reads**           | React Query needs HTTP endpoints for client-side fetching, caching, and background refetching                   |
| **Prisma PG adapter**              | Direct PostgreSQL driver connection instead of Prisma's query engine, reducing cold start overhead              |
| **Zod schemas as source of truth** | Single schema definition generates both runtime validation and TypeScript types (`z.infer<>`)                   |
| **shadcn/ui (New York)**           | Copy-paste component ownership — full control over UI primitives without dependency lock-in                     |
| **OKLCH color system**             | Perceptually uniform color space for consistent design tokens across light/dark mode                            |
| **Separate `/orm/generated/`**     | Prisma Client output isolated from source, gitignored, and generated at build time                              |

### Design System

The application uses a custom teal-centric design system defined in `globals.css` using OKLCH color space:

- **Primary**: Teal-600 `oklch(0.589 0.115 184.704)`
- **Mode support**: Full light and dark mode tokens
- **Component library**: shadcn/ui with Neutral base color
- **Typography**: Geist Sans + Geist Mono (Google Fonts)
- **Icons**: Lucide React

---

## Roadmap

| Status         | Feature                                              |
| -------------- | ---------------------------------------------------- |
| ✅ Done        | Core job application CRUD with status tracking       |
| ✅ Done        | AI-powered resume analysis (Mistral + Vercel AI SDK) |
| ✅ Done        | Analytics dashboard with charts and stats            |
| ✅ Done        | Email/password + Google OAuth authentication         |
| ✅ Done        | Rate-limited AI analysis (Upstash Redis)             |
| ✅ Done        | Responsive sidebar with mobile sheet                 |
| ✅ Done        | TanStack Table with sorting, filtering, pagination   |
| ✅ Done        | PDF resume upload + parsing                          |
| 📋 Planned     | Bulk CSV import for applications                     |
| 📋 Planned     | Application timeline / activity log                  |
| 📋 Planned     | Email notifications for status changes               |
| 💡 Considering | Browser extension for one-click job capture          |
| 💡 Considering | Interview prep assistant (AI-generated questions)    |
| 💡 Considering | Salary benchmarking against market data              |

See all open issues: [GitHub Issues →](https://github.com/nethangabrielb/calibrate/issues)

---

## Contributing

Contributions are what make open-source amazing. Any contributions are greatly appreciated.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

> **Commit style:** This project follows [Conventional Commits](https://www.conventionalcommits.org/).

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Acknowledgements

- [Next.js](https://nextjs.org/) — Full-stack React framework
- [Vercel AI SDK](https://sdk.vercel.ai/) — AI model integration
- [Mistral AI](https://mistral.ai/) — Language model provider
- [Better Auth](https://www.better-auth.com/) — Authentication framework
- [Prisma](https://www.prisma.io/) — Database ORM
- [shadcn/ui](https://ui.shadcn.com/) — Component library
- [TanStack](https://tanstack.com/) — React Query + React Table
- [Upstash](https://upstash.com/) — Serverless Redis
- [Lucide Icons](https://lucide.dev/) — Icon set
- [unpdf](https://www.npmjs.com/package/unpdf) — PDF text extraction

---

## Contact

**Nethan Gabriel B. Bagasbas**
[![GitHub](https://img.shields.io/badge/GitHub-nethangabrielb-black?style=flat-square&logo=github)](https://github.com/nethangabrielb)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-nethangabrielb-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/nethangabrielb/)
[![Email](https://img.shields.io/badge/Email-bagasbas.nethangabriel-red?style=flat-square&logo=gmail)](mailto:bagasbas.nethangabriel@gmail.com)

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/nethangabrielb">Nethan Gabriel Bagasbas</a></sub>
</div>
