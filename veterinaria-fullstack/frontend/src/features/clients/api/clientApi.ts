const API_BASE = ''

export interface Client {
  id: number
  nombre: string
  telefono: string
  email: string
}

export async function fetchClients(): Promise<Client[]> {
  const res = await fetch(`${API_BASE}/clients`)
  if (!res.ok) throw new Error('Error al cargar clientes')
  return res.json()
}

export async function createClient(data: {
  nombre: string
  telefono: string
  email: string
}): Promise<Client> {
  const res = await fetch(`${API_BASE}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Error al crear cliente')
  }
  return res.json()
}
