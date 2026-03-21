import { petRepository } from '../repositories/pet.repository.js';
import { AppError } from '../errors.js';

const TIPOS_VALIDOS = ['perro', 'gato', 'ave', 'roedor', 'reptil', 'otro'];

function validateNombre(nombre: unknown): string {
  if (typeof nombre !== 'string' || nombre.trim().length === 0) {
    throw new AppError(400, 'El nombre de la mascota es requerido');
  }
  return nombre.trim();
}

function validateTipo(tipo: unknown): string {
  if (typeof tipo !== 'string' || tipo.trim().length === 0) {
    throw new AppError(400, 'El tipo es requerido (perro, gato, etc.)');
  }
  const t = tipo.trim().toLowerCase();
  if (!TIPOS_VALIDOS.includes(t)) {
    throw new AppError(400, `Tipo inválido. Opciones: ${TIPOS_VALIDOS.join(', ')}`);
  }
  return t;
}

function validateEdad(edad: unknown): number {
  const n = Number(edad);
  if (!Number.isInteger(n) || n < 0 || n > 50) {
    throw new AppError(400, 'La edad debe ser un número entero entre 0 y 50');
  }
  return n;
}

function validateClienteId(clienteId: unknown): number {
  const n = Number(clienteId);
  if (!Number.isInteger(n) || n < 1) {
    throw new AppError(400, 'Debe seleccionar un cliente válido');
  }
  return n;
}

export const petService = {
  getAll: async () => {
    return petRepository.findAll();
  },

  getById: async (id: number) => {
    const mascota = await petRepository.findById(id);
    if (!mascota) throw new AppError(404, 'Mascota no encontrada');
    return mascota;
  },

  create: async (body: {
    nombre?: unknown;
    tipo?: unknown;
    edad?: unknown;
    clienteId?: unknown;
  }) => {
    const nombre = validateNombre(body.nombre);
    const tipo = validateTipo(body.tipo);
    const edad = validateEdad(body.edad);
    const clienteId = validateClienteId(body.clienteId);

    return petRepository.create({
      nombre,
      tipo,
      edad,
      cliente: { connect: { id: clienteId } },
    });
  },
};
