const API_BASE = ''

export interface Pet {
  id: number
  nombre: string
  tipo: string
  edad: number
  clienteId: number
  cliente?: { id: number; nombre: string; telefono: string; email: string }
}

export async function fetchPets(): Promise<Pet[]> {
  const res = await fetch(`${API_BASE}/pets`)
  if (!res.ok) throw new Error('Error al cargar mascotas')
  return res.json()
}

export async function fetchPetById(id: number): Promise<Pet> {
  const res = await fetch(`${API_BASE}/pets/${id}`)
  if (!res.ok) throw new Error('Mascota no encontrada')
  return res.json()
}

export async function createPet(data: {
  nombre: string
  tipo: string
  edad: number
  clienteId: number
}): Promise<Pet> {
  const res = await fetch(`${API_BASE}/pets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Error al crear mascota')
  }
  return res.json()
}
