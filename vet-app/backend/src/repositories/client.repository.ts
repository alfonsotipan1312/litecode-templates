import { prisma } from '../prisma.js';
import type { Prisma } from '@prisma/client';

export const clientRepository = {
  findAll: async () => {
    return prisma.cliente.findMany({
      orderBy: { id: 'asc' },
      include: { mascotas: true },
    });
  },

  findById: async (id: number) => {
    return prisma.cliente.findUnique({
      where: { id },
      include: { mascotas: true },
    });
  },

  create: async (data: Prisma.ClienteCreateInput) => {
    return prisma.cliente.create({ data });
  },
};
