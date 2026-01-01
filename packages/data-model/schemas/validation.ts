/**
 * Nexus Core Entities - Zod Validation Schemas
 * Version: 1.0.0
 * 
 * Validation schemas for all Nexus core entities using Zod.
 * These schemas ensure data integrity and provide runtime type checking.
 */

import { z } from 'zod';

// ============================================================================
// BASE SCHEMAS
// ============================================================================

export const RecordStatusSchema = z.enum(['pending', 'completed', 'archived', 'cancelled']);
export const RecordOriginSchema = z.enum(['manual', 'imported', 'automatic']);
export const ProjectStatusSchema = z.enum(['planned', 'active', 'paused', 'completed', 'abandoned']);
export const ResourceTypeSchema = z.enum(['money', 'time', 'energy', 'attention', 'health', 'physical_space']);
export const MetricTypeSchema = z.enum(['numeric', 'categorical', 'boolean']);
export const MetricOriginSchema = z.enum(['manual', 'imported', 'derived']);
export const EntityTypeSchema = z.enum(['record', 'event', 'person', 'project', 'metric']);

// ============================================================================
// SUPPORTING SCHEMAS
// ============================================================================

export const RecurrenceRuleSchema = z.object({
  pattern: z.enum(['daily', 'weekly', 'monthly', 'yearly', 'custom']),
  interval: z.number().int().positive(),
  end_date: z.string().datetime().optional(),
  days_of_week: z.array(z.number().int().min(0).max(6)).optional(),
  day_of_month: z.number().int().min(1).max(31).optional(),
  month_of_year: z.number().int().min(1).max(12).optional(),
});

export const ResourceImpactsSchema = z.object({
  money: z.number().optional(),
  time: z.number().optional(),
  energy: z.number().optional(),
  attention: z.number().optional(),
  health: z.number().optional(),
  physical_space: z.number().optional(),
});

export const ContactDataSchema = z.record(z.any()).default({});

export const ImportantDateSchema = z.object({
  label: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  recurring: z.boolean().optional(),
});

export const MetricValueSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('numeric'),
    value: z.number(),
  }),
  z.object({
    type: z.literal('categorical'),
    value: z.string(),
  }),
  z.object({
    type: z.literal('boolean'),
    value: z.boolean(),
  }),
]);

// ============================================================================
// CORE ENTITY SCHEMAS
// ============================================================================

export const RecordSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  
  // Core fields
  record_type: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable(),
  timestamp: z.string().datetime(),
  status: RecordStatusSchema,
  
  // Classification and organization
  tags: z.array(z.string()).default([]),
  associated_domains: z.array(z.string()).default([]),
  
  // Origin tracking
  origin: RecordOriginSchema,
  
  // Metadata
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  
  // AI enrichment
  ai_metadata: z.record(z.any()).default({}),
});

export const EventSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  
  // Core fields
  title: z.string().min(1),
  description: z.string().nullable(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime().nullable(),
  
  // Recurrence
  recurrence: RecurrenceRuleSchema.nullable(),
  
  // Impacts on resources
  impacts: ResourceImpactsSchema.default({}),
  
  // Metadata
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  
  // AI enrichment
  ai_metadata: z.record(z.any()).default({}),
});

export const PersonSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  
  // Core fields
  name: z.string().min(1),
  relationship_type: z.string().nullable(),
  
  // Contact information
  contact_data: ContactDataSchema,
  
  // Important dates
  important_dates: z.array(ImportantDateSchema).default([]),
  
  // Metadata
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  
  // AI enrichment
  ai_metadata: z.record(z.any()).default({}),
});

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  
  // Core fields
  name: z.string().min(1),
  description: z.string().nullable(),
  goal: z.string().nullable(),
  
  // Status and timeline
  status: ProjectStatusSchema,
  start_date: z.string().datetime().nullable(),
  end_date: z.string().datetime().nullable(),
  
  // Metadata
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  
  // AI enrichment
  ai_metadata: z.record(z.any()).default({}),
});

export const ResourceSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  
  // Core fields
  resource_type: ResourceTypeSchema,
  unit: z.string().min(1),
  current_value: z.number(),
  
  // Origin
  origin: z.string().nullable(),
  
  // Metadata
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const ResourceChangeSchema = z.object({
  id: z.string().uuid(),
  resource_id: z.string().uuid(),
  
  // Change details
  delta: z.number(),
  timestamp: z.string().datetime(),
  
  // Source tracking
  source_record_id: z.string().uuid().nullable(),
  source_event_id: z.string().uuid().nullable(),
  
  // Metadata
  created_at: z.string().datetime(),
});

