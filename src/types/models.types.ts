// ============================================
// Domain Model Types - Based on DB Schema
// ============================================

import type { BaseEntity } from './common.types';

// ============================================
// Enums (matching PostgreSQL ENUM types)
// ============================================

export type TeamRole = 'owner' | 'admin' | 'member' | 'viewer';

export type IssueStatus =
  | 'todo'
  | 'in_progress'
  | 'in_review'
  | 'testing'
  | 'done'
  | 'closed';

export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent';

export type IssueType = 'epic' | 'story' | 'task' | 'bug' | 'improvement';

export type SprintStatus = 'planning' | 'active' | 'completed' | 'cancelled';

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';

export type ServerEnvironment = 'development' | 'staging' | 'production';

export type ServerType = 'web' | 'api' | 'database' | 'cache' | 'message_queue' | 'other';

export type ServerStatus = 'running' | 'stopped' | 'maintenance' | 'error';

export type ServiceType =
  | 'backend'
  | 'frontend'
  | 'database'
  | 'cache'
  | 'message_queue'
  | 'api_gateway'
  | 'other';

export type ServiceStatus = 'running' | 'stopped' | 'deploying' | 'error';

export type DeploymentStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'rolled_back';

// ============================================
// User
// ============================================

export interface User extends BaseEntity {
  authentik_id: string;
  email: string;
  username: string;
  full_name: string | null;
  phone: string | null;
  is_active: boolean;
  is_admin: boolean; // Backend uses is_admin instead of is_superuser
  is_superuser?: boolean; // Alias for compatibility
  avatar_url: string | null;
}

export interface UserCreate {
  authentik_id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
}

export interface UserUpdate {
  full_name?: string;
  avatar_url?: string;
  is_active?: boolean;
}

// ============================================
// Team
// ============================================

export interface Team extends BaseEntity {
  name: string;
  description: string | null;
  owner_id: number;
  is_active: boolean;
}

export interface TeamCreate {
  name: string;
  description?: string;
}

export interface TeamUpdate {
  name?: string;
  description?: string;
  is_active?: boolean;
}

// ============================================
// Team Member
// ============================================

export interface TeamMember extends BaseEntity {
  team_id: number;
  user_id: number;
  role: TeamRole;
  joined_at: string;
}

export interface TeamMemberCreate {
  team_id: number;
  user_id: number;
  role: TeamRole;
}

export interface TeamMemberUpdate {
  role?: TeamRole;
}

// ============================================
// Project
// ============================================

export interface Project extends BaseEntity {
  name: string;
  description: string | null;
  team_id: number;
  status: ProjectStatus;
  start_date: string | null;
  end_date: string | null;
  repository_url: string | null;
}

export interface ProjectCreate {
  name: string;
  description?: string;
  team_id: number;
  status?: ProjectStatus;
  start_date?: string;
  end_date?: string;
  repository_url?: string;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  start_date?: string;
  end_date?: string;
  repository_url?: string;
}

// ============================================
// Sprint
// ============================================

export interface Sprint extends BaseEntity {
  name: string;
  project_id: number;
  goal: string | null;
  status: SprintStatus;
  start_date: string | null;
  end_date: string | null;
}

export interface SprintCreate {
  name: string;
  project_id: number;
  goal?: string;
  status?: SprintStatus;
  start_date?: string;
  end_date?: string;
}

export interface SprintUpdate {
  name?: string;
  goal?: string;
  status?: SprintStatus;
  start_date?: string;
  end_date?: string;
}

// ============================================
// Issue
// ============================================

export interface Issue extends BaseEntity {
  title: string;
  description: string | null;
  project_id: number;
  sprint_id: number | null;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  assignee_id: number | null;
  reporter_id: number;
  story_points: number | null;
  due_date: string | null;
}

export interface IssueCreate {
  title: string;
  description?: string;
  project_id: number;
  sprint_id?: number;
  type: IssueType;
  status?: IssueStatus;
  priority?: IssuePriority;
  assignee_id?: number;
  reporter_id: number;
  story_points?: number;
  due_date?: string;
}

export interface IssueUpdate {
  title?: string;
  description?: string;
  sprint_id?: number;
  type?: IssueType;
  status?: IssueStatus;
  priority?: IssuePriority;
  assignee_id?: number;
  story_points?: number;
  due_date?: string;
}

// ============================================
// Server
// ============================================

export interface Server extends BaseEntity {
  name: string;
  description: string | null;
  hostname: string;
  ip_address: string;
  environment: ServerEnvironment;
  type: ServerType;
  status: ServerStatus;
  os_type: string | null;
  os_version: string | null;
  cpu_cores: number | null;
  memory_gb: number | null;
  disk_gb: number | null;
}

export interface ServerCreate {
  name: string;
  description?: string;
  hostname: string;
  ip_address: string;
  environment: ServerEnvironment;
  type: ServerType;
  status?: ServerStatus;
  os_type?: string;
  os_version?: string;
  cpu_cores?: number;
  memory_gb?: number;
  disk_gb?: number;
}

export interface ServerUpdate {
  name?: string;
  description?: string;
  hostname?: string;
  ip_address?: string;
  environment?: ServerEnvironment;
  type?: ServerType;
  status?: ServerStatus;
  os_type?: string;
  os_version?: string;
  cpu_cores?: number;
  memory_gb?: number;
  disk_gb?: number;
}

// ============================================
// Service
// ============================================

export interface Service extends BaseEntity {
  name: string;
  description: string | null;
  server_id: number;
  project_id: number;
  type: ServiceType;
  status: ServiceStatus;
  port: number | null;
  repository_url: string | null;
  current_version: string | null;
}

export interface ServiceCreate {
  name: string;
  description?: string;
  server_id: number;
  project_id: number;
  type: ServiceType;
  status?: ServiceStatus;
  port?: number;
  repository_url?: string;
  current_version?: string;
}

export interface ServiceUpdate {
  name?: string;
  description?: string;
  server_id?: number;
  type?: ServiceType;
  status?: ServiceStatus;
  port?: number;
  repository_url?: string;
  current_version?: string;
}

// ============================================
// Deployment
// ============================================

export interface Deployment extends BaseEntity {
  service_id: number;
  version: string;
  environment: ServerEnvironment;
  status: DeploymentStatus;
  deployed_by: number;
  deployed_at: string | null;
  rollback_version: string | null;
  notes: string | null;
}

export interface DeploymentCreate {
  service_id: number;
  version: string;
  environment: ServerEnvironment;
  status?: DeploymentStatus;
  deployed_by: number;
  deployed_at?: string;
  rollback_version?: string;
  notes?: string;
}

export interface DeploymentUpdate {
  status?: DeploymentStatus;
  deployed_at?: string;
  notes?: string;
}
