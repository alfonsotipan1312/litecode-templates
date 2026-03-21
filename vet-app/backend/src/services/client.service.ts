import { clientRepository } from '../repositories/client.repository.js';
import { AppError } from '../errors.js';

function validateNombre(nombre: unknown): string {
  if (typeof nombre !== 'string' || nombre.trim().length === 0) {
    throw new AppError(400, 'El nombre es requerido');
  }
  return nombre.trim();
}

function validateOptionalString(value: unknown, maxLen = 200): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') return undefined;
  const s = value.trim();
  return s.length > maxLen ? s.slice(0, maxLen) : s || undefined;
}

export const clientService = {
  getAll: async () => {
    return clientRepository.findAll();
  },

  getById: async (id: number) => {
    const cliente = await clientRepository.findById(id);
    if (!cliente) throw new AppError(404, 'Cliente no encontrado');
    return cliente;
  },

  create: async (body: { nombre?: unknown; telefono?: unknown; email?: unknown }) => {
    const nombre = validateNombre(body.nombre);
    const telefono = validateOptionalString(body.telefono);
    const email = validateOptionalString(body.email, 255);

    return clientRepository.create({
      nombre,
      telefono: telefono ?? null,
      email: email ?? null,
    });
  },
};
