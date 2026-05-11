export type ModuleType = 'saude' | 'mente' | 'acao' | 'financa' | 'vida';

export interface Module {
  id: string;
  name: ModuleType;
  description: string;
  order: number;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Submodule {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  inputType: 'numeric' | 'text' | 'select' | 'date' | 'boolean';
  createsData: boolean;
  enabled: boolean;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export type EntrySource = 'manual' | 'automatic' | 'imported' | 'ai_assisted';

export interface Entry {
  id: string;
  moduleId: string;
  submoduleId: string;
  title: string;
  description?: string;
  occurredAt: number;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
  source: EntrySource;
  tags: string[];
  metadata: Record<string, unknown>;
}

export interface Metric {
  id: string;
  entryId: string;
  key: string;
  value: number | string;
  unit?: string;
  scaleMin?: number;
  scaleMax?: number;
  createdAt: number;
}

export type EntityType = 
  | 'entry' 
  | 'module' 
  | 'submodule' 
  | 'metric' 
  | 'tag' 
  | 'visualization' 
  | 'widget' 
  | 'insight' 
  | 'attachment' 
  | 'person' 
  | 'project' 
  | 'goal' 
  | 'task' 
  | 'habit' 
  | 'decision';

export type RelationType = 
  | 'related_to'
  | 'part_of'
  | 'caused_by'
  | 'affects'
  | 'supports'
  | 'blocks'
  | 'improves'
  | 'worsens'
  | 'explains'
  | 'depends_on'
  | 'created_from'
  | 'converted_to'
  | 'associated_with'
  | 'contradicts'
  | 'follows'
  | 'precedes';

export type Confidence = 'low' | 'medium' | 'high';

export interface Relation {
  id: string;
  fromEntityType: EntityType;
  fromEntityId: string;
  toEntityType: EntityType;
  toEntityId: string;
  relationType: RelationType;
  strength: number;
  confidence: Confidence;
  source: 'user' | 'system' | 'ai' | 'imported' | 'rule' | 'suggested';
  note?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export interface Insight {
  id: string;
  title: string;
  message: string;
  confidence: Confidence;
  source: 'deterministic_rule' | 'local_ai' | 'remote_ai' | 'user_created' | 'system_generated';
  sourceDataRange?: { start: number; end: number };
  relatedEntities: { entityType: EntityType; entityId: string }[];
  createdAt: number;
  dismissedAt?: number;
}

export interface Visualization {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  dependsOnSubmodules: string[];
  calculationType: 'score' | 'chart' | 'timeline' | 'summary' | 'trend' | 'correlation' | 'comparison' | 'alert' | 'forecast' | 'distribution' | 'ranking';
  cachePolicy: 'immediate' | 'daily' | 'weekly' | 'manual' | 'background' | 'on_data_change';
  createdAt: number;
  updatedAt: number;
}

export interface Widget {
  id: string;
  visualizationId: string;
  moduleId: string;
  title: string;
  size: 'small' | 'medium' | 'large';
  position: number;
  config: Record<string, unknown>;
  enabled: boolean;
}
