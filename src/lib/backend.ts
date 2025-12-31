import { supabase } from './supabase';

export interface PersonalState {
  id?: number;
  timestamp: Date;
  mood?: number;
  energy?: number;
  stress?: number;
  notes?: string;
  tags?: string[];
}

export interface Action {
  id?: number;
  title: string;
  description?: string;
  type: 'task' | 'habit' | 'activity';
  status: 'planned' | 'in-progress' | 'completed' | 'abandoned';
  createdAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  tags?: string[];
  relatedGoalId?: number;
}

export interface Event {
  id?: number;
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  type: 'scheduled' | 'unexpected';
  category?: string;
  tags?: string[];
}

export interface Goal {
  id?: number;
  title: string;
  description?: string;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  priority?: number;
  createdAt: Date;
  targetDate?: Date;
  completedAt?: Date;
  progress?: number;
  tags?: string[];
}

export interface Routine {
  id?: number;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetDays?: number[];
  active: boolean;
  createdAt: Date;
  tags?: string[];
}

export interface RoutineLog {
  id?: number;
  routineId: number;
  timestamp: Date;
  completed: boolean;
  notes?: string;
}

export interface Knowledge {
  id?: number;
  title: string;
  content: string;
  type: 'note' | 'idea' | 'learning' | 'documentation';
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  relatedIds?: number[];
}

export interface Reflection {
  id?: number;
  title?: string;
  content: string;
  type: 'journal' | 'review' | 'retrospective';
  timestamp: Date;
  period?: string;
  tags?: string[];
  relatedDomains?: string[];
}

class BackendService {
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  async getPersonalStates(limit = 20) {
    const { data, error } = await supabase
      .from('personal_states')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data?.map(this.mapPersonalState) || [];
  }

