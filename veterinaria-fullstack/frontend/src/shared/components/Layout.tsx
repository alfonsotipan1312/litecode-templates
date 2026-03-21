import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-vet-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex gap-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive ? 'bg-vet-dark' : 'hover:bg-vet-secondary'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/pets"
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive ? 'bg-vet-dark' : 'hover:bg-vet-secondary'
                  }`
                }
              >
                Mascotas
              </NavLink>
              <NavLink
                to="/clients"
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive ? 'bg-vet-dark' : 'hover:bg-vet-secondary'
                  }`
                }
              >
                Clientes
              </NavLink>
              <NavLink
                to="/consultations"
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive ? 'bg-vet-dark' : 'hover:bg-vet-secondary'
                  }`
                }
              >
                Historial Médico
              </NavLink>
            </div>
            <div className="flex items-center text-sm font-semibold">
              Veterinaria
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
