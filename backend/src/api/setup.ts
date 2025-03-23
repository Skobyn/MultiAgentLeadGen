import express, { Request, Response } from 'express';
import SystemConfiguration from '../models/SystemConfiguration';
import IntegrationService from '../services/IntegrationService';

const router = express.Router();

/**
 * @route   GET /api/setup/status
 * @desc    Check setup completion state
 * @access  Private
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    // Get or create system configuration
    let config = await SystemConfiguration.findOne();
    
    if (!config) {
      config = new SystemConfiguration();
      await config.save();
    }
    
    res.json({
      setupCompleted: config.setupCompleted,
      setupStep: config.setupStep
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Server error' 
    });
  }
});

/**
 * @route   POST /api/setup/start
 * @desc    Initialize setup process
 * @access  Private
 */
router.post('/start', async (req: Request, res: Response) => {
  try {
    // Get or create system configuration
    let config = await SystemConfiguration.findOne();
    
    if (!config) {
      config = new SystemConfiguration();
    }
    
    // Reset setup state
    config.setupCompleted = false;
    config.setupStep = 1;
    await config.save();
    
    // Initialize default integrations
    await IntegrationService.initializeDefaultIntegrations();
    
    res.json({
      success: true,
      setupStep: config.setupStep
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Server error' 
    });
  }
});

/**
 * @route   POST /api/setup/step/:stepNumber
 * @desc    Save progress for a step
 * @access  Private
 */
router.post('/step/:stepNumber', async (req: Request, res: Response) => {
  try {
    const stepNumber = parseInt(req.params.stepNumber);
    
    if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 4) {
      return res.status(400).json({ success: false, message: 'Invalid step number' });
    }
    
    // Get system configuration
    let config = await SystemConfiguration.findOne();
    
    if (!config) {
      config = new SystemConfiguration();
    }
    
    // Update step number
    config.setupStep = stepNumber;
    
    // Handle step-specific data
    if (stepNumber === 1 && req.body.selectedIntegrations) {
      // Handle integration selection step
      // In a real implementation, we might want to store which integrations were selected
    } else if (stepNumber === 2 && req.body.apiConfigurations) {
      // Handle API configuration step
      const { apiConfigurations } = req.body;
      
      // Update each integration with provided credentials
      for (const [id, credentials] of Object.entries(apiConfigurations)) {
        await IntegrationService.updateIntegration(id, { credentials });
      }
    } else if (stepNumber === 3) {
      // Handle test connections step
      // This would typically be handled by the test-connections endpoint
    }
    
    await config.save();
    
    res.json({
      success: true,
      setupStep: config.setupStep
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Server error' 
    });
  }
});

/**
 * @route   POST /api/setup/complete
 * @desc    Mark setup as complete
 * @access  Private
 */
router.post('/complete', async (req: Request, res: Response) => {
  try {
    // Get system configuration
    let config = await SystemConfiguration.findOne();
    
    if (!config) {
      config = new SystemConfiguration();
    }
    
    // Update configuration
    config.setupCompleted = true;
    
    // Save default settings if provided
    if (req.body.defaultDataSources) {
      config.defaultDataSources = req.body.defaultDataSources;
    }
    
    if (req.body.defaultEnrichmentServices) {
      config.defaultEnrichmentServices = req.body.defaultEnrichmentServices;
    }
    
    await config.save();
    
    res.json({
      success: true,
      setupCompleted: config.setupCompleted
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Server error' 
    });
  }
});

/**
 * @route   POST /api/setup/test-connections
 * @desc    Test all configured connections
 * @access  Private
 */
router.post('/test-connections', async (req: Request, res: Response) => {
  try {
    // Get all integrations
    const integrations = await IntegrationService.getAllIntegrations();
    
    // Filter to only test integrations that are configured
    const configuredIntegrations = integrations.filter(i => i.isConfigured);
    
    const results: Record<string, { success: boolean; message?: string }> = {};
    
    // Test each integration
    for (const integration of configuredIntegrations) {
      results[integration.id] = await IntegrationService.testConnection(integration.id);
    }
    
    res.json({
      success: true,
      results
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Server error' 
    });
  }
});

export default router;