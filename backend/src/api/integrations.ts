import express, { Request, Response } from 'express';
import IntegrationService from '../services/IntegrationService';

const router = express.Router();

/**
 * @route   GET /api/integrations
 * @desc    Get all available integrations
 * @access  Private
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const integrations = await IntegrationService.getAllIntegrations();
    res.json(integrations);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Server error' 
    });
  }
});

/**
 * @route   GET /api/integrations/:id
 * @desc    Get a specific integration
 * @access  Private
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const integration = await IntegrationService.getIntegrationById(req.params.id);
    
    if (!integration) {
      return res.status(404).json({ success: false, message: 'Integration not found' });
    }
    
    res.json(integration);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Server error' 
    });
  }
});

/**
 * @route   PUT /api/integrations/:id
 * @desc    Update integration configuration
 * @access  Private
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, type, credentials, isEnabled } = req.body;
    
    const updatedIntegration = await IntegrationService.updateIntegration(req.params.id, {
      name,
      type,
      credentials,
      isEnabled
    });
    
    if (!updatedIntegration) {
      return res.status(404).json({ success: false, message: 'Integration not found' });
    }
    
    res.json(updatedIntegration);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Server error' 
    });
  }
});

/**
 * @route   POST /api/integrations/:id/test
 * @desc    Test connection for an integration
 * @access  Private
 */
router.post('/:id/test', async (req: Request, res: Response) => {
  try {
    const result = await IntegrationService.testConnection(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Server error' 
    });
  }
});

/**
 * @route   PUT /api/integrations/:id/enable
 * @desc    Enable or disable an integration
 * @access  Private
 */
router.put('/:id/enable', async (req: Request, res: Response) => {
  try {
    const { isEnabled } = req.body;
    
    if (isEnabled === undefined) {
      return res.status(400).json({ success: false, message: 'isEnabled field is required' });
    }
    
    const integration = await IntegrationService.toggleIntegration(req.params.id, isEnabled);
    
    if (!integration) {
      return res.status(404).json({ success: false, message: 'Integration not found' });
    }
    
    res.json(integration);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Server error' 
    });
  }
});

/**
 * @route   POST /api/integrations/batch-update
 * @desc    Update multiple integrations in one request
 * @access  Private
 */
router.post('/batch-update', async (req: Request, res: Response) => {
  try {
    const { updates } = req.body;
    
    if (!Array.isArray(updates)) {
      return res.status(400).json({ success: false, message: 'updates must be an array' });
    }
    
    const results = [];
    
    for (const update of updates) {
      if (!update.id) continue;
      
      const updatedIntegration = await IntegrationService.updateIntegration(update.id, {
        name: update.name,
        type: update.type,
        credentials: update.credentials,
        isEnabled: update.isEnabled
      });
      
      if (updatedIntegration) {
        results.push(updatedIntegration);
      }
    }
    
    res.json({ success: true, count: results.length, results });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Server error' 
    });
  }
});

export default router;