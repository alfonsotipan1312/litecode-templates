import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPet } from '../api/petApi'
import { fetchClients, type Client } from '../../clients/api/clientApi'

export function PetForm() {
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('perro')
  const [edad, setEdad] = useState('')
  const [clienteId, setClienteId] = useState('')
  const [clients, setClients] = useState<Client[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchClients().then(setClients).catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const ageNum = parseInt(edad, 10)
    if (isNaN(ageNum) || ageNum < 0) {
      setError('Edad inválida')
      return
    }
    if (!clienteId) {
      setError('Selecciona un dueño')
      return
    }
    setLoading(true)
    try {
      await createPet({
        nombre: nombre.trim(),
        tipo,
        edad: ageNum,
        clienteId: parseInt(clienteId, 10),
      })
      navigate('/pets')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Registrar mascota</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow max-w-md space-y-4"
      >
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vet-primary focus:border-vet-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vet-primary focus:border-vet-primary"
          >
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
            <option value="ave">Ave</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Edad (años)</label>
          <input
            type="number"
            min="0"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vet-primary focus:border-vet-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dueño</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vet-primary focus:border-vet-primary"
            required
          >
            <option value="">Selecciona un cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          {clients.length === 0 && (
            <p className="text-amber-600 text-sm mt-1">
              No hay clientes. Registra uno primero en Clientes.
            </p>
          )}
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-vet-primary text-white px-4 py-2 rounded-lg hover:bg-vet-dark disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/pets')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
