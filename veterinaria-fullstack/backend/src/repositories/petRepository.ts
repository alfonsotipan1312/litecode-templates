import { prisma } from '../prisma/index.js';

export interface CreatePetInput {
  nombre: string;
  tipo: string;
  edad: number;
  clienteId: number;
}

export const petRepository = {
  findAll: async () => {
    return prisma.mascota.findMany({
      include: { cliente: true },
      orderBy: { nombre: 'asc' },
    });
  },

  findById: async (id: number) => {
    return prisma.mascota.findUnique({
      where: { id },
      include: { cliente: true, consultas: true },
    });
  },

  create: async (data: CreatePetInput) => {
    return prisma.mascota.create({
      data,
      include: { cliente: true },
    });
  },
};
