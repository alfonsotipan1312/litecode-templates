import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const cliente1 = await prisma.cliente.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nombre: 'Juan Pérez',
      telefono: '555-0101',
      email: 'juan@email.com',
    },
  });

  await prisma.mascota.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nombre: 'Max',
      tipo: 'perro',
      edad: 3,
      clienteId: cliente1.id,
    },
  });

  const mascota = await prisma.mascota.findFirst();
  if (mascota) {
    await prisma.consulta.upsert({
      where: { id: 1 },
      update: {},
      create: {
        descripcion: 'Revisión general, vacunas al día',
        mascotaId: mascota.id,
      },
    });
  }

  console.log('Seed completado');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
