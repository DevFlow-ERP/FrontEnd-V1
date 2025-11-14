import apiClient from './client';
// [!code !] (시작) 'TeamMember' 관련 타입을 models.types에서 가져오도록 수정
import type { TeamMember, TeamMemberCreate, TeamRole } from 'src/types/models.types';
// [!code !] (끝)
import type { PaginatedResponse, QueryParams } from 'src/types/api.types';

/**
 * Get paginated list of members for a team
 */
export async function listMembers(
  teamId: number,
  params?: QueryParams,
): Promise<PaginatedResponse<TeamMember>> {
  const response = await apiClient.get<PaginatedResponse<TeamMember>>(
    `/members/team/${teamId}`, // <--- 이렇게 수정합니다.
    {
      params,
    },
  );
  return response.data;
}

/**
 * Add a member to a team
 */
export async function addMember(data: TeamMemberCreate): Promise<TeamMember> {
  const response = await apiClient.post<TeamMember>(`/teams/${data.team_id}/members`, data);
  return response.data;
}

/**
 * Remove a member from a team
 */
export async function removeMember(teamId: number, userId: number): Promise<void> {
  await apiClient.delete(`/teams/${teamId}/members/${userId}`);
}

/**
 * Update a member's role in a team
 */
export async function updateMemberRole(
  teamId: number,
  userId: number,
  role: TeamRole,
): Promise<TeamMember> {
  const response = await apiClient.put<TeamMember>(`/teams/${teamId}/members/${userId}`, { role });
  return response.data;
}
