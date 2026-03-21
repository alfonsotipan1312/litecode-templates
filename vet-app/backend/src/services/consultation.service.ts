import { consultationRepository } from '../repositories/consultation.repository.js';
import { prisma } from '../prisma.js';
import { AppError } from '../errors.js';

function validateDescripcion(descripcion: unknown): string {
  if (typeof descripcion !== 'string' || descripcion.trim().length === 0) {
    throw new AppError(400, 'La descripción es requerida');
  }
  return descripcion.trim();
}

function validateMascotaId(mascotaId: unknown): number {
  const n = Number(mascotaId);
  if (!Number.isInteger(n) || n < 1) {
    throw new AppError(400, 'Debe seleccionar una mascota válida');
  }
  return n;
}

function parseDate(fecha: unknown): Date | undefined {
  if (fecha === undefined || fecha === null) return undefined;
  if (fecha instanceof Date && !isNaN(fecha.getTime())) return fecha;
  if (typeof fecha === 'string') {
    const d = new Date(fecha);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}

export const consultationService = {
  getAll: async () => {
    return consultationRepository.findAll();
  },

  create: async (body: {
    descripcion?: unknown;
    fecha?: unknown;
    mascotaId?: unknown;
  }) => {
    const descripcion = validateDescripcion(body.descripcion);
    const mascotaId = validateMascotaId(body.mascotaId);
    const fecha = parseDate(body.fecha) ?? new Date();

    const mascota = await prisma.mascota.findUnique({ where: { id: mascotaId } });
    if (!mascota) throw new AppError(404, 'Mascota no encontrada');

    return consultationRepository.create({
      descripcion,
      fecha,
      mascota: { connect: { id: mascotaId } },
    });
  },
};
