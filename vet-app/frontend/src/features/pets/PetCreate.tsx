import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, type Client } from '../../api/client'

export function PetCreate() {
  const navigate = useNavigate()
  const [clients, setClients] = useState<Client[]>([])
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('perro')
  const [edad, setEdad] = useState('')
  const [clienteId, setClienteId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.clients.list().then(setClients)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await api.pets.create({
        nombre: nombre.trim(),
        tipo,
        edad: parseInt(edad, 10),
        clienteId: parseInt(clienteId, 10),
      })
      navigate('/pets')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Registrar mascota</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-vet-500 focus:border-vet-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-vet-500"
          >
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
            <option value="ave">Ave</option>
            <option value="roedor">Roedor</option>
            <option value="reptil">Reptil</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Edad (años)</label>
          <input
            type="number"
            min={0}
            max={50}
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-vet-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Dueño</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-vet-500"
            required
          >
            <option value="">Seleccionar cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-vet-500 text-white rounded-lg hover:bg-vet-600 font-medium"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => navigate('/pets')}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
