import type { Request, Response } from 'express';
import { consultationService } from '../services/consultation.service.js';
import { handleError } from '../errors.js';

export const consultationController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const data = await consultationService.getAll();
      res.json(data);
    } catch (err) {
      handleError(err, res);
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const data = await consultationService.create(req.body);
      res.status(201).json(data);
    } catch (err) {
      handleError(err, res);
    }
  },
};
