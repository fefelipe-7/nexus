-- ============================================================================
-- Nexus Core Entities Migration
-- Version: 1.0.0
-- Description: Canonical conceptual model for Nexus life operating system
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- ============================================================================
-- CORE ENTITIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. RECORDS: The fundamental atomic unit of Nexus
-- ----------------------------------------------------------------------------
CREATE TABLE records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core fields
  record_type TEXT NOT NULL, -- expense, task, emotion, note, etc.
  title TEXT NOT NULL,
  description TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'archived', 'cancelled')),
  
  -- Classification and organization
  tags TEXT[] DEFAULT '{}',
  associated_domains TEXT[] DEFAULT '{}', -- money, health, time, relationships, etc.
  
  -- Origin tracking
  origin TEXT NOT NULL DEFAULT 'manual' CHECK (origin IN ('manual', 'imported', 'automatic')),
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- AI enrichment
  ai_metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Full-text search
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('portuguese', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(description, '')), 'B')
  ) STORED
);

-- ----------------------------------------------------------------------------
-- 2. EVENTS: Temporal occurrences that impact resources and life
-- ----------------------------------------------------------------------------
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core fields
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  
  -- Recurrence
  recurrence JSONB, -- {pattern: 'daily|weekly|monthly', interval: 1, end_date: '...'}
  
  -- Impacts on resources
  impacts JSONB DEFAULT '{}'::jsonb, -- {money: -100, time: 2, energy: -3, health: 1}
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- AI enrichment
  ai_metadata JSONB DEFAULT '{}'::jsonb
);

-- ----------------------------------------------------------------------------
-- 3. PEOPLE: Individuals relevant to the user's life
-- ----------------------------------------------------------------------------
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core fields
  name TEXT NOT NULL,
  relationship_type TEXT, -- family, professional, romantic, friend, etc.
  
  -- Contact information
  contact_data JSONB DEFAULT '{}'::jsonb, -- {email: '...', phone: '...', address: '...'}
  
  -- Important dates
  important_dates JSONB DEFAULT '[]'::jsonb, -- [{label: 'birthday', date: '...'}]
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- AI enrichment
  ai_metadata JSONB DEFAULT '{}'::jsonb
);

-- ----------------------------------------------------------------------------
-- 4. PROJECTS: Intentional groupings of effort toward goals
-- ----------------------------------------------------------------------------
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core fields
  name TEXT NOT NULL,
  description TEXT,
  goal TEXT, -- Desired outcome
  
  -- Status and timeline
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'paused', 'completed', 'abandoned')),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- AI enrichment
  ai_metadata JSONB DEFAULT '{}'::jsonb
);

-- ----------------------------------------------------------------------------
-- 5. RESOURCES: Anything that can be consumed, accumulated or depleted
-- ----------------------------------------------------------------------------
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core fields
  resource_type TEXT NOT NULL CHECK (resource_type IN ('money', 'time', 'energy', 'attention', 'health', 'physical_space')),
  unit TEXT NOT NULL, -- BRL, hours, points, etc.
  current_value NUMERIC NOT NULL DEFAULT 0,
  
  -- Origin
  origin TEXT, -- salary, savings, daily_allowance, etc.
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, resource_type, origin)
);

-- ----------------------------------------------------------------------------
-- 6. RESOURCE CHANGES: History of resource changes
-- ----------------------------------------------------------------------------
CREATE TABLE resource_changes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  
  -- Change details
  delta NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Source tracking
  source_record_id UUID REFERENCES records(id) ON DELETE SET NULL,
  source_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. METRICS: Quantitative or categorical measurements over time
