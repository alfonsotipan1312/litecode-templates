import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, type Pet } from '../../api/client'

export function PetDetail() {
  const { id } = useParams<{ id: string }>()
  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    api.pets.get(parseInt(id, 10)).then(setPet).finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-slate-600">Cargando...</p>
  if (!pet) return <p className="text-slate-600">Mascota no encontrada</p>

  const formatDate = (s: string) => new Date(s).toLocaleDateString('es-ES', { dateStyle: 'medium' })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">{pet.nombre}</h1>
        <Link to="/pets" className="text-vet-600 hover:text-vet-700 font-medium">
          ← Volver a mascotas
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-4">
        <div>
          <span className="text-slate-600 text-sm">Tipo</span>
          <p className="font-medium capitalize">{pet.tipo}</p>
        </div>
        <div>
          <span className="text-slate-600 text-sm">Edad</span>
          <p className="font-medium">{pet.edad} años</p>
        </div>
        <div>
          <span className="text-slate-600 text-sm">Dueño</span>
          <p className="font-medium">
            <Link to={`/clients`} className="text-vet-600 hover:underline">
              {pet.cliente?.nombre ?? '-'}
            </Link>
          </p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Historial de consultas</h2>
        {pet.consultas && pet.consultas.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 divide-y divide-slate-200">
            {pet.consultas.map((c) => (
              <div key={c.id} className="p-4">
                <p className="text-slate-600 text-sm">{formatDate(c.fecha)}</p>
                <p className="text-slate-800">{c.descripcion}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">Sin consultas registradas</p>
        )}
      </div>
    </div>
  )
}
