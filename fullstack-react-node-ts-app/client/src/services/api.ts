const TOKEN_KEY = 'auth_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiLogin(usuario: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error de login');
  return data;
}

export async function apiCatalogos() {
  const res = await fetch('/api/catalogos', { headers: authHeaders() });
  if (!res.ok) throw new Error('Error al cargar catálogos');
  return res.json();
}

export async function apiConsulta(q?: string) {
  const url = q ? `/api/consulta?q=${encodeURIComponent(q)}` : '/api/consulta';
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error('Error al consultar');
  return res.json();
}

export async function apiConsultaGeneral(filtro?: string) {
  const url = filtro
    ? `/api/consulta/general?filtro=${encodeURIComponent(filtro)}`
    : '/api/consulta/general';
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error('Error en consulta general');
  return res.json();
}
