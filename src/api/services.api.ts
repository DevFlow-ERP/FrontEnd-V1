// ============================================
// Services API Module
// ============================================

import apiClient from './client';
import type { Service, ServiceCreate, ServiceUpdate, ServiceType } from 'src/types/models.types';
import type { PaginatedResponse, QueryParams } from 'src/types/api.types';

/**
 * Get paginated list of services
 */
export async function listServices(params?: QueryParams): Promise<PaginatedResponse<Service>> {
  const response = await apiClient.get<PaginatedResponse<Service>>('/services', { params });
  return response.data;
}

/**
 * Get a single service by ID
 */
export async function getService(id: number): Promise<Service> {
  const response = await apiClient.get<Service>(`/services/${id}`);
  return response.data;
}

/**
 * Create a new service
 */
export async function createService(data: ServiceCreate): Promise<Service> {
  const response = await apiClient.post<Service>('/services', data);
  return response.data;
}

/**
 * Update an existing service
 */
export async function updateService(id: number, data: ServiceUpdate): Promise<Service> {
  const response = await apiClient.patch<Service>(`/services/${id}`, data);
  return response.data;
}

/**
 * Delete a service
 */
export async function deleteService(id: number): Promise<void> {
  await apiClient.delete(`/services/${id}`);
}

/**
 * Update service status
 */
export async function updateServiceStatus(id: number, status: string): Promise<Service> {
  const response = await apiClient.patch<Service>(`/services/${id}/status`, { status });
  return response.data;
}

/**
 * Get services by server
 */
export async function getServicesByServer(
  serverId: number,
  params?: QueryParams
): Promise<PaginatedResponse<Service>> {
  const response = await apiClient.get<PaginatedResponse<Service>>(`/servers/${serverId}/services`, {
    params,
  });
  return response.data;
}

/**
 * Get services by type
 */
export async function getServicesByType(
  type: ServiceType,
  params?: QueryParams
): Promise<PaginatedResponse<Service>> {
  const response = await apiClient.get<PaginatedResponse<Service>>('/services/type', {
    params: { type, ...params },
  });
  return response.data;
}
