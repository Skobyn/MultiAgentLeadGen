import { Router } from 'express';
import integrationsRouter from '../integrations';

const router = Router();

// Forward all requests to the integrations router
router.use('/', integrationsRouter);

export default router; 