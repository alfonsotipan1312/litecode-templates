import { useEffect, useState } from 'react';
import { apiConsultaGeneral } from '../services/api';
import './ConsultaGeneral.css';

interface Registro {
  id: number;
  fecha: string;
  tipo: string;
  descripcion: string;
  resultado: string;
}

interface ResultadoConsulta {
  total: number;
  registros: Registro[];
}

export function ConsultaGeneral() {
  const [data, setData] = useState<ResultadoConsulta | null>(null);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (f?: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiConsultaGeneral(f);
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

  const handleFiltro = (e: React.FormEvent) => {
    e.preventDefault();
    load(filtro || undefined);
  };

  return (
    <div className="consulta-general-page">
      <h1>Consulta General</h1>
      <p className="subtitle">Consulta global con filtros avanzados</p>
      <form onSubmit={handleFiltro} className="filter-form">
        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Filtrar por tipo..."
        />
        <button type="submit">Aplicar filtro</button>
        {filtro && (
          <button type="button" onClick={() => { setFiltro(''); load(); }}>
            Limpiar
          </button>
        )}
      </form>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <p>Cargando...</p>
      ) : data ? (
        <>
          <div className="total">Total: {data.total} registros</div>
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
                {data.registros.map((row) => (
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
        </>
      ) : null}
    </div>
  );
}
