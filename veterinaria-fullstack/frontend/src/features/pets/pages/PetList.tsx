import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPets, type Pet } from '../api/petApi'

export function PetList() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPets()
      .then(setPets)
      .catch((e) => setError(e instanceof Error ? e.message : 'Error'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-600">Cargando mascotas...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mascotas</h1>
        <Link
          to="/pets/new"
          className="bg-vet-primary text-white px-4 py-2 rounded-lg hover:bg-vet-dark transition-colors"
        >
          Nueva mascota
        </Link>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Edad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dueño</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pets.map((pet) => (
              <tr key={pet.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{pet.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600 capitalize">{pet.tipo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{pet.edad} años</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {pet.cliente?.nombre ?? '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/pets/${pet.id}`} className="text-vet-primary hover:underline">
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pets.length === 0 && (
          <p className="p-6 text-gray-500 text-center">No hay mascotas registradas</p>
        )}
      </div>
    </div>
  )
}
