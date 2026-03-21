import { Request, Response } from 'express';
import { petService } from '../services/petService.js';

export const petController = {
  getAll: async (_req: Request, res: Response) => {
    const pets = await petService.getAll();
    res.json(pets);
  },

  getById: async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const pet = await petService.getById(id);
    if (!pet) return res.status(404).json({ error: 'Mascota no encontrada' });
    res.json(pet);
  },

  create: async (req: Request, res: Response) => {
    const { nombre, tipo, edad, clienteId } = req.body;
    const pet = await petService.create({
      nombre,
      tipo,
      edad: parseInt(String(edad), 10),
      clienteId: parseInt(String(clienteId), 10),
    });
    res.status(201).json(pet);
  },
};
