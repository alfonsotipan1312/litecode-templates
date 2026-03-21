import { useEffect, useState } from 'react'
import { fetchConsultations, createConsultation, type Consultation } from '../api/consultationApi'
import { fetchPets } from '../../pets/api/petApi'
import type { Pet } from '../../pets/api/petApi'

export function MedicalHistory() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [descripcion, setDescripcion] = useState('')
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 16))
  const [mascotaId, setMascotaId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadData = () => {
    Promise.all([fetchConsultations(), fetchPets()])
      .then(([cons, p]) => {
        setConsultations(cons)
        setPets(p)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mascotaId) return
    setSubmitting(true)
    setError('')
    try {
      await createConsultation({
        descripcion: descripcion.trim(),
        fecha: new Date(fecha).toISOString(),
        mascotaId: parseInt(mascotaId, 10),
      })
      setShowForm(false)
      setDescripcion('')
      setFecha(new Date().toISOString().slice(0, 16))
      setMascotaId('')
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-gray-600">Cargando historial...</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Historial Médico</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-vet-primary text-white px-4 py-2 rounded-lg hover:bg-vet-dark transition-colors"
        >
          {showForm ? 'Cerrar' : 'Nueva consulta'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow mb-6 max-w-lg space-y-4"
        >
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mascota</label>
            <select
              value={mascotaId}
              onChange={(e) => setMascotaId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vet-primary"
              required
            >
              <option value="">Selecciona una mascota</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} ({p.tipo}) - {p.cliente?.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="datetime-local"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vet-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vet-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-vet-primary text-white px-4 py-2 rounded-lg hover:bg-vet-dark disabled:opacity-50"
          >
            {submitting ? 'Guardando...' : 'Registrar consulta'}
          </button>
        </form>
      )}

      {error && !showForm && <p className="text-red-600 mb-4">{error}</p>}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mascota</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {consultations.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {new Date(c.fecha).toLocaleString('es')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {c.mascota?.nombre ?? '-'} {c.mascota?.cliente && `(${c.mascota.cliente.nombre})`}
                </td>
                <td className="px-6 py-4 text-gray-600">{c.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {consultations.length === 0 && (
          <p className="p-6 text-gray-500 text-center">No hay consultas registradas</p>
        )}
      </div>
    </div>
  )
}
