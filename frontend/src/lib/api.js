import { supabase } from './supabaseClient.js';

const DEFAULT_API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function apiFetch(path, options = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');
  const resp = await fetch(`${DEFAULT_API_BASE}${path}`, {
    cache: 'no-store',
    ...options,
    headers,
  });
  const contentType = resp.headers.get('content-type') || '';
  // Some proxies may return 304 for conditional requests; treat it as non-error with empty body
  if (resp.status === 304) {
    return null;
  }
  const body = contentType.includes('application/json') ? await resp.json() : await resp.text();
  if (!resp.ok) {
    const message = typeof body === 'string' ? body : body?.message || body?.error || 'Request failed';
    const err = new Error(message);
    err.status = resp.status;
    err.body = body;
    throw err;
  }
  return body;
}

export async function getHealth() {
  try {
    const resp = await fetch(`${DEFAULT_API_BASE}/health`);
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  }
}