-- ----------------------------------------------------------------------------
CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core fields
  name TEXT NOT NULL,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('numeric', 'categorical', 'boolean')),
  value JSONB NOT NULL, -- Flexible storage for different types
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Origin
  origin TEXT NOT NULL DEFAULT 'manual' CHECK (origin IN ('manual', 'imported', 'derived')),
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- RELATIONSHIP TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Record Links: Semantic relationships between records and other entities
-- ----------------------------------------------------------------------------
CREATE TABLE record_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  
  -- Target entity (polymorphic)
  entity_type TEXT NOT NULL CHECK (entity_type IN ('record', 'event', 'person', 'project', 'metric')),
  entity_id UUID NOT NULL,
  
  -- Relationship semantics
  relationship_type TEXT NOT NULL, -- causes, relates_to, part_of, depends_on, etc.
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Prevent duplicates
  UNIQUE(record_id, entity_type, entity_id, relationship_type)
);

-- ----------------------------------------------------------------------------
-- Event Participants: People involved in events
-- ----------------------------------------------------------------------------
CREATE TABLE event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Prevent duplicates
  UNIQUE(event_id, person_id)
);

-- ----------------------------------------------------------------------------
-- Event Records: Records associated with events
-- ----------------------------------------------------------------------------
CREATE TABLE event_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Prevent duplicates
  UNIQUE(event_id, record_id)
);

-- ----------------------------------------------------------------------------
-- Project Records: Records linked to projects
-- ----------------------------------------------------------------------------
CREATE TABLE project_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Prevent duplicates
  UNIQUE(project_id, record_id)
);

-- ----------------------------------------------------------------------------
-- Project Metrics: Metrics tracking project progress
-- ----------------------------------------------------------------------------
CREATE TABLE project_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  metric_id UUID NOT NULL REFERENCES metrics(id) ON DELETE CASCADE,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Prevent duplicates
  UNIQUE(project_id, metric_id)
);

-- ----------------------------------------------------------------------------
-- Person Records: Records associated with people
-- ----------------------------------------------------------------------------
CREATE TABLE person_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Prevent duplicates
  UNIQUE(person_id, record_id)
);

-- ----------------------------------------------------------------------------
-- Person Interactions: Interaction history (events) with people
-- ----------------------------------------------------------------------------
CREATE TABLE person_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Prevent duplicates
  UNIQUE(person_id, event_id)
);

