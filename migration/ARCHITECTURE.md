# 🏗 Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          User's Browser                              │
│                      http://localhost:3000                           │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTP/REST
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                         Next.js Web App                              │
│                      apps/web (Port 3000)                            │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  App Router (src/app/)                                      │    │
│  │  ┌──────────┐  ┌──────────────┐  ┌─────────────────┐     │    │
│  │  │  page.tsx│  │ results/     │  │   layout.tsx    │     │    │
│  │  │  (Home)  │  │  page.tsx    │  │  (Root Layout)  │     │    │
│  │  └──────────┘  └──────────────┘  └─────────────────┘     │    │
│  └────────────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Components (src/components/)                               │    │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐     │    │
│  │  │ SearchForm  │  │ProductCard   │  │SearchResults │     │    │
│  │  └─────────────┘  └──────────────┘  └──────────────┘     │    │
│  └────────────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Hooks (src/hooks/)                                         │    │
│  │  ┌──────────────┐                                           │    │
│  │  │ useSearch    │  (SWR for data fetching & caching)       │    │
│  │  └──────────────┘                                           │    │
│  └────────────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  API Client (src/lib/api.ts)                               │    │
│  │  ┌──────────────────────────────────────────────────┐     │    │
│  │  │  axios.post('/api/search', params)               │     │    │
│  │  └──────────────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────────────┘    │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ POST /api/search
                             │ GET /healthz
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                        Express API Server                            │
│                      apps/api (Port 5000)                            │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Routes (src/routes/)                                       │    │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────┐        │    │
│  │  │  search    │  │   health    │  │   index      │        │    │
│  │  │  .routes   │  │   .routes   │  │   .routes    │        │    │
│  │  └────────────┘  └─────────────┘  └──────────────┘        │    │
│  └────────────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Middleware (src/middleware/)                               │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐       │    │
│  │  │  error       │  │  validation  │  │   CORS     │       │    │
│  │  │  .middleware │  │  .middleware │  │   Helmet   │       │    │
│  │  └──────────────┘  └──────────────┘  └────────────┘       │    │
│  └────────────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Services (src/services/)                                   │    │
│  │  ┌────────────────┐  ┌────────────────┐  ┌─────────────┐  │    │
│  │  │ amazon.service │  │parser.service  │  │cache.service│  │    │
│  │  │  (AWS Sig V4)  │  │ (Parse items)  │  │(node-cache) │  │    │
│  │  └────────────────┘  └────────────────┘  └─────────────┘  │    │
│  └────────────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Config (src/config/)                                       │    │
│  │  ┌────────────┐  ┌──────────────┐                          │    │
│  │  │  index.ts  │  │  logger.ts   │  (Pino structured logs)  │    │
│  │  └────────────┘  └──────────────┘                          │    │
│  └────────────────────────────────────────────────────────────┘    │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTPS + AWS Signature V4
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                   Amazon Product Advertising API                     │
│                  webservices.amazon.it/paapi5                        │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  POST /paapi5/searchitems                                   │    │
│  │  - Authentication: AWS Signature V4                         │    │
│  │  - Response: SearchResult with Items[]                      │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     Shared Package (@shared)                         │
│                      packages/shared/src/                            │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  schemas.ts (Zod Schemas)                                   │    │
│  │  - searchRequestSchema                                      │    │
│  │  - productSchema                                            │    │
│  │  - searchResponseSchema                                     │    │
│  └────────────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  types.ts (TypeScript Types)                               │    │
│  │  - Product, SearchRequest, SearchResponse                   │    │
│  │  - AmazonItem, AmazonSearchItemsResponse                    │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Search Request

