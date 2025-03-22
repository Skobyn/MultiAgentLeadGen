import { Router } from 'express';
import { asyncHandler } from '../../utils/errorHandler';
import * as leadController from '../controllers/lead.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication middleware to all lead routes
router.use(authenticate);

// Lead generation routes
router.post('/generate', asyncHandler(leadController.generateLeads));
router.get('/search', asyncHandler(leadController.searchLeads));
router.get('/', asyncHandler(leadController.getLeads));
router.get('/:id', asyncHandler(leadController.getLeadById));
router.put('/:id', asyncHandler(leadController.updateLead));
router.delete('/:id', asyncHandler(leadController.deleteLead));

// Lead enrichment routes
router.post('/enrich', asyncHandler(leadController.enrichLeads));
router.get('/enrich/status/:jobId', asyncHandler(leadController.getEnrichmentStatus));

// Lead filtering & segmentation
router.post('/filter', asyncHandler(leadController.filterLeads));
router.post('/segment', asyncHandler(leadController.segmentLeads));

// Lead export
router.post('/export', asyncHandler(leadController.exportLeads));

// Lead source management
router.get('/sources', asyncHandler(leadController.getLeadSources));
router.post('/sources', asyncHandler(leadController.addLeadSource));
router.put('/sources/:id', asyncHandler(leadController.updateLeadSource));
router.delete('/sources/:id', asyncHandler(leadController.deleteLeadSource));

export default router;