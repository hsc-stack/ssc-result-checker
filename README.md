# SSC Result Checker

Production architecture and deployment documentation for the SSC Result Checker application.

## Overview

SSC Result Checker is a React-based application that allows users to check SSC results through a secure proxy architecture.

The system consists of:

* **React + Vite frontend** — User interface and API communication
* **Cloudflare Worker backend** — API gateway, session handling, captcha processing, and upstream communication
* **Cloudflare KV** — Temporary storage for session data and upstream cookies

---

# Architecture

```
User
 │
 ▼
React Frontend
(Vercel)
 │
 │ HTTPS API Requests
 ▼
Cloudflare Worker
 │
 │ Temporary Session Data
 ▼
Cloudflare KV
 │
 │ Proxy Requests
 ▼
Upstream Result Service
```

---

# Project Structure

```
ssc-result-checker/

├── frontend/
│   └── React + Vite application
│
└── worker/
    └── Cloudflare Worker API
```

---

# Frontend

Location:

```
frontend/
```

Technology:

* React
* Vite

Responsibilities:

* Result search interface
* Captcha display
* User input handling
* API communication

---

# Backend Worker

Location:

```
worker/
```

Technology:

* Cloudflare Workers
* Wrangler
* Cloudflare KV

Responsibilities:

* API endpoints
* CORS handling
* Session management
* Cookie persistence
* Upstream request forwarding

---

# Deployment

## Requirements

Install:

* Node.js 18+
* npm
* Wrangler CLI

Install Wrangler:

```bash
npm install -g wrangler
```

---

# Deploy Worker

Go to worker directory:

```bash
cd worker
```

Install dependencies:

```bash
npm install
```

Login to Cloudflare:

```bash
npx wrangler login
```

---

## Configure KV

Create KV namespace:

```bash
npx wrangler kv namespace create SESSIONS
```

Copy the generated ID.

Update:

```
worker/wrangler.toml
```

Example:

```toml
kv_namespaces = [
  { binding = "SESSIONS", id = "YOUR_KV_ID" }
]
```

---

## Worker Configuration

`worker/wrangler.toml`

Example:

```toml
name = "ssc-result-checker-api"
main = "src/index.js"
compatibility_date = "2026-01-01"

[vars]
ALLOWED_ORIGIN = "https://your-frontend-domain.com"
```

`ALLOWED_ORIGIN` must match the deployed frontend domain exactly.

---

## Deploy Worker

```bash
npx wrangler deploy
```

Save the generated Worker URL.

Example:

```
https://ssc-result-checker-api.<account>.workers.dev
```

---

# Deploy Frontend

Go to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create environment file:

```
.env
```

Add:

```env
VITE_API_URL=https://your-worker-url.workers.dev
```

Build:

```bash
npm run build
```

Deploy the generated application to Vercel.

---

# After Frontend Deployment

Update Worker CORS configuration:

```
worker/wrangler.toml
```

Example:

```toml
[vars]
ALLOWED_ORIGIN = "https://your-app.vercel.app"
```

Redeploy:

```bash
cd worker
npx wrangler deploy
```

---

# Environment Variables

## Worker

| Variable         | Purpose                          |
| ---------------- | -------------------------------- |
| `ALLOWED_ORIGIN` | Allowed frontend origin for CORS |

## Frontend

| Variable       | Purpose             |
| -------------- | ------------------- |
| `VITE_API_URL` | Worker API endpoint |

---

# Production Checklist

Before going live:

* [ ] Worker deployed successfully
* [ ] KV namespace configured
* [ ] Frontend environment variables updated
* [ ] CORS origin matches production domain
* [ ] HTTPS enabled
* [ ] Session cookies configured securely
* [ ] Rate limiting enabled
* [ ] Error logging monitored

---

# Security Notes

## CORS

Never use:

```
*
```

for production when credentials are involved.

Allow only trusted frontend origins.

---

## Cookies

Production cookies should use:

```
HttpOnly
Secure
SameSite=None
```

---

## Abuse Prevention

Recommended:

* Cloudflare Rate Limiting
* Cloudflare Turnstile
* Request throttling
* Monitoring and logging

---

# Limitations

* The upstream result service is undocumented.
* Captcha behavior may change without notice.
* Availability depends on the upstream service.
* This application does not modify or store examination records.

---

# Disclaimer

SSC Result Checker is an independent utility and is not affiliated with the Ministry of Education, Bangladesh Education Boards, or any government authority.

For official examination results, users should use:

https://www.educationboardresults.gov.bd/v2/home