```
1. User enters "laptop" in SearchForm
   └─> apps/web/src/components/SearchForm.tsx
       │
       ├─> Validates input (keywords required)
       │
       └─> Redirects to /results?keywords=laptop&category=All

2. Results page loads
   └─> apps/web/src/app/results/page.tsx
       │
       ├─> useSearch() hook triggered
       │   └─> apps/web/src/hooks/useSearch.ts
       │       │
       │       └─> SWR calls searchProducts()
       │           └─> apps/web/src/lib/api.ts
       │               │
       │               └─> axios.post('http://localhost:5000/api/search', {...})

3. API receives request
   └─> apps/api/src/routes/search.routes.ts
       │
       ├─> Validates with searchRequestSchema (Zod)
       │   └─> @referral-site/shared/schemas.ts
       │
       ├─> Checks cache (cache.service.ts)
       │   └─> If cached: return immediately
       │
       ├─> Calls amazonService.searchItems()
       │   └─> apps/api/src/services/amazon.service.ts
       │       │
       │       ├─> Builds request payload
       │       ├─> Generates AWS Signature V4
       │       ├─> POST to Amazon PA-API
       │       └─> Returns AmazonSearchItemsResponse

4. Parse Amazon response
   └─> apps/api/src/services/parser.service.ts
       │
       ├─> parseProducts(items: AmazonItem[])
       │   └─> Extracts: title, price, image, rating, etc.
       │
       ├─> filterProducts() (optional)
       │
       └─> Returns Product[]

5. Cache & respond
   └─> apps/api/src/routes/search.routes.ts
       │
       ├─> cacheService.set(key, response)
       │
       └─> res.json({ products, count, error: null })

6. Web renders results
   └─> apps/web/src/components/SearchResults.tsx
       │
       ├─> Maps products to ProductCard[]
       │   └─> apps/web/src/components/ProductCard.tsx
       │       │
       │       └─> Displays: image, title, price, rating, badges
       │
       └─> User sees product grid
```

---

## Deployment Architecture (Render.com)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Render.com                               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Web Service: amazon-finder-api                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Build: pnpm install && pnpm -C apps/api build     │  │  │
│  │  │  Start: pnpm -C apps/api start                     │  │  │
│  │  │  Port: 5000                                        │  │  │
│  │  │  Health: /healthz                                  │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  URL: https://amazon-finder-api.onrender.com           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             ▲                                    │
│                             │ API calls                          │
│                             │                                    │
│  ┌──────────────────────────┴───────────────────────────────┐  │
│  │  Web Service: amazon-finder-web                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Build: pnpm install && pnpm -C apps/web build     │  │  │
│  │  │  Start: pnpm -C apps/web start                     │  │  │
│  │  │  Port: 3000                                        │  │  │
│  │  │  Env: NEXT_PUBLIC_API_URL=https://...api.onr...   │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  URL: https://amazon-finder-web.onrender.com           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Environment Variables (Secret):                                │
│  - AWS_ACCESS_KEY                                               │
│  - AWS_SECRET_KEY                                               │
│  - AMAZON_ASSOCIATE_TAG                                         │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
                    Internet Users 🌍
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend Stack                          │
├─────────────────────────────────────────────────────────────────┤
│  Framework     │ Next.js 14 (React 18)                          │
│  Language      │ TypeScript 5.3                                 │
│  Styling       │ Tailwind CSS 3.4                               │
│  Data Fetching │ SWR 2.2                                        │
│  HTTP Client   │ Axios 1.6                                      │
│  Build Tool    │ Next.js built-in (Turbopack opt-in)           │
│  Package Mgr   │ pnpm 8                                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          Backend Stack                           │
├─────────────────────────────────────────────────────────────────┤
│  Framework     │ Express 4.18                                   │
│  Language      │ TypeScript 5.3                                 │
│  Validation    │ Zod 3.22                                       │
│  HTTP Client   │ Axios 1.6                                      │
│  Caching       │ node-cache 5.1                                 │
│  Logging       │ Pino 8.17                                      │
│  Security      │ Helmet 7.1, CORS 2.8                           │
│  Crypto        │ crypto-js 4.2 (AWS Sig V4)                     │
│  Dev Server    │ tsx (TypeScript Execute)                       │
│  Testing       │ Vitest 1.1, Supertest 6.3                      │
│  Package Mgr   │ pnpm 8                                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       Shared/Monorepo                            │
├─────────────────────────────────────────────────────────────────┤
│  Workspace     │ pnpm workspaces                                │
│  Shared Pkg    │ @referral-site/shared                          │
│  Type System   │ TypeScript (strict mode)                       │
│  Schemas       │ Zod (runtime + compile-time)                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      External Services                           │
├─────────────────────────────────────────────────────────────────┤
│  Amazon API    │ Product Advertising API 5.0                    │
│  Auth Method   │ AWS Signature Version 4                        │
│  Marketplace   │ Amazon.it (Italy)                              │
│  Region        │ eu-west-1                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Folder Structure Tree

