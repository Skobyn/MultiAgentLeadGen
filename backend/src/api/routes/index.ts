import { Router } from 'express';
import authRoutes from './auth.routes';
import leadRoutes from './lead.routes';
import emailRoutes from './email.routes';
import chatbotRoutes from './chatbot.routes';
import integrationRoutes from './integration.routes';
import setupRoutes from '../setup';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.use('/emails', emailRoutes);
router.use('/chatbot', chatbotRoutes);
router.use('/integrations', integrationRoutes);
router.use('/setup', setupRoutes);

export default router;