import { Router } from 'express';
import type { HealthCheck } from '@referral-site/shared';

const router = Router();

const startTime = Date.now();

/**
 * GET /healthz
 * Health check endpoint
 */
router.get('/healthz', (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  
  const health: HealthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime,
    version: process.env.npm_package_version,
  };

  res.json(health);
});

/**
 * GET /metrics
 * Basic metrics endpoint (Prometheus-ready)
 */
router.get('/metrics', (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  
  res.set('Content-Type', 'text/plain');
  res.send(`
# HELP process_uptime_seconds Process uptime in seconds
# TYPE process_uptime_seconds gauge
process_uptime_seconds ${uptime}

# HELP nodejs_version_info Node.js version info
# TYPE nodejs_version_info gauge
nodejs_version_info{version="${process.version}"} 1
  `.trim());
});

export default router;
