import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Pet } from '../../api/client'

export function PetList() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.pets.list().then(setPets).finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-slate-600">Cargando...</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Mascotas</h1>
        <Link
          to="/pets/new"
          className="px-4 py-2 bg-vet-500 text-white rounded-lg hover:bg-vet-600 font-medium"
        >
          Registrar mascota
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Edad</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Dueño</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {pets.map((pet) => (
              <tr key={pet.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-800 font-medium">{pet.nombre}</td>
                <td className="px-4 py-3 text-slate-600 capitalize">{pet.tipo}</td>
                <td className="px-4 py-3 text-slate-600">{pet.edad} años</td>
                <td className="px-4 py-3 text-slate-600">{pet.cliente?.nombre ?? '-'}</td>
                <td className="px-4 py-3">
                  <Link to={`/pets/${pet.id}`} className="text-vet-600 hover:text-vet-700 font-medium">
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pets.length === 0 && (
          <div className="py-12 text-center text-slate-500">No hay mascotas registradas</div>
        )}
      </div>
    </div>
  )
}
