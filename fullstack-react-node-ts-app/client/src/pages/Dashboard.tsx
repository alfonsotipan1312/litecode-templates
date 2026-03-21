import { Link } from 'react-router-dom';
import './Dashboard.css';

export function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="subtitle">Resumen general del sistema</p>
      <div className="cards">
        <div className="card">
          <h3>Catálogos</h3>
          <p>Gestiona los catálogos del sistema</p>
          <Link to="/catalogos">Ver catálogos →</Link>
        </div>
        <div className="card">
          <h3>Consulta</h3>
          <p>Búsqueda y filtrado de datos</p>
          <Link to="/consulta">Ir a consulta →</Link>
        </div>
        <div className="card">
          <h3>Consulta General</h3>
          <p>Consulta global con filtros</p>
          <Link to="/consulta-general">Consultar →</Link>
        </div>
      </div>
    </div>
  );
}
