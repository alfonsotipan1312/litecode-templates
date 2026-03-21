import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export function Layout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2 className="logo">App</h2>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>
          <NavLink to="/consulta" className={({ isActive }) => (isActive ? 'active' : '')}>
            Consulta
          </NavLink>
          <NavLink to="/catalogos" className={({ isActive }) => (isActive ? 'active' : '')}>
            Catálogos
          </NavLink>
          <NavLink to="/consulta-general" className={({ isActive }) => (isActive ? 'active' : '')}>
            Consulta General
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <span className="user">{usuario}</span>
          <button type="button" onClick={handleLogout} className="btn-logout">
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
