# ✅ Manual Verification Checklist

This checklist helps you verify that the migration was successful and everything works as expected.

---

## 🔧 Setup Verification

### 1. Dependencies Installation
```bash
cd /Users/scapitici/ReferralSite_API_Amazon/migration
pnpm install
```

- [ ] Installation completes without errors
- [ ] `node_modules` created in root, apps/api, apps/web, packages/shared
- [ ] No peer dependency warnings (acceptable if present)

### 2. Environment Configuration
```bash
cp .env.example .env.local
# Edit .env.local with real credentials
```

- [ ] `.env.local` file created
- [ ] `AWS_ACCESS_KEY` filled in
- [ ] `AWS_SECRET_KEY` filled in
- [ ] `AMAZON_ASSOCIATE_TAG` filled in
- [ ] Other values reviewed and adjusted if needed

### 3. Build Shared Package
```bash
pnpm -C packages/shared build
```

- [ ] Build completes successfully
- [ ] `packages/shared/dist/` folder created
- [ ] No TypeScript compilation errors

---

## 🚀 Development Server Verification

### 4. Start API Server
```bash
pnpm -C apps/api dev
```

**Expected Console Output:**
```
[HH:MM:SS] INFO: Server started successfully
    port: 5000
    env: development
    marketplace: www.amazon.it
```

- [ ] Server starts without errors
- [ ] Listens on port 5000
- [ ] No uncaught exceptions
- [ ] Logs appear in console (structured JSON in production)

### 5. Start Web Server
```bash
# In a new terminal
pnpm -C apps/web dev
```

**Expected Console Output:**
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Ready in XXXms
```

- [ ] Server starts without errors
- [ ] Listens on port 3000
- [ ] No build warnings
- [ ] Fast Refresh enabled

---

## 🌐 Browser Verification

### 6. Test API Endpoints

#### Health Check
```bash
curl http://localhost:5000/healthz
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-07T...",
  "uptime": 123,
  "version": "1.0.0"
}
```

- [ ] Returns 200 OK
- [ ] JSON response matches schema
- [ ] `status` is `"ok"`

#### Service Info
```bash
curl http://localhost:5000/
```

- [ ] Returns service information
- [ ] No errors in console

#### Metrics
```bash
curl http://localhost:5000/metrics
```

- [ ] Returns Prometheus-formatted metrics
- [ ] Includes `process_uptime_seconds`
- [ ] Includes `nodejs_version_info`

### 7. Test Web Pages

#### Homepage
**URL:** http://localhost:3000

- [ ] Page loads successfully
- [ ] Search form is visible
- [ ] All form fields present:
  - [ ] Keywords input
  - [ ] Category dropdown
  - [ ] Max price input
  - [ ] Prime-only checkbox
  - [ ] Discount-only checkbox
  - [ ] Submit button
- [ ] Dark mode toggle works
- [ ] No console errors
- [ ] Responsive on mobile (resize browser)

#### Search Functionality
**Action:** Submit search form with keywords: "laptop"

- [ ] Redirects to `/results?keywords=laptop&...`
- [ ] Loading spinner appears
- [ ] API call is made (check Network tab)
- [ ] Results page loads

**Expected:**
- If API credentials valid: Product cards displayed
- If API credentials invalid: Error message shown

- [ ] Product cards show:
  - [ ] Image (or placeholder)
  - [ ] Title
  - [ ] Brand (if available)
  - [ ] Price
  - [ ] Rating stars
  - [ ] Prime badge (if applicable)
  - [ ] Discount badge (if applicable)
  - [ ] "Vedi su Amazon" button
- [ ] Sort dropdown works
- [ ] No JavaScript errors in console

---

## 🔌 API Integration Verification

### 8. Search API Call
```bash
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": "laptop",
    "category": "Computers",
    "itemCount": 5
  }'
```

**Expected Response Structure:**
```json
{
  "products": [...],
  "count": 5,
  "error": null
}
```

- [ ] Returns 200 OK (if credentials valid)
- [ ] Returns products array
- [ ] Each product has required fields:
  - [ ] `asin`
  - [ ] `title`
  - [ ] `url` (contains associate tag)
  - [ ] `price.current`
  - [ ] `price.currentFormatted`
- [ ] Affiliate links include your tag

**If API Credentials Invalid:**
- [ ] Returns 400/500 error
- [ ] Error message is clear
- [ ] No stack traces in production mode

### 9. Validation Testing

**Test Invalid Request:**
```bash
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{}'
```

- [ ] Returns 400 Bad Request
- [ ] Error message mentions "keywords"
- [ ] Response is JSON with `error` field

**Test Invalid Category:**
```bash
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": "test",
    "category": "InvalidCategory"
  }'
```

- [ ] Returns 400 Bad Request
- [ ] Error mentions valid categories

---

## 🧪 Testing Verification

### 10. Run Unit Tests
```bash
pnpm -C apps/api test
```

- [ ] All tests pass
- [ ] No test failures
- [ ] Coverage report generated (if enabled)

### 11. Run Type Checking
```bash
# Check API
pnpm -C apps/api type-check