export const MetricSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  
  // Core fields
  name: z.string().min(1),
  metric_type: MetricTypeSchema,
  value: MetricValueSchema,
  timestamp: z.string().datetime(),
  
  // Origin
  origin: MetricOriginSchema,
  
  // Metadata
  created_at: z.string().datetime(),
});

// ============================================================================
// RELATIONSHIP SCHEMAS
// ============================================================================

export const RecordLinkSchema = z.object({
  id: z.string().uuid(),
  record_id: z.string().uuid(),
  entity_type: EntityTypeSchema,
  entity_id: z.string().uuid(),
  relationship_type: z.string().min(1),
  created_at: z.string().datetime(),
});

export const EventParticipantSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  person_id: z.string().uuid(),
  created_at: z.string().datetime(),
});

export const EventRecordSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  record_id: z.string().uuid(),
  created_at: z.string().datetime(),
});

export const ProjectRecordSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid(),
  record_id: z.string().uuid(),
  created_at: z.string().datetime(),
});

export const ProjectMetricSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid(),
  metric_id: z.string().uuid(),
  created_at: z.string().datetime(),
});

export const PersonRecordSchema = z.object({
  id: z.string().uuid(),
  person_id: z.string().uuid(),
  record_id: z.string().uuid(),
  created_at: z.string().datetime(),
});

export const PersonInteractionSchema = z.object({
  id: z.string().uuid(),
  person_id: z.string().uuid(),
  event_id: z.string().uuid(),
  created_at: z.string().datetime(),
});

export const MetricRecordSchema = z.object({
  id: z.string().uuid(),
  metric_id: z.string().uuid(),
  record_id: z.string().uuid(),
  created_at: z.string().datetime(),
});

// ============================================================================
// INPUT SCHEMAS (for creation)
// ============================================================================

export const CreateRecordInputSchema = z.object({
  record_type: z.string().min(1),
  title: z.string().min(1).max(500),
  description: z.string().max(10000).optional(),
  timestamp: z.string().datetime().optional(),
  status: RecordStatusSchema.optional(),
  tags: z.array(z.string()).optional(),
  associated_domains: z.array(z.string()).optional(),
  origin: RecordOriginSchema.optional(),
  ai_metadata: z.record(z.any()).optional(),
});

export const CreateEventInputSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(10000).optional(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime().optional(),
  recurrence: RecurrenceRuleSchema.optional(),
  impacts: ResourceImpactsSchema.optional(),
  ai_metadata: z.record(z.any()).optional(),
}).refine(
  (data) => {
    if (data.end_time) {
      return new Date(data.end_time) >= new Date(data.start_time);
    }
    return true;
  },
  {
    message: "end_time must be after or equal to start_time",
    path: ["end_time"],
  }
);

export const CreatePersonInputSchema = z.object({
  name: z.string().min(1).max(200),
  relationship_type: z.string().max(100).optional(),
  contact_data: ContactDataSchema.optional(),
  important_dates: z.array(ImportantDateSchema).optional(),
  ai_metadata: z.record(z.any()).optional(),
});

export const CreateProjectInputSchema = z.object({
  name: z.string().min(1).max(500),
  description: z.string().max(10000).optional(),
  goal: z.string().max(1000).optional(),
  status: ProjectStatusSchema.optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  ai_metadata: z.record(z.any()).optional(),
}).refine(
  (data) => {
    if (data.start_date && data.end_date) {
      return new Date(data.end_date) >= new Date(data.start_date);
    }
    return true;
  },
  {
    message: "end_date must be after or equal to start_date",
    path: ["end_date"],
  }
);

export const CreateResourceInputSchema = z.object({
  resource_type: ResourceTypeSchema,
  unit: z.string().min(1).max(50),
  current_value: z.number().optional(),
  origin: z.string().max(200).optional(),
});

export const CreateMetricInputSchema = z.object({
  name: z.string().min(1).max(200),
  metric_type: MetricTypeSchema,
  value: MetricValueSchema,
  timestamp: z.string().datetime().optional(),
  origin: MetricOriginSchema.optional(),
});

export const CreateRecordLinkInputSchema = z.object({
  record_id: z.string().uuid(),
  entity_type: EntityTypeSchema,
  entity_id: z.string().uuid(),
  relationship_type: z.string().min(1).max(100),
});

// ============================================================================
// UPDATE SCHEMAS (for partial updates)
// ============================================================================

