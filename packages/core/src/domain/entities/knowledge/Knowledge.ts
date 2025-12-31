import { BaseEntity, ID, Timestamp } from '@nexus/shared';

export type KnowledgeType = 'note' | 'idea' | 'learning' | 'insight' | 'reference';

export interface Knowledge extends BaseEntity {
  title: string;
  content: string;
  type: KnowledgeType;
  tags?: string[];
  relatedIds?: ID[];
  source?: string;
  isFavorite?: boolean;
}