# Check Web
pnpm -C apps/web type-check

# Check Shared
pnpm -C packages/shared type-check
```

- [ ] No TypeScript errors
- [ ] All types resolve correctly

### 12. Run Linting
```bash
pnpm lint
```

- [ ] No linting errors (warnings acceptable)
- [ ] Code follows style guide

---

## 📦 Build Verification

### 13. Production Build
```bash
pnpm build
```

- [ ] All packages build successfully
- [ ] `apps/api/dist/` created
- [ ] `apps/web/.next/` created
- [ ] No build errors

### 14. Run Production Build
```bash
# Start API
pnpm -C apps/api start

# In another terminal, start Web
pnpm -C apps/web start
```

- [ ] Both services start
- [ ] API on port 5000
- [ ] Web on port 3000
- [ ] No runtime errors
- [ ] Pages load correctly

---

## 🔒 Security Verification

### 15. CORS Configuration
**Action:** Try accessing API from different origin

```bash
curl -X POST http://localhost:5000/api/search \
  -H "Origin: http://example.com" \
  -H "Content-Type: application/json" \
  -d '{"keywords":"test"}'
```

- [ ] CORS headers present
- [ ] Respects `CORS_ORIGIN` env var

### 16. Security Headers
```bash
curl -I http://localhost:5000/
```

- [ ] Includes security headers (via Helmet)
- [ ] No sensitive info leaked in headers

---

## 🎨 UI/UX Verification

### 17. Dark Mode
- [ ] Toggle switch works
- [ ] Colors change appropriately
- [ ] Text remains readable
- [ ] No layout shifts

### 18. Responsive Design
**Test on different viewports:**
- [ ] Mobile (375px): Form stacks vertically
- [ ] Tablet (768px): 2-column product grid
- [ ] Desktop (1024px+): 3-4 column product grid
- [ ] No horizontal scroll
- [ ] Touch targets large enough on mobile

### 19. Loading States
- [ ] Spinner shows during search
- [ ] Button disabled during submit
- [ ] No layout shift when results load

### 20. Error States
**Test scenarios:**
- [ ] No results: Friendly message with emoji
- [ ] API error: Red alert box with clear message
- [ ] Network error: Appropriate error handling
- [ ] Invalid input: Form validation messages

---

## 🚀 Deployment Verification (Optional)

### 21. Render.com Deployment
If you're ready to deploy:

```bash
git add .
git commit -m "Complete Python to Node.js migration"
git push origin main
```

- [ ] `render.yaml` is valid
- [ ] Environment variables set in Render dashboard
- [ ] Both services deploy successfully
- [ ] Health checks pass
- [ ] Web app accessible via Render URL

---

## 📊 Performance Verification

### 22. Load Time
- [ ] Homepage loads < 2 seconds
- [ ] Search results load < 3 seconds (after API call)
- [ ] No janky animations
- [ ] Images load progressively

### 23. Cache Verification
**Action:** Search for "laptop" twice

- [ ] First search hits Amazon API (check logs)
- [ ] Second search returns from cache (faster)
- [ ] Cache TTL respects config (5 minutes default)

### 24. Memory Leaks
**Action:** Perform 10+ searches in a row

- [ ] No significant memory growth in API process
- [ ] No browser console warnings
- [ ] App remains responsive

---

## 🔍 Comparison with Python Version

### 25. Feature Parity
Compare with original Python app:

- [ ] All routes work equivalently
- [ ] Search returns same products (given same keywords)
- [ ] Filters produce expected results
- [ ] Affiliate links format matches
- [ ] UI/UX is similar or improved

### 26. Error Handling
- [ ] Errors are as clear or clearer than Python version
- [ ] No stack traces leaked in production
- [ ] User-friendly error messages

---

## ✅ Final Checklist

Before considering migration complete:

- [ ] All setup steps completed
- [ ] All development servers start cleanly
- [ ] All browser tests pass
- [ ] API endpoints respond correctly
- [ ] Search functionality works end-to-end
- [ ] Tests pass
- [ ] Builds succeed
- [ ] Documentation is clear
- [ ] Environment variables documented
- [ ] No critical TODOs remaining

---

## 🐛 Known Issues to Document

If you encounter issues during verification, document them here:

### Issue 1: [Title]
- **Description:**
- **Steps to Reproduce:**
- **Expected Behavior:**
- **Actual Behavior:**
- **Workaround:**

### Issue 2: [Title]
...

---

## 📝 Notes

Add any additional notes or observations:

- 
- 
- 

---

**Verification Status:** [ ] Complete / [ ] Incomplete  
**Verified By:** _________________  
**Date:** _________________  
**Version:** 1.0.0

---

## 🎉 Sign-Off

When all items are checked:

```bash
echo "Migration verified and complete! 🚀"
```

Ready for:
- [ ] Development use
- [ ] Staging deployment
- [ ] Production deployment
- [ ] Handoff to team

---

*Migration completed successfully!*
