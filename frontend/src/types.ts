export interface Integration {
  _id: string;
  name: string;
  type: string;
  isEnabled: boolean;
  isConfigured: boolean;
  status: string; // "active", "error", "unconfigured"
  credentials: Record<string, any>;
  lastTested: Date;
  errorMessage?: string;
}

export interface TestResult {
  integrationId: string;
  success: boolean;
  message?: string;
  timestamp: Date;
}

export interface SystemConfiguration {
  id: string;
  setupCompleted: boolean;
  setupStep: number;
  defaultDataSources: string[];
  defaultEnrichmentServices: string[];
} 