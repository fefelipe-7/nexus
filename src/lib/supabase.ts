import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      personal_states: {
        Row: {
          id: number;
          user_id: string;
          timestamp: string;
          mood: number | null;
          energy: number | null;
          stress: number | null;
          notes: string | null;
          tags: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          timestamp: string;
          mood?: number | null;
          energy?: number | null;
          stress?: number | null;
          notes?: string | null;
          tags?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          timestamp?: string;
          mood?: number | null;
          energy?: number | null;
          stress?: number | null;
          notes?: string | null;
          tags?: string[] | null;
          created_at?: string;
        };
      };
      actions: {
        Row: {
          id: number;
          user_id: string;
          title: string;
          description: string | null;
          type: 'task' | 'habit' | 'activity';
          status: 'planned' | 'in-progress' | 'completed' | 'abandoned';
          created_at: string;
          completed_at: string | null;
          due_date: string | null;
          tags: string[] | null;
          related_goal_id: number | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          title: string;
          description?: string | null;
          type: 'task' | 'habit' | 'activity';
          status?: 'planned' | 'in-progress' | 'completed' | 'abandoned';
          created_at?: string;
          completed_at?: string | null;
          due_date?: string | null;
          tags?: string[] | null;
          related_goal_id?: number | null;
        };
        Update: {
          id?: number;
          user_id?: string;
          title?: string;
          description?: string | null;
          type?: 'task' | 'habit' | 'activity';
          status?: 'planned' | 'in-progress' | 'completed' | 'abandoned';
          created_at?: string;
          completed_at?: string | null;
          due_date?: string | null;
          tags?: string[] | null;
          related_goal_id?: number | null;
        };
      };
      events: {
        Row: {
          id: number;
          user_id: string;
          title: string;
          description: string | null;
          start_time: string;
          end_time: string | null;
          type: 'scheduled' | 'unexpected';
          category: string | null;
          tags: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          title: string;
          description?: string | null;
          start_time: string;
          end_time?: string | null;
          type: 'scheduled' | 'unexpected';
          category?: string | null;
          tags?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          title?: string;
          description?: string | null;
          start_time?: string;
          end_time?: string | null;
          type?: 'scheduled' | 'unexpected';
          category?: string | null;
          tags?: string[] | null;
          created_at?: string;
        };
      };
      goals: {
        Row: {
          id: number;
          user_id: string;
          title: string;
          description: string | null;
          status: 'active' | 'paused' | 'completed' | 'abandoned';
          priority: number | null;
          created_at: string;
          target_date: string | null;
          completed_at: string | null;
          progress: number | null;
          tags: string[] | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          title: string;
          description?: string | null;
          status?: 'active' | 'paused' | 'completed' | 'abandoned';
          priority?: number | null;
          created_at?: string;
          target_date?: string | null;
          completed_at?: string | null;
          progress?: number | null;
          tags?: string[] | null;
        };
        Update: {
          id?: number;
          user_id?: string;
          title?: string;
          description?: string | null;
          status?: 'active' | 'paused' | 'completed' | 'abandoned';
          priority?: number | null;
          created_at?: string;
          target_date?: string | null;
          completed_at?: string | null;
          progress?: number | null;
          tags?: string[] | null;
        };
      };
      routines: {
        Row: {
          id: number;
          user_id: string;
          title: string;
          description: string | null;
          frequency: 'daily' | 'weekly' | 'monthly';
          target_days: number[] | null;
          active: boolean;
          created_at: string;
          tags: string[] | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          title: string;
          description?: string | null;
          frequency: 'daily' | 'weekly' | 'monthly';
          target_days?: number[] | null;
          active?: boolean;
          created_at?: string;
          tags?: string[] | null;
        };
        Update: {
          id?: number;
          user_id?: string;
          title?: string;
          description?: string | null;
          frequency?: 'daily' | 'weekly' | 'monthly';
          target_days?: number[] | null;
          active?: boolean;
          created_at?: string;
          tags?: string[] | null;
        };
      };
      routine_logs: {
        Row: {
          id: number;
          user_id: string;
          routine_id: number;
          timestamp: string;
          completed: boolean;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          routine_id: number;
          timestamp: string;
          completed?: boolean;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          routine_id?: number;
          timestamp?: string;
          completed?: boolean;
          notes?: string | null;
          created_at?: string;
        };
      };
      knowledge: {
        Row: {
          id: number;
          user_id: string;
          title: string;
          content: string;
          type: 'note' | 'idea' | 'learning' | 'documentation';
          created_at: string;
          updated_at: string;
          tags: string[] | null;
          related_ids: number[] | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          title: string;
          content: string;
          type: 'note' | 'idea' | 'learning' | 'documentation';
          created_at?: string;
          updated_at?: string;
          tags?: string[] | null;
          related_ids?: number[] | null;
        };
        Update: {
          id?: number;
          user_id?: string;
          title?: string;
          content?: string;
          type?: 'note' | 'idea' | 'learning' | 'documentation';
          created_at?: string;
          updated_at?: string;
          tags?: string[] | null;
          related_ids?: number[] | null;
        };
      };
      reflections: {
        Row: {
          id: number;
          user_id: string;
          title: string | null;
          content: string;
          type: 'journal' | 'review' | 'retrospective';
          timestamp: string;
          period: string | null;
          tags: string[] | null;
          related_domains: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          title?: string | null;
          content: string;
          type: 'journal' | 'review' | 'retrospective';
          timestamp: string;
          period?: string | null;
          tags?: string[] | null;
          related_domains?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          title?: string | null;
          content?: string;
          type?: 'journal' | 'review' | 'retrospective';
          timestamp?: string;
          period?: string | null;
          tags?: string[] | null;
          related_domains?: string[] | null;
          created_at?: string;
        };
      };
    };
  };
}