```
migration/
├── 📄 pnpm-workspace.yaml         # Workspace config
├── 📄 package.json                # Root package
├── 📄 tsconfig.base.json          # Base TS config
├── 📄 .env.example                # Env template
├── 📄 .gitignore
├── 📄 render.yaml                 # Deploy config
├── 📖 README.md                   # Main docs
├── 📖 RUN_STEPS.md                # Quick start
├── 📖 MIGRATION_SUMMARY.md        # Migration details
└── 📖 VERIFICATION_CHECKLIST.md   # Testing checklist
│
├── 📁 apps/
│   ├── 📁 api/                    # Express API
│   │   ├── 📁 src/
│   │   │   ├── 🟦 server.ts       # Entry point
│   │   │   ├── 🟦 app.ts          # Express setup
│   │   │   ├── 📁 config/
│   │   │   │   ├── 🟦 index.ts    # Config loader
│   │   │   │   └── 🟦 logger.ts   # Pino setup
│   │   │   ├── 📁 routes/
│   │   │   │   ├── 🟦 index.ts    # Router aggregator
│   │   │   │   ├── 🟦 search.routes.ts
│   │   │   │   └── 🟦 health.routes.ts
│   │   │   ├── 📁 services/
│   │   │   │   ├── 🟦 amazon.service.ts
│   │   │   │   ├── 🟦 parser.service.ts
│   │   │   │   └── 🟦 cache.service.ts
│   │   │   └── 📁 middleware/
│   │   │       ├── 🟦 error.middleware.ts
│   │   │       └── 🟦 validation.middleware.ts
│   │   ├── 📁 tests/
│   │   │   └── 🟦 api.test.ts
│   │   ├── 📄 package.json
│   │   ├── 📄 tsconfig.json
│   │   └── 📄 vitest.config.ts
│   │
│   └── 📁 web/                    # Next.js frontend
│       ├── 📁 src/
│       │   ├── 📁 app/
│       │   │   ├── 🟦 layout.tsx
│       │   │   ├── 🟦 page.tsx
│       │   │   ├── 🟦 providers.tsx
│       │   │   ├── 🎨 globals.css
│       │   │   └── 📁 results/
│       │   │       └── 🟦 page.tsx
│       │   ├── 📁 components/
│       │   │   ├── 🟦 Header.tsx
│       │   │   ├── 🟦 SearchForm.tsx
│       │   │   ├── 🟦 SearchResults.tsx
│       │   │   └── 🟦 ProductCard.tsx
│       │   ├── 📁 hooks/
│       │   │   └── 🟦 useSearch.ts
│       │   └── 📁 lib/
│       │       └── 🟦 api.ts
│       ├── 📁 public/
│       ├── 📄 package.json
│       ├── 📄 tsconfig.json
│       ├── 📄 next.config.js
│       ├── 📄 tailwind.config.js
│       └── 📄 postcss.config.js
│
└── 📁 packages/
    └── 📁 shared/                 # Shared types
        ├── 📁 src/
        │   ├── 🟦 index.ts
        │   ├── 🟦 schemas.ts      # Zod schemas
        │   └── 🟦 types.ts        # TS types
        ├── 📄 package.json
        └── 📄 tsconfig.json

Legend:
📁 Folder
📄 Config file
📖 Documentation
🟦 TypeScript file
🎨 CSS file
```

---

## Key Patterns & Principles

### 1. Separation of Concerns
```
Controller (routes) → Service (business logic) → External API
```

### 2. Type Safety (End-to-End)
```
Zod Schema → TypeScript Type → React Props
```

### 3. Error Handling
```
Try/Catch → AppError → Error Middleware → JSON Response
```

### 4. Caching Strategy
```
Request → Check Cache → Hit? Return : Fetch → Cache → Return
```

### 5. Validation Flow
```
HTTP Request → Zod Schema → Validated Data → Controller
```

---

**Architecture designed for:**
- ✅ Scalability (monorepo structure)
- ✅ Maintainability (clean separation)
- ✅ Type Safety (end-to-end TypeScript)
- ✅ Performance (caching at multiple levels)
- ✅ Developer Experience (hot reload, type checking)
