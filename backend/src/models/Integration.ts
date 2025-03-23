import mongoose, { Document, Schema } from 'mongoose';

export interface ICredentials {
  apiKey?: string;
  apiSecret?: string;
  username?: string;
  password?: string;
  url?: string;
  [key: string]: string | undefined;
}

export interface IIntegration extends Document {
  name: string;
  type: string;
  isEnabled: boolean;
  isConfigured: boolean;
  credentials: ICredentials;
  lastTested: Date;
  status: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CredentialsSchema = new Schema({
  apiKey: { type: String, required: false },
  apiSecret: { type: String, required: false },
  username: { type: String, required: false },
  password: { type: String, required: false },
  url: { type: String, required: false }
}, { _id: false, strict: false });

const IntegrationSchema = new Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['leadSource', 'enrichment', 'email']
  },
  isEnabled: { type: Boolean, default: false },
  isConfigured: { type: Boolean, default: false },
  credentials: { type: CredentialsSchema, default: {} },
  lastTested: { type: Date, default: null },
  status: { 
    type: String, 
    default: 'unconfigured',
    enum: ['active', 'error', 'unconfigured']
  },
  errorMessage: { type: String, default: null }
}, { timestamps: true });

// Encrypt sensitive credentials before saving
IntegrationSchema.pre('save', function(next) {
  // Encryption logic would go here
  // For example, using crypto module to encrypt API keys and passwords
  next();
});

export default mongoose.model<IIntegration>('Integration', IntegrationSchema);