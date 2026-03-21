import { prisma } from '../prisma.js';
import type { Prisma } from '@prisma/client';

export const consultationRepository = {
  findAll: async () => {
    return prisma.consulta.findMany({
      orderBy: { fecha: 'desc' },
      include: { mascota: { include: { cliente: true } } },
    });
  },

  create: async (data: Prisma.ConsultaCreateInput) => {
    return prisma.consulta.create({
      data,
      include: { mascota: { include: { cliente: true } } },
    });
  },
};
