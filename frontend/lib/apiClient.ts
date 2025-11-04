const DEFAULT_BASE_URL = '/api';

function resolveBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (fromEnv && typeof fromEnv === 'string' && fromEnv.trim().length > 0) {
    return fromEnv.replace(/\/$/, '');
  }
  return DEFAULT_BASE_URL;
}

export const API_BASE_URL = resolveBaseUrl();

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = await response.json();
      if (body?.error) {
        message = body.error;
      }
    } catch {
      // ignore JSON parse errors and use statusText
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as unknown as T;
  }
  return JSON.parse(text) as T;
}

export async function get<T>(path: string, init?: RequestInit) {
  return apiRequest<T>(path, { ...(init ?? {}), method: 'GET' });
}

export async function post<T>(path: string, body?: unknown, init?: RequestInit) {
  return apiRequest<T>(path, {
    ...(init ?? {}),
    method: 'POST',
    body: body === undefined ? undefined : JSON.stringify(body)
  });
}

export async function patch<T>(path: string, body?: unknown, init?: RequestInit) {
  return apiRequest<T>(path, {
    ...(init ?? {}),
    method: 'PATCH',
    body: body === undefined ? undefined : JSON.stringify(body)
  });
}

export async function del<T>(path: string, init?: RequestInit) {
  return apiRequest<T>(path, {
    ...(init ?? {}),
    method: 'DELETE'
  });
}
