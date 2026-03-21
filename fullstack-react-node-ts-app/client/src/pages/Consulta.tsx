import { useEffect, useState } from 'react';
import { apiConsulta } from '../services/api';
import './Consulta.css';

interface ConsultaItem {
  id: number;
  fecha: string;
  tipo: string;
  descripcion: string;
  resultado: string;
}

export function Consulta() {
  const [data, setData] = useState<ConsultaItem[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (query?: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiConsulta(query);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(q || undefined);
  };

  return (
    <div className="consulta-page">
      <h1>Consulta</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por tipo o descripción..."
        />
        <button type="submit">Buscar</button>
      </form>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.fecha}</td>
                  <td>{row.tipo}</td>
                  <td>{row.descripcion}</td>
                  <td>{row.resultado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
