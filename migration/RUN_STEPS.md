# Python to Node.js Migration - Run Steps

## 🎯 Overview
This document provides step-by-step instructions to run the migrated Node.js/TypeScript monorepo.

---

## ✅ Step 1: Navigate to Migration Folder

```bash
cd /Users/scapitici/ReferralSite_API_Amazon/migration
```

---

## ✅ Step 2: Install pnpm (if not installed)

```bash
# Check if pnpm is installed
pnpm --version

# If not installed, install globally
npm install -g pnpm@8.15.0

# Or use Homebrew on macOS
brew install pnpm
```

---

## ✅ Step 3: Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

This command installs dependencies for:
- Root workspace
- `apps/api` (Express backend)
- `apps/web` (Next.js frontend)
- `packages/shared` (Shared types)

Expected output:
```
Packages: +XXX
Progress: resolved XXX, reused XXX, downloaded XX, added XXX
Done in Xs
```

---

## ✅ Step 4: Copy Environment File

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```bash
# Use your preferred editor
nano .env.local
# or
code .env.local
# or
vim .env.local
```

**Required values:**
```env
AWS_ACCESS_KEY=your_actual_access_key
AWS_SECRET_KEY=your_actual_secret_key
AMAZON_ASSOCIATE_TAG=your_actual_tag
```

---

## ✅ Step 5: Build Shared Package

The shared package must be built before starting the apps:

```bash
pnpm -C packages/shared build
```

Expected output:
```
> @referral-site/shared@1.0.0 build
> tsc
```

---

## ✅ Step 6: Start Development Servers

### Option A: Start All Services (Recommended)

```bash
pnpm dev
```

This starts both API and Web in parallel.

### Option B: Start Services Separately

**Terminal 1 - API Backend:**
```bash
pnpm -C apps/api dev
```

Expected output:
```
[12:00:00] Server started successfully
    port: 5000
    env: development
    marketplace: www.amazon.it
```

**Terminal 2 - Web Frontend:**
```bash
pnpm -C apps/web dev
```

Expected output:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Ready in XXXms
```

---

## ✅ Step 7: Verify Installation

Open your browser and test these URLs:

1. **Web App:** http://localhost:3000
   - Should show the search form
   
2. **API Health Check:** http://localhost:5000/healthz
   - Should return JSON: `{"status":"ok",...}`

3. **API Root:** http://localhost:5000
   - Should return service info

---

## 🧪 Step 8: Run Tests (Optional)

```bash
# Run API tests
pnpm -C apps/api test

# Run with coverage
pnpm -C apps/api test --coverage
```

---

## 📦 Step 9: Build for Production (Optional)

```bash
# Build all packages
pnpm build

# Or build individually
pnpm -C packages/shared build
pnpm -C apps/api build
pnpm -C apps/web build
```

---

## 🚀 Step 10: Run Production Build (Optional)

```bash
# Start API in production mode
pnpm -C apps/api start

# In another terminal, start Web
pnpm -C apps/web start
```

---

## 🔍 Troubleshooting

### Issue: `pnpm: command not found`
**Solution:**
```bash
npm install -g pnpm
```

### Issue: `Cannot find module '@referral-site/shared'`
**Solution:**
```bash
pnpm -C packages/shared build
```

### Issue: TypeScript errors about missing types
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

### Issue: Port already in use
**Solution:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Issue: Amazon API errors
**Possible causes:**
- Invalid credentials in `.env.local`
- Associate tag doesn't have 3+ sales yet
- Wrong region/marketplace configuration

**Solution:**
1. Double-check credentials
2. Verify region matches marketplace (eu-west-1 for .it)
3. Test credentials with a simple API call

---

## 📋 Quick Reference

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm dev` | Start all services in dev mode |
| `pnpm build` | Build all packages |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all code |
| `pnpm clean` | Remove build artifacts |
| `pnpm -C apps/api dev` | Start only API |
| `pnpm -C apps/web dev` | Start only Web |

---

## 🎉 Success Criteria

You've successfully migrated when:

- ✅ `pnpm install` completes without errors
- ✅ Shared package builds successfully
- ✅ API starts on port 5000
- ✅ Web starts on port 3000
- ✅ Health check returns `{"status":"ok"}`
- ✅ Search form loads in browser
- ✅ Can perform a product search (if API credentials are valid)

---

## 📞 Next Steps

1. **Test the search functionality** with real Amazon API credentials
2. **Customize the styling** in `apps/web/src/app/globals.css`
3. **Add more features** (export, saved searches, etc.)
4. **Deploy to Render.com** using the included `render.yaml`

---

## 🔗 Additional Resources

- [pnpm Documentation](https://pnpm.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Amazon PA-API Documentation](https://webservices.amazon.com/paapi5/documentation/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

**Migration Complete! 🚀**
