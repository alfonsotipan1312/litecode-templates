import { Link } from 'react-router-dom'

export function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/pets"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
        >
          <h2 className="text-lg font-semibold text-vet-primary mb-2">Mascotas</h2>
          <p className="text-gray-600 text-sm">Gestiona el registro de mascotas</p>
        </Link>
        <Link
          to="/clients"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
        >
          <h2 className="text-lg font-semibold text-vet-primary mb-2">Clientes</h2>
          <p className="text-gray-600 text-sm">Gestiona los dueños de mascotas</p>
        </Link>
        <Link
          to="/consultations"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
        >
          <h2 className="text-lg font-semibold text-vet-primary mb-2">Historial Médico</h2>
          <p className="text-gray-600 text-sm">Registra consultas y seguimiento</p>
        </Link>
      </div>
    </div>
  )
}
