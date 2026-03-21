import { clientRepository } from '../repositories/clientRepository.js';

export const clientService = {
  getAll: () => clientRepository.findAll(),

  getById: (id: number) => clientRepository.findById(id),

  create: (data: { nombre: string; telefono: string; email: string }) => {
    if (!data.nombre?.trim()) throw new Error('El nombre es requerido');
    if (!data.telefono?.trim()) throw new Error('El teléfono es requerido');
    if (!data.email?.trim()) throw new Error('El email es requerido');
    return clientRepository.create(data);
  },
};
