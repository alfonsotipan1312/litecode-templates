import { prisma } from '../prisma/index.js';

export interface CreateConsultationInput {
  descripcion: string;
  fecha: Date;
  mascotaId: number;
}

export const consultationRepository = {
  findAll: async () => {
    return prisma.consulta.findMany({
      include: { mascota: { include: { cliente: true } } },
      orderBy: { fecha: 'desc' },
    });
  },

  create: async (data: CreateConsultationInput) => {
    return prisma.consulta.create({
      data,
      include: { mascota: { include: { cliente: true } } },
    });
  },
};
