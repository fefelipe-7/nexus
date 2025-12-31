-- Criar extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de estados pessoais
CREATE TABLE personal_states (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  mood INTEGER CHECK (mood >= 0 AND mood <= 10),
  energy INTEGER CHECK (energy >= 0 AND energy <= 10),
  stress INTEGER CHECK (stress >= 0 AND stress <= 10),
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de ações
CREATE TABLE actions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('task', 'habit', 'activity')),
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'completed', 'abandoned')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  tags TEXT[],
  related_goal_id BIGINT REFERENCES goals(id) ON DELETE SET NULL
);

-- Tabela de eventos
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  type TEXT NOT NULL CHECK (type IN ('scheduled', 'unexpected')),
  category TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de metas
CREATE TABLE goals (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
  priority INTEGER CHECK (priority >= 1 AND priority <= 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  target_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  tags TEXT[]
);

-- Tabela de rotinas
CREATE TABLE routines (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  target_days INTEGER[],
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tags TEXT[]
);

-- Tabela de logs de rotinas
CREATE TABLE routine_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  routine_id BIGINT NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de conhecimento
CREATE TABLE knowledge (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('note', 'idea', 'learning', 'documentation')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tags TEXT[],
  related_ids BIGINT[]
);

-- Tabela de reflexões
CREATE TABLE reflections (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('journal', 'review', 'retrospective')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  period TEXT,
  tags TEXT[],
  related_domains TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_personal_states_user_id ON personal_states(user_id);
CREATE INDEX idx_personal_states_timestamp ON personal_states(timestamp DESC);
CREATE INDEX idx_actions_user_id ON actions(user_id);
CREATE INDEX idx_actions_status ON actions(status);
CREATE INDEX idx_actions_due_date ON actions(due_date);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_routines_user_id ON routines(user_id);
CREATE INDEX idx_routine_logs_user_id ON routine_logs(user_id);
CREATE INDEX idx_routine_logs_routine_id ON routine_logs(routine_id);
CREATE INDEX idx_knowledge_user_id ON knowledge(user_id);
CREATE INDEX idx_reflections_user_id ON reflections(user_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE personal_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para personal_states
CREATE POLICY "Usuários podem ver seus próprios estados" ON personal_states FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir seus próprios estados" ON personal_states FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar seus próprios estados" ON personal_states FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar seus próprios estados" ON personal_states FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para actions
CREATE POLICY "Usuários podem ver suas próprias ações" ON actions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir suas próprias ações" ON actions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar suas próprias ações" ON actions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar suas próprias ações" ON actions FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para events
CREATE POLICY "Usuários podem ver seus próprios eventos" ON events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir seus próprios eventos" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar seus próprios eventos" ON events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar seus próprios eventos" ON events FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para goals
CREATE POLICY "Usuários podem ver suas próprias metas" ON goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir suas próprias metas" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar suas próprias metas" ON goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar suas próprias metas" ON goals FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para routines
CREATE POLICY "Usuários podem ver suas próprias rotinas" ON routines FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir suas próprias rotinas" ON routines FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar suas próprias rotinas" ON routines FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar suas próprias rotinas" ON routines FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para routine_logs
CREATE POLICY "Usuários podem ver seus próprios logs de rotinas" ON routine_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir seus próprios logs de rotinas" ON routine_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar seus próprios logs de rotinas" ON routine_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar seus próprios logs de rotinas" ON routine_logs FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para knowledge
CREATE POLICY "Usuários podem ver seu próprio conhecimento" ON knowledge FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir seu próprio conhecimento" ON knowledge FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar seu próprio conhecimento" ON knowledge FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar seu próprio conhecimento" ON knowledge FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para reflections
CREATE POLICY "Usuários podem ver suas próprias reflexões" ON reflections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir suas próprias reflexões" ON reflections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar suas próprias reflexões" ON reflections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar suas próprias reflexões" ON reflections FOR DELETE USING (auth.uid() = user_id);
