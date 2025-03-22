import { Request, Response } from 'express';
import { AppError } from '../../utils/errorHandler';
import logger from '../../utils/logger';
import * as leadService from '../services/lead.service';

// Generate leads based on search criteria
export const generateLeads = async (req: Request, res: Response) => {
  const { sources, criteria, enrichment, limit } = req.body;
  
  if (!sources || !Array.isArray(sources) || sources.length === 0) {
    throw new AppError('At least one data source must be specified', 400);
  }
  
  if (!criteria) {
    throw new AppError('Search criteria must be provided', 400);
  }
  
  logger.info(`Generating leads with criteria: ${JSON.stringify(criteria)}`);
  
  // In a real implementation, this would call the lead service to initiate
  // an asynchronous lead generation process
  const jobId = await leadService.startLeadGeneration(
    req.user.id,
    sources,
    criteria,
    enrichment,
    limit
  );
  
  res.status(202).json({
    success: true,
    data: {
      jobId,
      message: 'Lead generation process started successfully',
    },
  });
};

// Search for leads with filters
export const searchLeads = async (req: Request, res: Response) => {
  const { query, page = 1, limit = 20, sortBy, sortOrder } = req.query;
  
  const leads = await leadService.searchLeads(
    req.user.id,
    query as string,
    Number(page),
    Number(limit),
    sortBy as string,
    sortOrder as 'asc' | 'desc'
  );
  
  res.status(200).json({
    success: true,
    data: leads,
  });
};

// Get all leads for the current user
export const getLeads = async (req: Request, res: Response) => {
  const { page = 1, limit = 20, sortBy, sortOrder } = req.query;
  
  const leads = await leadService.getLeads(
    req.user.id,
    Number(page),
    Number(limit),
    sortBy as string,
    sortOrder as 'asc' | 'desc'
  );
  
  res.status(200).json({
    success: true,
    data: leads,
  });
};

// Get lead by ID
export const getLeadById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const lead = await leadService.getLeadById(req.user.id, id);
  
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }
  
  res.status(200).json({
    success: true,
    data: lead,
  });
};

// Update lead data
export const updateLead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  
  const updatedLead = await leadService.updateLead(req.user.id, id, updates);
  
  if (!updatedLead) {
    throw new AppError('Lead not found', 404);
  }
  
  res.status(200).json({
    success: true,
    data: updatedLead,
  });
};

// Delete lead
export const deleteLead = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const deleted = await leadService.deleteLead(req.user.id, id);
  
  if (!deleted) {
    throw new AppError('Lead not found', 404);
  }
  
  res.status(200).json({
    success: true,
    message: 'Lead deleted successfully',
  });
};

// Enrich leads with additional data
export const enrichLeads = async (req: Request, res: Response) => {
  const { leadIds, enrichmentOptions } = req.body;
  
  if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
    throw new AppError('At least one lead ID must be specified', 400);
  }
  
  if (!enrichmentOptions || !Array.isArray(enrichmentOptions) || enrichmentOptions.length === 0) {
    throw new AppError('At least one enrichment option must be specified', 400);
  }
  
  const jobId = await leadService.startLeadEnrichment(
    req.user.id,
    leadIds,
    enrichmentOptions
  );
  
  res.status(202).json({
    success: true,
    data: {
      jobId,
      message: 'Lead enrichment process started successfully',
    },
  });
};

// Get status of an enrichment job
export const getEnrichmentStatus = async (req: Request, res: Response) => {
  const { jobId } = req.params;
  
  const status = await leadService.getEnrichmentStatus(req.user.id, jobId);
  
  if (!status) {
    throw new AppError('Enrichment job not found', 404);
  }
  
  res.status(200).json({
    success: true,
    data: status,
  });
};

// Filter leads based on complex criteria
export const filterLeads = async (req: Request, res: Response) => {
  const { filters, page = 1, limit = 20, sortBy, sortOrder } = req.body;
  
  if (!filters || Object.keys(filters).length === 0) {
    throw new AppError('At least one filter must be specified', 400);
  }
  
  const leads = await leadService.filterLeads(
    req.user.id,
    filters,
    Number(page),
    Number(limit),
    sortBy,
    sortOrder
  );
  
  res.status(200).json({
    success: true,
    data: leads,
  });
};

// Create lead segments
export const segmentLeads = async (req: Request, res: Response) => {
  const { name, description, filters } = req.body;
  
  if (!name) {
    throw new AppError('Segment name is required', 400);
  }
  
  if (!filters || Object.keys(filters).length === 0) {
    throw new AppError('At least one filter must be specified', 400);
  }
  
  const segment = await leadService.createSegment(
    req.user.id,
    name,
    description,
    filters
  );
  
  res.status(201).json({
    success: true,
    data: segment,
  });
};

// Export leads to various formats
export const exportLeads = async (req: Request, res: Response) => {
  const { leadIds, format = 'csv', fields } = req.body;
  
  if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
    throw new AppError('At least one lead ID must be specified', 400);
  }
  
  const allowedFormats = ['csv', 'xlsx', 'json'];
  if (!allowedFormats.includes(format)) {
    throw new AppError(`Invalid format. Allowed formats: ${allowedFormats.join(', ')}`, 400);
  }
  
  const exportData = await leadService.exportLeads(
    req.user.id,
    leadIds,
    format,
    fields
  );
  
  res.status(200).json({
    success: true,
    data: exportData,
  });
};

// Get available lead sources
export const getLeadSources = async (req: Request, res: Response) => {
  const sources = await leadService.getLeadSources(req.user.id);
  
  res.status(200).json({
    success: true,
    data: sources,
  });
};

// Add a new lead source
export const addLeadSource = async (req: Request, res: Response) => {
  const { name, type, config } = req.body;
  
  if (!name || !type) {
    throw new AppError('Name and type are required for a lead source', 400);
  }
  
  const source = await leadService.addLeadSource(
    req.user.id,
    name,
    type,
    config
  );
  
  res.status(201).json({
    success: true,
    data: source,
  });
};

// Update a lead source
export const updateLeadSource = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  
  const source = await leadService.updateLeadSource(
    req.user.id,
    id,
    updates
  );
  
  if (!source) {
    throw new AppError('Lead source not found', 404);
  }
  
  res.status(200).json({
    success: true,
    data: source,
  });
};

// Delete a lead source
export const deleteLeadSource = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const deleted = await leadService.deleteLeadSource(req.user.id, id);
  
  if (!deleted) {
    throw new AppError('Lead source not found', 404);
  }
  
  res.status(200).json({
    success: true,
    message: 'Lead source deleted successfully',
  });
};