// src/api/users.api.ts
import apiClient from './client';
import type { User } from 'src/types/models.types';
import type { PaginatedResponse, QueryParams } from 'src/types/api.types';

/**
 * Get paginated list of users (for assignees, etc.)
 */
export async function listUsers(params?: QueryParams): Promise<PaginatedResponse<User>> {
  const response = await apiClient.get<PaginatedResponse<User>>('/users', {
    params,
  });
  return response.data;
}
