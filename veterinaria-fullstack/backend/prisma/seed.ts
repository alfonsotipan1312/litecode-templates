import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const cliente = await prisma.cliente.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nombre: 'Juan Pérez',
      telefono: '555-0100',
      email: 'juan@ejemplo.com',
    },
  });

  await prisma.mascota.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nombre: 'Max',
      tipo: 'perro',
      edad: 3,
      clienteId: cliente.id,
    },
  });

  console.log('Seed completado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
