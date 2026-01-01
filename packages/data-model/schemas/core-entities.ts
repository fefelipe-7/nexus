/**
 * Nexus Core Entities - TypeScript Type Definitions
 * Version: 1.0.0
 * 
 * Canonical type definitions for the Nexus life operating system.
 * These types correspond directly to the database schema in 002_nexus_core_entities.sql
 */

// ============================================================================
// BASE TYPES
// ============================================================================

export type RecordStatus = 'pending' | 'completed' | 'archived' | 'cancelled';
export type RecordOrigin = 'manual' | 'imported' | 'automatic';
export type ProjectStatus = 'planned' | 'active' | 'paused' | 'completed' | 'abandoned';
export type ResourceType = 'money' | 'time' | 'energy' | 'attention' | 'health' | 'physical_space';
export type MetricType = 'numeric' | 'categorical' | 'boolean';
export type MetricOrigin = 'manual' | 'imported' | 'derived';
export type EntityType = 'record' | 'event' | 'person' | 'project' | 'metric';

// ============================================================================
// CORE ENTITIES
// ============================================================================

/**
 * Record: The fundamental atomic unit of Nexus
 * 
 * Acts as the universal input layer and raw material for all higher-level interpretations.
 * Users never choose modules explicitly - they only create Records.
 */
export interface Record {
  id: string;
  user_id: string;
  
  // Core fields
  record_type: string;
  title: string;
  description: string | null;
  timestamp: string; // ISO 8601 datetime
  status: RecordStatus;
  
  // Classification and organization
  tags: string[];
  associated_domains: string[];
  
  // Origin tracking
  origin: RecordOrigin;
  
  // Metadata
  created_at: string;
  updated_at: string;
  
  // AI enrichment
  ai_metadata: Record<string, any>;
}

/**
 * Event: A temporal occurrence that may impact resources, projects, people or metrics
 * 
 * Organizes life in time, connecting past, present and future.
 */
export interface Event {
  id: string;
  user_id: string;
  
  // Core fields
  title: string;
  description: string | null;
  start_time: string; // ISO 8601 datetime
  end_time: string | null; // ISO 8601 datetime
  
  // Recurrence
  recurrence: RecurrenceRule | null;
  
  // Impacts on resources
  impacts: ResourceImpacts;
  
  // Metadata
  created_at: string;
  updated_at: string;
  
  // AI enrichment
  ai_metadata: Record<string, any>;
}

/**
 * Person: Any individual relevant to the user's life
 * 
 * Acts as a contextual hub connecting records, events and projects.
 */
export interface Person {
  id: string;
  user_id: string;
  
  // Core fields
  name: string;
  relationship_type: string | null;
  
  // Contact information
  contact_data: ContactData;
  
  // Important dates
  important_dates: ImportantDate[];
  
  // Metadata
  created_at: string;
  updated_at: string;
  
  // AI enrichment
  ai_metadata: Record<string, any>;
}

/**
 * Project: An intentional grouping of effort aimed at achieving a goal
 * 
 * Connects objectives with actions, time and resources.
 */
export interface Project {
  id: string;
  user_id: string;
  
  // Core fields
  name: string;
  description: string | null;
  goal: string | null;
  
  // Status and timeline
  status: ProjectStatus;
  start_date: string | null; // ISO 8601 datetime
  end_date: string | null; // ISO 8601 datetime
  
  // Metadata
  created_at: string;
  updated_at: string;
  
  // AI enrichment
  ai_metadata: Record<string, any>;
}

/**
 * Resource: Anything that can be consumed, accumulated or depleted
 * 
 * Allows quantitative analysis of life trade-offs.
 */
export interface Resource {
  id: string;
  user_id: string;
  
  // Core fields
  resource_type: ResourceType;
  unit: string;
  current_value: number;
  
  // Origin
  origin: string | null;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

/**
 * ResourceChange: History of resource changes
 * 
 * Tracks all changes to resources over time.
 */
export interface ResourceChange {
  id: string;
  resource_id: string;
  
  // Change details
  delta: number;
  timestamp: string; // ISO 8601 datetime
  
  // Source tracking
  source_record_id: string | null;
  source_event_id: string | null;
  
  // Metadata
  created_at: string;
}

/**
 * Metric: A quantitative or categorical measurement over time
 * 
 * Feeds insights, trends and correlations.
 */
export interface Metric {
  id: string;
  user_id: string;
  
  // Core fields
  name: string;
  metric_type: MetricType;
  value: MetricValue;
  timestamp: string; // ISO 8601 datetime
  
  // Origin
  origin: MetricOrigin;
  
  // Metadata
  created_at: string;
}

// ============================================================================
// RELATIONSHIP ENTITIES
// ============================================================================

/**
 * RecordLink: Semantic relationships between records and other entities
 */
export interface RecordLink {
  id: string;
  record_id: string;
  
  // Target entity (polymorphic)
  entity_type: EntityType;
  entity_id: string;
  
  // Relationship semantics
  relationship_type: string;
  