-- ----------------------------------------------------------------------------
-- Metric Records: Records that generated or relate to metrics
-- ----------------------------------------------------------------------------
CREATE TABLE metric_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_id UUID NOT NULL REFERENCES metrics(id) ON DELETE CASCADE,
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Prevent duplicates
  UNIQUE(metric_id, record_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Records
CREATE INDEX idx_records_user_id ON records(user_id);
CREATE INDEX idx_records_timestamp ON records(timestamp DESC);
CREATE INDEX idx_records_status ON records(status);
CREATE INDEX idx_records_record_type ON records(record_type);
CREATE INDEX idx_records_domains ON records USING GIN(associated_domains);
CREATE INDEX idx_records_tags ON records USING GIN(tags);
CREATE INDEX idx_records_search ON records USING GIN(search_vector);

-- Events
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_start_time ON events(start_time DESC);
CREATE INDEX idx_events_end_time ON events(end_time);

-- People
CREATE INDEX idx_people_user_id ON people(user_id);
CREATE INDEX idx_people_name ON people(name);
CREATE INDEX idx_people_relationship_type ON people(relationship_type);

-- Projects
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_start_date ON projects(start_date);
CREATE INDEX idx_projects_end_date ON projects(end_date);

-- Resources
CREATE INDEX idx_resources_user_id ON resources(user_id);
CREATE INDEX idx_resources_type ON resources(resource_type);

-- Resource Changes
CREATE INDEX idx_resource_changes_resource_id ON resource_changes(resource_id);
CREATE INDEX idx_resource_changes_timestamp ON resource_changes(timestamp DESC);
CREATE INDEX idx_resource_changes_source_record ON resource_changes(source_record_id);
CREATE INDEX idx_resource_changes_source_event ON resource_changes(source_event_id);

-- Metrics
CREATE INDEX idx_metrics_user_id ON metrics(user_id);
CREATE INDEX idx_metrics_name ON metrics(name);
CREATE INDEX idx_metrics_timestamp ON metrics(timestamp DESC);
CREATE INDEX idx_metrics_type ON metrics(metric_type);

-- Relationship tables
CREATE INDEX idx_record_links_record_id ON record_links(record_id);
CREATE INDEX idx_record_links_entity ON record_links(entity_type, entity_id);
CREATE INDEX idx_event_participants_event_id ON event_participants(event_id);
CREATE INDEX idx_event_participants_person_id ON event_participants(person_id);
CREATE INDEX idx_event_records_event_id ON event_records(event_id);
CREATE INDEX idx_event_records_record_id ON event_records(record_id);
CREATE INDEX idx_project_records_project_id ON project_records(project_id);
CREATE INDEX idx_project_records_record_id ON project_records(record_id);
CREATE INDEX idx_project_metrics_project_id ON project_metrics(project_id);
CREATE INDEX idx_project_metrics_metric_id ON project_metrics(metric_id);
CREATE INDEX idx_person_records_person_id ON person_records(person_id);
CREATE INDEX idx_person_records_record_id ON person_records(record_id);
CREATE INDEX idx_person_interactions_person_id ON person_interactions(person_id);
CREATE INDEX idx_person_interactions_event_id ON person_interactions(event_id);
CREATE INDEX idx_metric_records_metric_id ON metric_records(metric_id);
CREATE INDEX idx_metric_records_record_id ON metric_records(record_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_records_updated_at BEFORE UPDATE ON records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON people
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE record_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE person_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE person_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE metric_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Records
CREATE POLICY "Users can view their own records" ON records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own records" ON records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own records" ON records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own records" ON records FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Events
CREATE POLICY "Users can view their own events" ON events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own events" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own events" ON events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own events" ON events FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for People
CREATE POLICY "Users can view their own people" ON people FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own people" ON people FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own people" ON people FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own people" ON people FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Projects
CREATE POLICY "Users can view their own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Resources
CREATE POLICY "Users can view their own resources" ON resources FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own resources" ON resources FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own resources" ON resources FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own resources" ON resources FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Resource Changes
CREATE POLICY "Users can view their own resource changes" ON resource_changes FOR SELECT 
  USING (EXISTS (SELECT 1 FROM resources WHERE resources.id = resource_changes.resource_id AND resources.user_id = auth.uid()));
CREATE POLICY "Users can insert their own resource changes" ON resource_changes FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM resources WHERE resources.id = resource_changes.resource_id AND resources.user_id = auth.uid()));

-- RLS Policies for Metrics
CREATE POLICY "Users can view their own metrics" ON metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own metrics" ON metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own metrics" ON metrics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own metrics" ON metrics FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Record Links
CREATE POLICY "Users can view their own record links" ON record_links FOR SELECT 
  USING (EXISTS (SELECT 1 FROM records WHERE records.id = record_links.record_id AND records.user_id = auth.uid()));
CREATE POLICY "Users can insert their own record links" ON record_links FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM records WHERE records.id = record_links.record_id AND records.user_id = auth.uid()));
CREATE POLICY "Users can delete their own record links" ON record_links FOR DELETE 
  USING (EXISTS (SELECT 1 FROM records WHERE records.id = record_links.record_id AND records.user_id = auth.uid()));

-- RLS Policies for Event Participants
CREATE POLICY "Users can view their own event participants" ON event_participants FOR SELECT 
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = event_participants.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Users can insert their own event participants" ON event_participants FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM events WHERE events.id = event_participants.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Users can delete their own event participants" ON event_participants FOR DELETE 
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = event_participants.event_id AND events.user_id = auth.uid()));

-- RLS Policies for Event Records
CREATE POLICY "Users can view their own event records" ON event_records FOR SELECT 
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = event_records.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Users can insert their own event records" ON event_records FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM events WHERE events.id = event_records.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Users can delete their own event records" ON event_records FOR DELETE 
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = event_records.event_id AND events.user_id = auth.uid()));