export const UpdateRecordInputSchema = CreateRecordInputSchema.partial();
export const UpdateEventInputSchema = CreateEventInputSchema.partial();
export const UpdatePersonInputSchema = CreatePersonInputSchema.partial();
export const UpdateProjectInputSchema = CreateProjectInputSchema.partial();
export const UpdateResourceInputSchema = CreateResourceInputSchema.partial();
export const UpdateMetricInputSchema = CreateMetricInputSchema.partial();

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

export const RecordQuerySchema = z.object({
  status: RecordStatusSchema.optional(),
  record_type: z.string().optional(),
  tags: z.array(z.string()).optional(),
  domains: z.array(z.string()).optional(),
  from_date: z.string().datetime().optional(),
  to_date: z.string().datetime().optional(),
  search: z.string().optional(),
  limit: z.number().int().positive().max(1000).optional(),
  offset: z.number().int().nonnegative().optional(),
});

export const EventQuerySchema = z.object({
  from_date: z.string().datetime().optional(),
  to_date: z.string().datetime().optional(),
  person_id: z.string().uuid().optional(),
  limit: z.number().int().positive().max(1000).optional(),
  offset: z.number().int().nonnegative().optional(),
});

export const ProjectQuerySchema = z.object({
  status: ProjectStatusSchema.optional(),
  search: z.string().optional(),
  limit: z.number().int().positive().max(1000).optional(),
  offset: z.number().int().nonnegative().optional(),
});

export const MetricQuerySchema = z.object({
  name: z.string().optional(),
  metric_type: MetricTypeSchema.optional(),
  from_date: z.string().datetime().optional(),
  to_date: z.string().datetime().optional(),
  limit: z.number().int().positive().max(1000).optional(),
  offset: z.number().int().nonnegative().optional(),
});

// ============================================================================
// TYPE EXPORTS (inferred from schemas)
// ============================================================================

export type RecordStatus = z.infer<typeof RecordStatusSchema>;
export type RecordOrigin = z.infer<typeof RecordOriginSchema>;
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;
export type ResourceType = z.infer<typeof ResourceTypeSchema>;
export type MetricType = z.infer<typeof MetricTypeSchema>;
export type MetricOrigin = z.infer<typeof MetricOriginSchema>;
export type EntityType = z.infer<typeof EntityTypeSchema>;

export type RecurrenceRule = z.infer<typeof RecurrenceRuleSchema>;
export type ResourceImpacts = z.infer<typeof ResourceImpactsSchema>;
export type ContactData = z.infer<typeof ContactDataSchema>;
export type ImportantDate = z.infer<typeof ImportantDateSchema>;
export type MetricValue = z.infer<typeof MetricValueSchema>;

export type Record = z.infer<typeof RecordSchema>;
export type Event = z.infer<typeof EventSchema>;
export type Person = z.infer<typeof PersonSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Resource = z.infer<typeof ResourceSchema>;
export type ResourceChange = z.infer<typeof ResourceChangeSchema>;
export type Metric = z.infer<typeof MetricSchema>;

export type RecordLink = z.infer<typeof RecordLinkSchema>;
export type EventParticipant = z.infer<typeof EventParticipantSchema>;
export type EventRecord = z.infer<typeof EventRecordSchema>;
export type ProjectRecord = z.infer<typeof ProjectRecordSchema>;
export type ProjectMetric = z.infer<typeof ProjectMetricSchema>;
export type PersonRecord = z.infer<typeof PersonRecordSchema>;
export type PersonInteraction = z.infer<typeof PersonInteractionSchema>;
export type MetricRecord = z.infer<typeof MetricRecordSchema>;

export type CreateRecordInput = z.infer<typeof CreateRecordInputSchema>;
export type CreateEventInput = z.infer<typeof CreateEventInputSchema>;
export type CreatePersonInput = z.infer<typeof CreatePersonInputSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;
export type CreateResourceInput = z.infer<typeof CreateResourceInputSchema>;
export type CreateMetricInput = z.infer<typeof CreateMetricInputSchema>;
export type CreateRecordLinkInput = z.infer<typeof CreateRecordLinkInputSchema>;

export type UpdateRecordInput = z.infer<typeof UpdateRecordInputSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventInputSchema>;
export type UpdatePersonInput = z.infer<typeof UpdatePersonInputSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectInputSchema>;
export type UpdateResourceInput = z.infer<typeof UpdateResourceInputSchema>;
export type UpdateMetricInput = z.infer<typeof UpdateMetricInputSchema>;

export type RecordQuery = z.infer<typeof RecordQuerySchema>;
export type EventQuery = z.infer<typeof EventQuerySchema>;
export type ProjectQuery = z.infer<typeof ProjectQuerySchema>;
export type MetricQuery = z.infer<typeof MetricQuerySchema>;
