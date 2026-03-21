import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchClients, type Client } from '../api/clientApi'

export function ClientList() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchClients()
      .then(setClients)
      .catch((e) => setError(e instanceof Error ? e.message : 'Error'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-600">Cargando clientes...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <Link
          to="/clients/new"
          className="bg-vet-primary text-white px-4 py-2 rounded-lg hover:bg-vet-dark transition-colors"
        >
          Nuevo cliente
        </Link>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{client.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{client.telefono}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{client.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && (
          <p className="p-6 text-gray-500 text-center">No hay clientes registrados</p>
        )}
      </div>
    </div>
  )
}