-- RLS Policies for Project Records
CREATE POLICY "Users can view their own project records" ON project_records FOR SELECT 
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_records.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can insert their own project records" ON project_records FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_records.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can delete their own project records" ON project_records FOR DELETE 
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_records.project_id AND projects.user_id = auth.uid()));

-- RLS Policies for Project Metrics
CREATE POLICY "Users can view their own project metrics" ON project_metrics FOR SELECT 
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_metrics.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can insert their own project metrics" ON project_metrics FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_metrics.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can delete their own project metrics" ON project_metrics FOR DELETE 
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_metrics.project_id AND projects.user_id = auth.uid()));

-- RLS Policies for Person Records
CREATE POLICY "Users can view their own person records" ON person_records FOR SELECT 
  USING (EXISTS (SELECT 1 FROM people WHERE people.id = person_records.person_id AND people.user_id = auth.uid()));
CREATE POLICY "Users can insert their own person records" ON person_records FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM people WHERE people.id = person_records.person_id AND people.user_id = auth.uid()));
CREATE POLICY "Users can delete their own person records" ON person_records FOR DELETE 
  USING (EXISTS (SELECT 1 FROM people WHERE people.id = person_records.person_id AND people.user_id = auth.uid()));

-- RLS Policies for Person Interactions
CREATE POLICY "Users can view their own person interactions" ON person_interactions FOR SELECT 
  USING (EXISTS (SELECT 1 FROM people WHERE people.id = person_interactions.person_id AND people.user_id = auth.uid()));
CREATE POLICY "Users can insert their own person interactions" ON person_interactions FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM people WHERE people.id = person_interactions.person_id AND people.user_id = auth.uid()));
CREATE POLICY "Users can delete their own person interactions" ON person_interactions FOR DELETE 
  USING (EXISTS (SELECT 1 FROM people WHERE people.id = person_interactions.person_id AND people.user_id = auth.uid()));

-- RLS Policies for Metric Records
CREATE POLICY "Users can view their own metric records" ON metric_records FOR SELECT 
  USING (EXISTS (SELECT 1 FROM metrics WHERE metrics.id = metric_records.metric_id AND metrics.user_id = auth.uid()));
CREATE POLICY "Users can insert their own metric records" ON metric_records FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM metrics WHERE metrics.id = metric_records.metric_id AND metrics.user_id = auth.uid()));
CREATE POLICY "Users can delete their own metric records" ON metric_records FOR DELETE 
  USING (EXISTS (SELECT 1 FROM metrics WHERE metrics.id = metric_records.metric_id AND metrics.user_id = auth.uid()));

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get all records related to a person
CREATE OR REPLACE FUNCTION get_person_records(person_uuid UUID)
RETURNS TABLE (
  record_id UUID,
  title TEXT,
  record_type TEXT,
  timestamp TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.title, r.record_type, r.timestamp
  FROM records r
  INNER JOIN person_records pr ON r.id = pr.record_id
  WHERE pr.person_id = person_uuid
  ORDER BY r.timestamp DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all events for a person
CREATE OR REPLACE FUNCTION get_person_events(person_uuid UUID)
RETURNS TABLE (
  event_id UUID,
  title TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT e.id, e.title, e.start_time, e.end_time
  FROM events e
  INNER JOIN event_participants ep ON e.id = ep.event_id
  WHERE ep.person_id = person_uuid
  ORDER BY e.start_time DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get project progress
CREATE OR REPLACE FUNCTION get_project_progress(project_uuid UUID)
RETURNS TABLE (
  total_records BIGINT,
  completed_records BIGINT,
  progress_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_records,
    COUNT(*) FILTER (WHERE r.status = 'completed')::BIGINT as completed_records,
    CASE 
      WHEN COUNT(*) = 0 THEN 0
      ELSE ROUND((COUNT(*) FILTER (WHERE r.status = 'completed')::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
    END as progress_percentage
  FROM records r
  INNER JOIN project_records pr ON r.id = pr.record_id
  WHERE pr.project_id = project_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
