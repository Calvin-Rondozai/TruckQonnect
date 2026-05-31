import { AUTH_API_PREFIX } from '@/lib/api-config';
import { getAccessToken } from '@/lib/auth-storage';
import { ApiError } from '@/lib/auth-api';

export async function authHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${AUTH_API_PREFIX}${path}`, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers ?? {}),
    },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const record = body as Record<string, unknown>;
    const detail = record.detail;
    const message =
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail) && typeof detail[0] === 'string'
          ? detail[0]
          : 'Request failed.';
    throw new ApiError(message);
  }
  return body as T;
}
