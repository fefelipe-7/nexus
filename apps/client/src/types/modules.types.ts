import { LucideIcon } from 'lucide-react';

export interface Submodule {
  id: string;
  name: string;
  path: string;
  icon?: LucideIcon;
  description?: string;
}

export interface Module {
  id: string;
  name: string;
  icon: LucideIcon;
  path: string;
  color: string;
  submodules: Submodule[];
  description?: string;
}

export type ModuleId = 
  | 'overview'
  | 'money'
  | 'time'
  | 'goals'
  | 'health'
  | 'people'
  | 'work-study'
  | 'home-things'
  | 'projects'
  | 'digital-life'
  | 'memories'
  | 'insights';

export interface ModuleConfig {
  [key: string]: Module;
}
