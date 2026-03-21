import { useState, useEffect } from 'react'
import { api, type Pet } from '../../api/client'

interface ConsultationCreateProps {
  onCreated: () => void
  onCancel: () => void
}

export function ConsultationCreate({ onCreated, onCancel }: ConsultationCreateProps) {
  const [pets, setPets] = useState<Pet[]>([])
  const [descripcion, setDescripcion] = useState('')
  const [mascotaId, setMascotaId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.pets.list().then(setPets)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await api.consultations.create({
        descripcion: descripcion.trim(),
        mascotaId: parseInt(mascotaId, 10),
      })
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Nueva consulta</h2>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mascota</label>
          <select
            value={mascotaId}
            onChange={(e) => setMascotaId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-vet-500"
            required
          >
            <option value="">Seleccionar mascota</option>
            {pets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} ({p.tipo}) - {p.cliente?.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-vet-500 focus:border-vet-500"
            required
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-vet-500 text-white rounded-lg hover:bg-vet-600 font-medium"
          >
            Guardar consulta
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
