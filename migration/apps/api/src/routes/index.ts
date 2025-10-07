import { Router } from 'express';
import searchRoutes from './search.routes';
import healthRoutes from './health.routes';

const router = Router();

// Mount routes
router.use('/search', searchRoutes);
router.use('/', healthRoutes);

export default router;
