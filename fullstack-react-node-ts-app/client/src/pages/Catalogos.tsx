import { useEffect, useState } from 'react';
import { apiCatalogos } from '../services/api';
import './Catalogos.css';

interface Catalogo {
  id: number;
  codigo: string;
  nombre: string;
  activo: boolean;
}

export function Catalogos() {
  const [data, setData] = useState<Catalogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiCatalogos()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando catálogos...</p>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="catalogos-page">
      <h1>Catálogos</h1>
      <p className="subtitle">Listado de catálogos del sistema</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.codigo}</td>
                <td>{item.nombre}</td>
                <td>
                  <span className={item.activo ? 'badge active' : 'badge inactive'}>
                    {item.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
