import { Router, Request, Response } from 'express';

const router = Router();

interface ConsultaResult {
  id: number;
  fecha: string;
  tipo: string;
  descripcion: string;
  resultado: string;
}

const resultadosDemo: ConsultaResult[] = [
  { id: 1, fecha: '2025-03-18', tipo: 'Productos', descripcion: 'Total productos activos', resultado: '156' },
  { id: 2, fecha: '2025-03-18', tipo: 'Ventas', descripcion: 'Ventas del mes', resultado: '$45,230' },
  { id: 3, fecha: '2025-03-17', tipo: 'Clientes', descripcion: 'Clientes nuevos', resultado: '23' },
];

router.get('/', (req: Request, res: Response) => {
  const { q } = req.query;
  if (q && typeof q === 'string') {
    const filtered = resultadosDemo.filter(
      (r) =>
        r.tipo.toLowerCase().includes(q.toLowerCase()) ||
        r.descripcion.toLowerCase().includes(q.toLowerCase())
    );
    return res.json(filtered);
  }
  res.json(resultadosDemo);
});

router.get('/general', (req: Request, res: Response) => {
  const { filtro } = req.query;
  const data = filtro
    ? resultadosDemo.filter((r) => r.tipo.toLowerCase().includes((filtro as string).toLowerCase()))
    : resultadosDemo;
  res.json({ total: data.length, registros: data });
});

export { router as consultaRouter };