  // Metadata
  created_at: string;
}

/**
 * EventParticipant: People involved in events
 */
export interface EventParticipant {
  id: string;
  event_id: string;
  person_id: string;
  created_at: string;
}

/**
 * EventRecord: Records associated with events
 */
export interface EventRecord {
  id: string;
  event_id: string;
  record_id: string;
  created_at: string;
}

/**
 * ProjectRecord: Records linked to projects
 */
export interface ProjectRecord {
  id: string;
  project_id: string;
  record_id: string;
  created_at: string;
}

/**
 * ProjectMetric: Metrics tracking project progress
 */
export interface ProjectMetric {
  id: string;
  project_id: string;
  metric_id: string;
  created_at: string;
}

/**
 * PersonRecord: Records associated with people
 */
export interface PersonRecord {
  id: string;
  person_id: string;
  record_id: string;
  created_at: string;
}

/**
 * PersonInteraction: Interaction history (events) with people
 */
export interface PersonInteraction {
  id: string;
  person_id: string;
  event_id: string;
  created_at: string;
}

/**
 * MetricRecord: Records that generated or relate to metrics
 */
export interface MetricRecord {
  id: string;
  metric_id: string;
  record_id: string;
  created_at: string;
}

// ============================================================================
// SUPPORTING TYPES
// ============================================================================

/**
 * Recurrence rule for repeating events
 */
export interface RecurrenceRule {
  pattern: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number;
  end_date?: string; // ISO 8601 datetime
  days_of_week?: number[]; // 0-6, Sunday = 0
  day_of_month?: number; // 1-31
  month_of_year?: number; // 1-12
}

/**
 * Resource impacts from events or records
 */
export interface ResourceImpacts {
  money?: number;
  time?: number;
  energy?: number;
  attention?: number;
  health?: number;
  physical_space?: number;
}

/**
 * Contact data for a person
 */
export interface ContactData {
  email?: string;
  phone?: string;
  address?: string;
  social?: Record<string, string>;
  [key: string]: any;
}

/**
 * Important date for a person
 */
export interface ImportantDate {
  label: string;
  date: string; // ISO 8601 date
  recurring?: boolean;
}

/**
 * Metric value (flexible for different types)
 */
export type MetricValue = 
  | { type: 'numeric'; value: number }
  | { type: 'categorical'; value: string }
  | { type: 'boolean'; value: boolean };

// ============================================================================
// INPUT TYPES (for creation)
// ============================================================================

/**
 * Input type for creating a new record
 */
export interface CreateRecordInput {
  record_type: string;
  title: string;
  description?: string;
  timestamp?: string;
  status?: RecordStatus;
  tags?: string[];
  associated_domains?: string[];
  origin?: RecordOrigin;
  ai_metadata?: Record<string, any>;
}

/**
 * Input type for creating a new event
 */
export interface CreateEventInput {
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  recurrence?: RecurrenceRule;
  impacts?: ResourceImpacts;
  ai_metadata?: Record<string, any>;
}

/**
 * Input type for creating a new person
 */
export interface CreatePersonInput {
  name: string;
  relationship_type?: string;
  contact_data?: ContactData;
  important_dates?: ImportantDate[];
  ai_metadata?: Record<string, any>;
}

/**
 * Input type for creating a new project
 */
export interface CreateProjectInput {
  name: string;
  description?: string;
  goal?: string;
  status?: ProjectStatus;
  start_date?: string;
  end_date?: string;
  ai_metadata?: Record<string, any>;
}

/**
 * Input type for creating a new resource
 */
export interface CreateResourceInput {
  resource_type: ResourceType;
  unit: string;
  current_value?: number;
  origin?: string;
}

/**
 * Input type for creating a new metric
 */
export interface CreateMetricInput {
  name: string;
  metric_type: MetricType;
  value: MetricValue;
  timestamp?: string;
  origin?: MetricOrigin;
}

// ============================================================================
// ENRICHED TYPES (with relationships)
// ============================================================================

/**
 * Record with all its relationships loaded
 */
export interface EnrichedRecord extends Record {
  links?: RecordLink[];
  events?: Event[];
  people?: Person[];
  projects?: Project[];
  metrics?: Metric[];
}

/**
 * Event with all its relationships loaded
 */
export interface EnrichedEvent extends Event {
  participants?: Person[];
  records?: Record[];
}

/**
 * Person with all their relationships loaded
 */
export interface EnrichedPerson extends Person {
  records?: Record[];
  events?: Event[];
}

/**
 * Project with all its relationships loaded
 */
export interface EnrichedProject extends Project {
  records?: Record[];
  metrics?: Metric[];
  progress?: {
    total_records: number;
    completed_records: number;
    progress_percentage: number;
  };
}

/**
 * Resource with its change history
 */
export interface EnrichedResource extends Resource {
  changes?: ResourceChange[];
}

/**
 * Metric with related records
 */
export interface EnrichedMetric extends Metric {
  records?: Record[];
}
