import mongoose, { Document, Schema } from 'mongoose';

export interface ISystemConfiguration extends Document {
  setupCompleted: boolean;
  setupStep: number;
  defaultDataSources: string[];
  defaultEnrichmentServices: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SystemConfigurationSchema = new Schema({
  setupCompleted: { type: Boolean, default: false },
  setupStep: { type: Number, default: 0 },
  defaultDataSources: { type: [String], default: [] },
  defaultEnrichmentServices: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model<ISystemConfiguration>('SystemConfiguration', SystemConfigurationSchema);