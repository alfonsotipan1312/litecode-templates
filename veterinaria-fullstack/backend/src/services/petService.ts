import { petRepository } from '../repositories/petRepository.js';

export const petService = {
  getAll: () => petRepository.findAll(),

  getById: (id: number) => petRepository.findById(id),

  create: (data: { nombre: string; tipo: string; edad: number; clienteId: number }) => {
    if (!data.nombre?.trim()) throw new Error('El nombre es requerido');
    if (!data.tipo?.trim()) throw new Error('El tipo es requerido');
    if (typeof data.edad !== 'number' || data.edad < 0)
      throw new Error('La edad debe ser un número positivo');
    if (!data.clienteId) throw new Error('El dueño (cliente) es requerido');
    return petRepository.create(data);
  },
};
