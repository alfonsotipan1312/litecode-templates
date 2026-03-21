import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchPetById, type Pet } from '../api/petApi'

export function PetDetail() {
  const { id } = useParams<{ id: string }>()
  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    fetchPetById(parseInt(id, 10))
      .then(setPet)
      .catch((e) => setError(e instanceof Error ? e.message : 'Error'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-gray-600">Cargando...</p>
  if (error) return <p className="text-red-600">{error}</p>
  if (!pet) return <p className="text-gray-600">Mascota no encontrada</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Detalle de mascota</h1>
        <Link
          to="/pets"
          className="text-vet-primary hover:underline"
        >
          ← Volver a mascotas
        </Link>
      </div>
      <div className="bg-white p-6 rounded-lg shadow max-w-lg">
        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Nombre</dt>
            <dd className="text-gray-900 font-medium">{pet.nombre}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Tipo</dt>
            <dd className="text-gray-900 capitalize">{pet.tipo}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Edad</dt>
            <dd className="text-gray-900">{pet.edad} años</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Dueño</dt>
            <dd className="text-gray-900">{pet.cliente?.nombre ?? '-'}</dd>
            {pet.cliente && (
              <dd className="text-sm text-gray-500 mt-0.5">
                {pet.cliente.telefono} · {pet.cliente.email}
              </dd>
            )}
          </div>
        </dl>
        <Link
          to="/consultations"
          className="inline-block mt-4 text-vet-primary hover:underline"
        >
          Ver historial médico →
        </Link>
      </div>
    </div>
  )
}
