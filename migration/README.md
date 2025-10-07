# 🔍 Amazon Prime Day Affiliate Finder - Monorepo

> Modern TypeScript monorepo for finding Amazon products and generating affiliate links. Built with Node.js, Express, React, and Next.js.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node: 18+](https://img.shields.io/badge/node-18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)

---

## 📖 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Development](#-development)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)
- [Migration from Python](#-migration-from-python)
- [License](#-license)

---

## ✨ Features

### API Backend
- ✅ **Amazon PA-API 5.0** integration with AWS Signature V4
- ✅ **RESTful API** with Express & TypeScript
- ✅ **Input validation** with Zod schemas
- ✅ **Response caching** (5-minute default TTL)
- ✅ **Structured logging** with Pino
- ✅ **Error handling** middleware
- ✅ **Health checks** & Prometheus metrics
- ✅ **CORS** & security headers (Helmet)

### Web Frontend
- ✅ **Next.js 14** with App Router (SSR/ISR ready)
- ✅ **React 18** with TypeScript
- ✅ **Tailwind CSS** for styling
- ✅ **Dark mode** support
- ✅ **SWR** for data fetching & caching
- ✅ **Responsive design** (mobile-first)
- ✅ **Product cards** with images, ratings, prices
- ✅ **Filtering** (Prime, discounts, price range)
- ✅ **Sorting** (relevance, price, rating, discount)

---

## 🏗 Architecture

```
┌─────────────────┐      HTTP/REST      ┌──────────────────┐
│   Next.js Web   │◄───────────────────►│   Express API    │
│   (Port 3000)   │                     │   (Port 5000)    │
└─────────────────┘                     └──────────────────┘
         │                                       │
         │ Shared Types                          │ AWS Sig V4
         ▼                                       ▼
┌─────────────────┐                     ┌──────────────────┐
│  @shared/types  │                     │  Amazon PA-API   │
│  Zod Schemas    │                     │     (REST)       │
└─────────────────┘                     └──────────────────┘
```

### Monorepo Structure
- **`apps/api`** — Node.js + Express backend
- **`apps/web`** — Next.js frontend
- **`packages/shared`** — Shared TypeScript types & Zod schemas

---

## 📋 Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** 8+ (Install: `npm install -g pnpm`)
- **Amazon Product Advertising API** credentials:
  - AWS Access Key
  - AWS Secret Key
  - Amazon Associate Tag ([Sign up](https://affiliate-program.amazon.it/))

> ⚠️ **Important:** You need to generate at least **3 sales** through your Associate Tag to get PA-API access.

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd migration
```

### 2. Install Dependencies

```bash
pnpm install
```

This installs dependencies for all workspaces (api, web, shared).

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Amazon API credentials:

```env
# Amazon API
AWS_ACCESS_KEY=your_access_key_here
AWS_SECRET_KEY=your_secret_key_here
AMAZON_ASSOCIATE_TAG=your_associate_tag_here
AMAZON_REGION=eu-west-1
AMAZON_MARKETPLACE=www.amazon.it

# API Server
PORT=5000

# Web App
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Build Shared Package

```bash
pnpm -C packages/shared build
```

### 5. Start Development Servers

#### Option A: Run Both (Parallel)
```bash
pnpm dev
```

#### Option B: Run Separately
```bash
# Terminal 1 - API
pnpm -C apps/api dev

# Terminal 2 - Web
pnpm -C apps/web dev
```

### 6. Open Browser

- **Web App:** http://localhost:3000
- **API:** http://localhost:5000
- **Health Check:** http://localhost:5000/healthz

---

## 📁 Project Structure

```
migration/
├── pnpm-workspace.yaml        # Workspace config
├── package.json               # Root package
├── tsconfig.base.json         # Base TypeScript config
├── .env.example               # Environment template
├── render.yaml                # Render.com deploy config
│
├── apps/
│   ├── api/                   # Express API
│   │   ├── src/
│   │   │   ├── server.ts      # Entry point
│   │   │   ├── app.ts         # Express app
│   │   │   ├── config/        # Config & logger
│   │   │   ├── routes/        # API routes
│   │   │   ├── services/      # Business logic
│   │   │   └── middleware/    # Error handling, validation
│   │   ├── tests/             # API tests
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                   # Next.js frontend
│       ├── src/
│       │   ├── app/           # App Router pages
│       │   ├── components/    # React components
│       │   ├── hooks/         # Custom hooks (SWR)
│       │   └── lib/           # API client
│       ├── public/            # Static assets
│       ├── package.json
│       └── tsconfig.json
│
└── packages/
    └── shared/                # Shared types
        ├── src/
        │   ├── schemas.ts     # Zod schemas
        │   ├── types.ts       # TypeScript types
        │   └── index.ts       # Exports
        ├── package.json
        └── tsconfig.json
```

---

## 🔐 Environment Variables

### API (`apps/api`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AWS_ACCESS_KEY` | ✅ | - | Amazon PA-API access key |
| `AWS_SECRET_KEY` | ✅ | - | Amazon PA-API secret key |
| `AMAZON_ASSOCIATE_TAG` | ✅ | - | Your Amazon Associate tracking ID |
| `AMAZON_REGION` | ❌ | `eu-west-1` | AWS region |
| `AMAZON_MARKETPLACE` | ❌ | `www.amazon.it` | Amazon marketplace domain |
| `PORT` | ❌ | `5000` | API server port |
| `NODE_ENV` | ❌ | `development` | Environment (`development`/`production`) |
| `CORS_ORIGIN` | ❌ | `*` | Allowed CORS origins |
| `CACHE_TTL` | ❌ | `300` | Cache time-to-live (seconds) |
| `LOG_LEVEL` | ❌ | `info` | Logging level |

### Web (`apps/web`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ | `http://localhost:5000` | API backend URL |
| `PORT` | ❌ | `3000` | Next.js server port |

---

## 💻 Development

### Available Scripts

#### Root
```bash
pnpm dev          # Start all services in dev mode
pnpm build        # Build all packages
pnpm test         # Run all tests
pnpm lint         # Lint all packages
pnpm clean        # Clean all build artifacts
```

#### API (`apps/api`)
```bash
pnpm -C apps/api dev          # Start with hot reload (tsx watch)
pnpm -C apps/api build        # Build to dist/
pnpm -C apps/api start        # Start production build
pnpm -C apps/api test         # Run Vitest tests
pnpm -C apps/api lint         # ESLint
```

#### Web (`apps/web`)
```bash
pnpm -C apps/web dev          # Start Next.js dev server
pnpm -C apps/web build        # Build for production
pnpm -C apps/web start        # Start production server
pnpm -C apps/web lint         # Next.js linting
```

### Testing

```bash
# API integration tests
pnpm -C apps/api test

# Run with coverage
pnpm -C apps/api test --coverage
```

---

## 🚢 Deployment

### Render.com (Recommended)

This project includes a `render.yaml` blueprint for one-click deployment:

1. **Push to GitHub**
2. **Connect to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - New → Blueprint
   - Connect your repository
3. **Set Environment Variables:**
   - `AWS_ACCESS_KEY`
   - `AWS_SECRET_KEY`
   - `AMAZON_ASSOCIATE_TAG`
4. **Deploy** 🎉

Services will be available at:
- API: `https://amazon-finder-api.onrender.com`
- Web: `https://amazon-finder-web.onrender.com`

### Manual Deployment

#### API
```bash
# Build
pnpm install
pnpm -C packages/shared build
pnpm -C apps/api build

# Start
cd apps/api
PORT=5000 node dist/server.js
```

#### Web
```bash
# Build
pnpm install
pnpm -C apps/web build

# Start
cd apps/web
PORT=3000 pnpm start
```

---

## 📚 API Documentation

### Endpoints

#### `GET /healthz`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-07T10:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

#### `POST /api/search`
Search for Amazon products.

**Request Body:**
```json
{
  "keywords": "laptop",
  "category": "Computers",
  "maxPrice": 1000,
  "primeOnly": false,
  "discountOnly": false,
  "itemCount": 10
}
```

**Response:**
```json
{
  "products": [
    {
      "asin": "B08...",
      "title": "Product Title",
      "url": "https://www.amazon.it/dp/B08...?tag=yourtag",
      "imageUrl": "https://...",
      "brand": "Brand Name",
      "price": {
        "current": 799.99,
        "currentFormatted": "€799,99",
        "original": 999.99,
        "originalFormatted": "€999,99",
        "discountPercent": 20
      },
      "isPrime": true,
      "rating": {
        "stars": 4.5,
        "count": 1234
      },
      "features": ["Feature 1", "Feature 2"]
    }
  ],
  "count": 10,
  "error": null
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. `pip: command not found` (Original Python Error)
**Solution:** This error is from the old Python setup. You no longer need pip—use `pnpm` instead.

#### 2. Amazon API Errors
**Error:** `"InvalidParameterValue"` or `"NoCredentials"`

**Solution:**
- Verify your `.env.local` credentials
- Check that your Associate Tag has 3+ sales
- Ensure correct region (`eu-west-1` for Italy)

#### 3. CORS Errors in Browser
**Error:** `Access-Control-Allow-Origin`

**Solution:**
```env
# In API .env
CORS_ORIGIN=http://localhost:3000
```

#### 4. Module Not Found Errors
**Error:** `Cannot find module '@referral-site/shared'`

**Solution:**
```bash
# Build shared package first
pnpm -C packages/shared build

# Then restart dev servers
pnpm dev
```

#### 5. Rate Limit Errors
**Error:** `"RequestThrottled"`

**Solution:**
- API caches results for 5 minutes
- Avoid duplicate searches
- Use the cache flush endpoint (dev only): `GET /api/search/cache/flush`

---

## 🔄 Migration from Python

### Route Mapping

| Python (Flask) | Node.js (Express) | Notes |
|----------------|-------------------|-------|
| `GET /` | `GET /` | Service info |
| `POST /search` | `POST /api/search` | Search products |
| - | `GET /healthz` | New health check |
| - | `GET /metrics` | New metrics endpoint |

### Key Changes

1. **Package Manager:** `pip` → `pnpm`
2. **Framework:** Flask → Express (API), Jinja → Next.js (Web)
3. **Types:** Dynamic Python → Static TypeScript
4. **Validation:** Manual → Zod schemas
5. **Amazon SDK:** `python-amazon-paapi` → Custom AWS Signature V4 implementation
6. **Caching:** Flask-Caching → node-cache
7. **Logging:** Python `logging` → Pino
8. **Templates:** Jinja2 `.html` → React `.tsx` components

### Parity Checklist

- [x] Search with keywords
- [x] Category filtering
- [x] Price filtering
- [x] Prime-only filter
- [x] Discount-only filter
- [x] Product parsing (price, rating, images)
- [x] Affiliate link generation
- [x] Response caching
- [x] Error handling
- [x] CORS support

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Support

For issues or questions:
- Open a [GitHub Issue](https://github.com/yourusername/yourrepo/issues)
- Check the [Troubleshooting](#-troubleshooting) section

---

**Built with ❤️ for Prime Day 2025**
