const API_BASE = ''

export interface Consultation {
  id: number
  descripcion: string
  fecha: string
  mascotaId: number
  mascota?: {
    id: number
    nombre: string
    tipo: string
    cliente?: { nombre: string }
  }
}

export async function fetchConsultations(): Promise<Consultation[]> {
  const res = await fetch(`${API_BASE}/consultations`)
  if (!res.ok) throw new Error('Error al cargar historial')
  return res.json()
}

export async function createConsultation(data: {
  descripcion: string
  fecha: string
  mascotaId: number
}): Promise<Consultation> {
  const res = await fetch(`${API_BASE}/consultations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Error al registrar consulta')
  }
  return res.json()
}
