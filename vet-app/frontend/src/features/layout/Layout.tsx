import { Outlet, NavLink } from 'react-router-dom'

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-6 h-14 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-semibold ${isActive ? 'text-vet-600' : 'text-slate-600 hover:text-vet-600'}`
              }
            >
              Veterinaria
            </NavLink>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? 'text-vet-600 font-medium' : 'text-slate-600 hover:text-vet-600'
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/pets"
              className={({ isActive }) =>
                isActive ? 'text-vet-600 font-medium' : 'text-slate-600 hover:text-vet-600'
              }
            >
              Mascotas
            </NavLink>
            <NavLink
              to="/clients"
              className={({ isActive }) =>
                isActive ? 'text-vet-600 font-medium' : 'text-slate-600 hover:text-vet-600'
              }
            >
              Clientes
            </NavLink>
            <NavLink
              to="/consultations"
              className={({ isActive }) =>
                isActive ? 'text-vet-600 font-medium' : 'text-slate-600 hover:text-vet-600'
              }
            >
              Historial médico
            </NavLink>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