  async addPersonalState(state: PersonalState) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('personal_states')
      .insert({
        user_id: user.id,
        timestamp: state.timestamp.toISOString(),
        mood: state.mood,
        energy: state.energy,
        stress: state.stress,
        notes: state.notes,
        tags: state.tags,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapPersonalState(data);
  }

  async getActions() {
    const { data, error } = await supabase
      .from('actions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data?.map(this.mapAction) || [];
  }

  async addAction(action: Action) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('actions')
      .insert({
        user_id: user.id,
        title: action.title,
        description: action.description,
        type: action.type,
        status: action.status,
        created_at: action.createdAt.toISOString(),
        completed_at: action.completedAt?.toISOString(),
        due_date: action.dueDate?.toISOString(),
        tags: action.tags,
        related_goal_id: action.relatedGoalId,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapAction(data);
  }

  async updateAction(id: number, updates: Partial<Action>) {
    const { data, error } = await supabase
      .from('actions')
      .update({
        title: updates.title,
        description: updates.description,
        status: updates.status,
        completed_at: updates.completedAt?.toISOString(),
        due_date: updates.dueDate?.toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapAction(data);
  }

  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_time', { ascending: false });
    
    if (error) throw error;
    return data?.map(this.mapEvent) || [];
  }

  async addEvent(event: Event) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('events')
      .insert({
        user_id: user.id,
        title: event.title,
        description: event.description,
        start_time: event.startTime.toISOString(),
        end_time: event.endTime?.toISOString(),
        type: event.type,
        category: event.category,
        tags: event.tags,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapEvent(data);
  }

  async getGoals() {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data?.map(this.mapGoal) || [];
  }

  async addGoal(goal: Goal) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        title: goal.title,
        description: goal.description,
        status: goal.status,
        priority: goal.priority,
        created_at: goal.createdAt.toISOString(),
        target_date: goal.targetDate?.toISOString(),
        completed_at: goal.completedAt?.toISOString(),
        progress: goal.progress,
        tags: goal.tags,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapGoal(data);
  }

  async updateGoal(id: number, updates: Partial<Goal>) {
    const { data, error } = await supabase
      .from('goals')
      .update({
        title: updates.title,
        description: updates.description,
        status: updates.status,
        progress: updates.progress,
        completed_at: updates.completedAt?.toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapGoal(data);
  }

  async getRoutines() {
    const { data, error } = await supabase
      .from('routines')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data?.map(this.mapRoutine) || [];
  }

  async addRoutine(routine: Routine) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('routines')
      .insert({
        user_id: user.id,
        title: routine.title,
        description: routine.description,
        frequency: routine.frequency,
        target_days: routine.targetDays,
        active: routine.active,
        created_at: routine.createdAt.toISOString(),
        tags: routine.tags,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapRoutine(data);
  }

  async getRoutineLogs(routineId: number, startDate: Date, endDate: Date) {
    const { data, error } = await supabase
      .from('routine_logs')
      .select('*')
      .eq('routine_id', routineId)
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString());
    
    if (error) throw error;
    return data?.map(this.mapRoutineLog) || [];
  }

  async addRoutineLog(log: RoutineLog) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('routine_logs')
      .insert({
        user_id: user.id,
        routine_id: log.routineId,
        timestamp: log.timestamp.toISOString(),
        completed: log.completed,
        notes: log.notes,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapRoutineLog(data);
  }

  async updateRoutineLog(id: number, completed: boolean) {
    const { data, error } = await supabase
      .from('routine_logs')
      .update({ completed })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapRoutineLog(data);
  }

  async getKnowledge() {
    const { data, error } = await supabase
      .from('knowledge')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data?.map(this.mapKnowledge) || [];
  }

  async addKnowledge(knowledge: Knowledge) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('knowledge')
      .insert({
        user_id: user.id,
        title: knowledge.title,
        content: knowledge.content,
        type: knowledge.type,
        created_at: knowledge.createdAt.toISOString(),
        updated_at: knowledge.updatedAt.toISOString(),
        tags: knowledge.tags,
        related_ids: knowledge.relatedIds,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapKnowledge(data);
  }

  async getReflections() {
    const { data, error } = await supabase
      .from('reflections')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data?.map(this.mapReflection) || [];
  }

  async addReflection(reflection: Reflection) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('reflections')
      .insert({
        user_id: user.id,
        title: reflection.title,
        content: reflection.content,
        type: reflection.type,
        timestamp: reflection.timestamp.toISOString(),
        period: reflection.period,
        tags: reflection.tags,
        related_domains: reflection.relatedDomains,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapReflection(data);
  }

  private mapPersonalState(data: any): PersonalState {
    return {
      id: data.id,
      timestamp: new Date(data.timestamp),
      mood: data.mood,
      energy: data.energy,
      stress: data.stress,
      notes: data.notes,
      tags: data.tags,
    };
  }

  private mapAction(data: any): Action {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      type: data.type,
      status: data.status,
      createdAt: new Date(data.created_at),
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      dueDate: data.due_date ? new Date(data.due_date) : undefined,
      tags: data.tags,
      relatedGoalId: data.related_goal_id,
    };
  }

  private mapEvent(data: any): Event {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      startTime: new Date(data.start_time),
      endTime: data.end_time ? new Date(data.end_time) : undefined,
      type: data.type,
      category: data.category,
      tags: data.tags,
    };
  }

  private mapGoal(data: any): Goal {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      createdAt: new Date(data.created_at),
      targetDate: data.target_date ? new Date(data.target_date) : undefined,
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      progress: data.progress,
      tags: data.tags,
    };
  }

  private mapRoutine(data: any): Routine {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      frequency: data.frequency,
      targetDays: data.target_days,
      active: data.active,
      createdAt: new Date(data.created_at),
      tags: data.tags,
    };
  }

  private mapRoutineLog(data: any): RoutineLog {
    return {
      id: data.id,
      routineId: data.routine_id,
      timestamp: new Date(data.timestamp),
      completed: data.completed,
      notes: data.notes,
    };
  }

  private mapKnowledge(data: any): Knowledge {
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      type: data.type,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      tags: data.tags,
      relatedIds: data.related_ids,
    };
  }

  private mapReflection(data: any): Reflection {
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      type: data.type,
      timestamp: new Date(data.timestamp),
      period: data.period,
      tags: data.tags,
      relatedDomains: data.related_domains,
    };
  }
}

export const backend = new BackendService();
