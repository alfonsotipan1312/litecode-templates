import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Consultation } from '../../api/client'
import { ConsultationCreate } from './ConsultationCreate'

export function ConsultationList() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const load = () => api.consultations.list().then(setConsultations)

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const onCreated = () => {
    setShowForm(false)
    load()
  }

  if (loading) return <p className="text-slate-600">Cargando...</p>

  const formatDate = (s: string) => new Date(s).toLocaleDateString('es-ES', { dateStyle: 'medium' })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Historial médico</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-vet-500 text-white rounded-lg hover:bg-vet-600 font-medium"
        >
          Registrar consulta
        </button>
      </div>

      {showForm && <ConsultationCreate onCreated={onCreated} onCancel={() => setShowForm(false)} />}

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mt-6">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Mascota</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Descripción</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {consultations.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-600">{formatDate(c.fecha)}</td>
                <td className="px-4 py-3 text-slate-800 font-medium">
                  <Link to={`/pets/${c.mascota?.id}`} className="text-vet-600 hover:underline">
                    {c.mascota?.nombre ?? '-'}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{c.descripcion}</td>
                <td className="px-4 py-3">
                  {c.mascota?.id && (
                    <Link to={`/pets/${c.mascota.id}`} className="text-vet-600 hover:text-vet-700 text-sm">
                      Ver mascota
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {consultations.length === 0 && !showForm && (
          <div className="py-12 text-center text-slate-500">No hay consultas registradas</div>
        )}
      </div>
    </div>
  )
}
