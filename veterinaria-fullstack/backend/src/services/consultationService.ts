import { consultationRepository } from '../repositories/consultationRepository.js';

export const consultationService = {
  getAll: () => consultationRepository.findAll(),

  create: (data: { descripcion: string; fecha: string; mascotaId: number }) => {
    if (!data.descripcion?.trim()) throw new Error('La descripción es requerida');
    if (!data.fecha) throw new Error('La fecha es requerida');
    if (!data.mascotaId) throw new Error('La mascota es requerida');

    const fecha = new Date(data.fecha);
    if (isNaN(fecha.getTime())) throw new Error('Fecha inválida');

    return consultationRepository.create({
      descripcion: data.descripcion,
      fecha,
      mascotaId: data.mascotaId,
    });
  },
};
