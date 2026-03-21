import { prisma } from '../prisma/index.js';

export interface CreateClienteInput {
  nombre: string;
  telefono: string;
  email: string;
}

export const clientRepository = {
  findAll: async () => {
    return prisma.cliente.findMany({ orderBy: { nombre: 'asc' } });
  },

  findById: async (id: number) => {
    return prisma.cliente.findUnique({
      where: { id },
      include: { mascotas: true },
    });
  },

  create: async (data: CreateClienteInput) => {
    return prisma.cliente.create({ data });
  },
};
