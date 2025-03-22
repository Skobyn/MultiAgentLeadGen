import mongoose, { Document, Schema } from 'mongoose';

// Interface for the contact information
interface IContactInfo {
  email: string;
  emailVerified: boolean;
  phone?: string;
  linkedin?: string;
  twitter?: string;
}

// Interface for company information
interface ICompanyInfo {
  name: string;
  website?: string;
  industry?: string;
  size?: string;
  revenue?: string;
  founded?: number;
  description?: string;
  location?: string;
}

// Interface for enrichment data
interface IEnrichmentData {
  source: string;
  timestamp: Date;
  data: Record<string, any>;
}

// Interface for lead tagging
interface ILeadTag {
  name: string;
  color?: string;
  createdAt: Date;
}

// Interface for activity tracking
interface IActivity {
  type: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Main Lead interface
export interface ILead extends Document {
  userId: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  title: string;
  contactInfo: IContactInfo;
  company: ICompanyInfo;
  source: string;
  sourceId?: string;
  enrichmentData: IEnrichmentData[];
  tags: ILeadTag[];
  activities: IActivity[];
  score?: number;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Lead schema
const LeadSchema = new Schema<ILead>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    contactInfo: {
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
      },
      emailVerified: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        trim: true,
      },
      linkedin: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
    },
    company: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      website: {
        type: String,
        trim: true,
      },
      industry: {
        type: String,
        trim: true,
      },
      size: {
        type: String,
        trim: true,
      },
      revenue: {
        type: String,
        trim: true,
      },
      founded: {
        type: Number,
      },
      description: {
        type: String,
        trim: true,
      },
      location: {
        type: String,
        trim: true,
      },
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    sourceId: {
      type: String,
      trim: true,
    },
    enrichmentData: [
      {
        source: {
          type: String,
          required: true,
          trim: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        data: {
          type: Schema.Types.Mixed,
        },
      },
    ],
    tags: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        color: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    activities: [
      {
        type: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          required: true,
          trim: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        metadata: {
          type: Schema.Types.Mixed,
        },
      },
    ],
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      required: true,
      default: 'new',
      enum: ['new', 'contacted', 'qualified', 'unqualified', 'customer', 'archived'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create compound index for user-specific lead search
LeadSchema.index({ userId: 1, 'company.name': 1 });
LeadSchema.index({ userId: 1, 'contactInfo.email': 1 }, { unique: true });
LeadSchema.index({ userId: 1, firstName: 1, lastName: 1 });
LeadSchema.index({ userId: 1, status: 1 });
LeadSchema.index({ userId: 1, 'tags.name': 1 });

// Text search index
LeadSchema.index(
  {
    firstName: 'text',
    lastName: 'text',
    'company.name': 'text',
    'company.industry': 'text',
    title: 'text',
  },
  {
    weights: {
      firstName: 5,
      lastName: 5,
      'company.name': 3,
      title: 4,
      'company.industry': 2,
    },
    name: 'lead_text_search',
  }
);

// Create virtual for full name
LeadSchema.virtual('fullName').get(function (this: ILead) {
  return `${this.firstName} ${this.lastName}`;
});

// Method to add activity
LeadSchema.methods.addActivity = function (
  type: string,
  description: string,
  metadata?: Record<string, any>
) {
  this.activities.push({
    type,
    description,
    timestamp: new Date(),
    metadata,
  });
  return this.save();
};

// Method to add tag
LeadSchema.methods.addTag = function (name: string, color?: string) {
  if (!this.tags.some((tag) => tag.name === name)) {
    this.tags.push({
      name,
      color,
      createdAt: new Date(),
    });
    return this.save();
  }
  return this;
};

// Method to remove tag
LeadSchema.methods.removeTag = function (name: string) {
  this.tags = this.tags.filter((tag) => tag.name !== name);
  return this.save();
};

// Method to add enrichment data
LeadSchema.methods.addEnrichmentData = function (
  source: string,
  data: Record<string, any>
) {
  this.enrichmentData.push({
    source,
    timestamp: new Date(),
    data,
  });
  return this.save();
};

// Create and export the model
const Lead = mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;