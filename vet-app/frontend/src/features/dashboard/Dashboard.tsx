import { Link } from 'react-router-dom'

export function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Dashboard</h1>
      <p className="text-slate-600 mb-8">Sistema de gestión veterinaria</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/pets"
          className="block p-6 bg-white rounded-lg shadow-sm border border-slate-200 hover:border-vet-400 hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold text-slate-800">Mascotas</h2>
          <p className="text-slate-600 text-sm mt-1">Listar y registrar mascotas</p>
        </Link>
        <Link
          to="/clients"
          className="block p-6 bg-white rounded-lg shadow-sm border border-slate-200 hover:border-vet-400 hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold text-slate-800">Clientes</h2>
          <p className="text-slate-600 text-sm mt-1">Listar y registrar clientes (dueños)</p>
        </Link>
        <Link
          to="/consultations"
          className="block p-6 bg-white rounded-lg shadow-sm border border-slate-200 hover:border-vet-400 hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold text-slate-800">Historial médico</h2>
          <p className="text-slate-600 text-sm mt-1">Consultas y registros médicos</p>
        </Link>
      </div>
    </div>
  )
}
