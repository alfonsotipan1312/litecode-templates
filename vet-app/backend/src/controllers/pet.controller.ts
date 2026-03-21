import type { Request, Response } from 'express';
import { petService } from '../services/pet.service.js';
import { handleError } from '../errors.js';

export const petController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const data = await petService.getAll();
      res.json(data);
    } catch (err) {
      handleError(err, res);
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
      const data = await petService.getById(id);
      res.json(data);
    } catch (err) {
      handleError(err, res);
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const data = await petService.create(req.body);
      res.status(201).json(data);
    } catch (err) {
      handleError(err, res);
    }
  },
};
