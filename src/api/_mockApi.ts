// src/api/_mockApi.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PaginatedResponse } from 'src/types/api.types';

// API 호출을 시뮬레이션하기 위한 딜레이 (ms)
const MOCK_DELAY = 300; // 300ms 딜레이로 로딩 스피너 확인 가능

/**
 * API 응답을 시뮬레이션합니다 (딜레이 포함)
 * @param data - 반환할 데이터
 * @param status - HTTP 상태 코드 (기본값 200)
 */
export function mockResponse<T>(data: T, status = 200): Promise<{ data: T; status: number }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (status >= 200 && status < 300) {
        // 실제 API 응답처럼 깊은 복사하여 반환
        resolve({ data: JSON.parse(JSON.stringify(data)), status });
      } else {
        reject(new Error(`Mock API Error: ${status}`));
      }
    }, MOCK_DELAY);
  });
}

/**
 * PaginatedResponse 형태의 API 응답을 시뮬레이션합니다.
 */
export function mockPaginatedResponse<T extends { id: number; [key: string]: any }>(
  allItems: T[],
  params?: {
    page?: number;
    size?: number;
    search?: string;
    [key: string]: any; // 기타 필터
  },
): Promise<{ data: PaginatedResponse<T> }> {
  let items = [...allItems];
  const filters = params || {};

  // 1. 검색 필터링 (name 또는 title 필드 기준)
  if (filters.search) {
    const query = filters.search.toLowerCase();
    items = items.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.version && item.version.toLowerCase().includes(query)),
    );
  }

  // 2. 기타 정확한 값 필터링 (search, page, size 제외)
  const filterKeys = Object.keys(filters).filter(
    (k) => k !== 'page' && k !== 'size' && k !== 'search',
  );

  for (const key of filterKeys) {
    if (filters[key]) {
      items = items.filter((item: any) => item[key] == filters[key]);
    }
  }

  // 3. 페이지네이션
  const page = Number(filters.page || 1);
  const size = Number(filters.size || 10); // 기본값 10으로 수정
  const total = items.length;
  const totalPages = Math.ceil(total / size) || 1;
  const paginatedItems = items.slice((page - 1) * size, page * size);

  const response: PaginatedResponse<T> = {
    items: paginatedItems,
    total: total,
    page: page,
    size: size,
    pages: totalPages,
  };

  return mockResponse(response);
}

/**
 * 단일 항목 GET 응답을 시뮬레이션합니다.
 */
export function mockGetResponse<T extends { id: number }>(
  allItems: T[],
  id: number,
): Promise<{ data: T }> {
  const item = allItems.find((i) => i.id === id);
  if (!item) {
    return mockResponse({ error: 'Not Found' } as any, 404) as any;
  }
  return mockResponse(item);
}

/**
 * 항목 생성(Create) 응답을 시뮬레이션합니다.
 */
export function mockCreateResponse<
  T extends { id: number; created_at?: string; updated_at?: string },
>(allItems: T[], data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: T }> {
  const newId = Math.max(0, ...allItems.map((i) => i.id)) + 1;
  const now = new Date().toISOString();

  const newItem = {
    ...data,
    id: newId,
    created_at: now,
    updated_at: now,
  } as T;

  allItems.unshift(newItem); // 배열의 맨 앞에 추가
  return mockResponse(newItem);
}

/**
 * 항목 수정(Update/Patch) 응답을 시뮬레이션합니다.
 */
export function mockUpdateResponse<T extends { id: number; updated_at?: string }>(
  allItems: T[],
  id: number,
  data: Partial<T>,
): Promise<{ data: T }> {
  const index = allItems.findIndex((i) => i.id === id);
  if (index === -1) {
    return mockResponse({ error: 'Not Found' } as any, 404) as any;
  }

  const updatedItem = {
    ...allItems[index],
    ...data,
    updated_at: new Date().toISOString(),
  } as T;

  allItems[index] = updatedItem;
  return mockResponse(updatedItem);
}

/**
 * 항목 삭제(Delete) 응답을 시뮬레이션합니다.
 */
export function mockDeleteResponse<T extends { id: number }>(
  allItems: T[],
  id: number,
): Promise<{ data: void }> {
  const index = allItems.findIndex((i) => i.id === id);
  if (index === -1) {
    return mockResponse({ error: 'Not Found' } as any, 404) as any;
  }

  allItems.splice(index, 1);
  return mockResponse(undefined as void);
}

/**
 * 단순 성공 응답 (e.g. 200 OK, { message: "success" })
 */
export function mockSuccessResponse(data: any = { message: 'Success' }): Promise<{ data: any }> {
  return mockResponse(data);
}
