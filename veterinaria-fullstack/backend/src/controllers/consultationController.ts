import { Request, Response } from 'express';
import { consultationService } from '../services/consultationService.js';

export const consultationController = {
  getAll: async (_req: Request, res: Response) => {
    const consultations = await consultationService.getAll();
    res.json(consultations);
  },

  create: async (req: Request, res: Response) => {
    const { descripcion, fecha, mascotaId } = req.body;
    const consultation = await consultationService.create({
      descripcion,
      fecha,
      mascotaId: parseInt(String(mascotaId), 10),
    });
    res.status(201).json(consultation);
  },
};
