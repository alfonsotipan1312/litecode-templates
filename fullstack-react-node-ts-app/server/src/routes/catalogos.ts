import { Router, Request, Response } from 'express';

const router = Router();

interface Catalogo {
  id: number;
  codigo: string;
  nombre: string;
  activo: boolean;
}

const catalogos: Catalogo[] = [
  { id: 1, codigo: 'CAT001', nombre: 'Productos', activo: true },
  { id: 2, codigo: 'CAT002', nombre: 'Clientes', activo: true },
  { id: 3, codigo: 'CAT003', nombre: 'Proveedores', activo: true },
  { id: 4, codigo: 'CAT004', nombre: 'Usuarios', activo: false },
];

router.get('/', (_req: Request, res: Response) => {
  res.json(catalogos);
});

router.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const item = catalogos.find((c) => c.id === id);
  if (!item) return res.status(404).json({ error: 'No encontrado' });
  res.json(item);
});

export { router as catalogosRouter };
