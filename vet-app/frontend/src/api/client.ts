const BASE = '';

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Error de red');
  return data as T;
}

export const api = {
  clients: {
    list: () => fetchApi<Client[]>('/clients'),
    create: (body: CreateClient) => fetchApi<Client>('/clients', { method: 'POST', body: JSON.stringify(body) }),
  },
  pets: {
    list: () => fetchApi<Pet[]>('/pets'),
    get: (id: number) => fetchApi<Pet>(`/pets/${id}`),
    create: (body: CreatePet) => fetchApi<Pet>('/pets', { method: 'POST', body: JSON.stringify(body) }),
  },
  consultations: {
    list: () => fetchApi<Consultation[]>('/consultations'),
    create: (body: CreateConsultation) =>
      fetchApi<Consultation>('/consultations', { method: 'POST', body: JSON.stringify(body) }),
  },
};

export interface Client {
  id: number;
  nombre: string;
  telefono: string | null;
  email: string | null;
  mascotas?: Pet[];
}

export interface Pet {
  id: number;
  nombre: string;
  tipo: string;
  edad: number;
  clienteId: number;
  cliente?: Client;
  consultas?: Consultation[];
}

export interface Consultation {
  id: number;
  descripcion: string;
  fecha: string;
  mascotaId: number;
  mascota?: Pet;
}

export interface CreateClient {
  nombre: string;
  telefono?: string;
  email?: string;
}

export interface CreatePet {
  nombre: string;
  tipo: string;
  edad: number;
  clienteId: number;
}

export interface CreateConsultation {
  descripcion: string;
  fecha?: string;
  mascotaId: number;
}
