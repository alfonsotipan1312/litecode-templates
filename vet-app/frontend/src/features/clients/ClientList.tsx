import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Client } from '../../api/client'

export function ClientList() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.clients.list().then(setClients).finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-slate-600">Cargando...</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
        <Link
          to="/clients/new"
          className="px-4 py-2 bg-vet-500 text-white rounded-lg hover:bg-vet-600 font-medium"
        >
          Registrar cliente
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Teléfono</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-800 font-medium">{client.nombre}</td>
                <td className="px-4 py-3 text-slate-600">{client.telefono ?? '-'}</td>
                <td className="px-4 py-3 text-slate-600">{client.email ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && (
          <div className="py-12 text-center text-slate-500">No hay clientes registrados</div>
        )}
      </div>
    </div>
  )
}
