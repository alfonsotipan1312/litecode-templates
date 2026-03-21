import { Request, Response } from 'express';
import { clientService } from '../services/clientService.js';

export const clientController = {
  getAll: async (_req: Request, res: Response) => {
    const clients = await clientService.getAll();
    res.json(clients);
  },

  getById: async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const client = await clientService.getById(id);
    if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(client);
  },

  create: async (req: Request, res: Response) => {
    const { nombre, telefono, email } = req.body;
    const client = await clientService.create({ nombre, telefono, email });
    res.status(201).json(client);
  },
};
