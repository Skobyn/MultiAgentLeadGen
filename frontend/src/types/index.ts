export interface Integration {
  _id: string;
  name: string;
  type: string;  // leadSource, enrichment, email
  isEnabled: boolean;
  isConfigured: boolean;
  status: string;  // active, error, not-configured
  lastTested: string | null;
  errorMessage: string | null;
  credentials: Record<string, string>;
}

export interface SystemConfiguration {
  defaultDataSources: string[];
  defaultEnrichmentServices: string[];
  defaultLeadSources?: string[];
}

export interface TestResult {
  success: boolean;
  message: string;
} 