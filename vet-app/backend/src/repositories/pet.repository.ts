import { prisma } from '../prisma.js';
import type { Prisma } from '@prisma/client';

export const petRepository = {
  findAll: async () => {
    return prisma.mascota.findMany({
      orderBy: { id: 'asc' },
      include: { cliente: true, consultas: true },
    });
  },

  findById: async (id: number) => {
    return prisma.mascota.findUnique({
      where: { id },
      include: { cliente: true, consultas: { orderBy: { fecha: 'desc' } } },
    });
  },

  create: async (data: Prisma.MascotaCreateInput) => {
    return prisma.mascota.create({
      data,
      include: { cliente: true },
    });
  },
};
