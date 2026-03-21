import type { Request, Response } from 'express';
import { clientService } from '../services/client.service.js';
import { handleError } from '../errors.js';

export const clientController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const data = await clientService.getAll();
      res.json(data);
    } catch (err) {
      handleError(err, res);
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const data = await clientService.create(req.body);
      res.status(201).json(data);
    } catch (err) {
      handleError(err, res);
    }
  },
};
