// ============================================
// Members API - Team member management endpoints
// ============================================

import apiClient from './client';
import type { TeamMember } from 'src/types/models.types';
import type { PaginatedResponse, QueryParams } from 'src/types/api.types';

/**
 * Get all team members (across all teams)
 */
export async function listMembers(params?: QueryParams): Promise<PaginatedResponse<TeamMember>> {
  const response = await apiClient.get<PaginatedResponse<TeamMember>>('/members', { params });
  return response.data;
}

/**
 * Get a single team member by ID
 */
export async function getMember(id: number): Promise<TeamMember> {
  const response = await apiClient.get<TeamMember>(`/members/${id}`);
  return response.data;
}

/**
 * Get current user's team memberships
 */
export async function getMyMemberships(params?: QueryParams): Promise<PaginatedResponse<TeamMember>> {
  const response = await apiClient.get<PaginatedResponse<TeamMember>>('/members/my', { params });
  return response.data;
}

/**
 * Get members by user ID
 */
export async function getMembersByUser(userId: number, params?: QueryParams): Promise<PaginatedResponse<TeamMember>> {
  const response = await apiClient.get<PaginatedResponse<TeamMember>>(`/members/user/${userId}`, { params });
  return response.data;
}
