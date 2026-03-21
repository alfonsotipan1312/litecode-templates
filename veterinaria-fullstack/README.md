# Veterinaria - Aplicación Fullstack

Sistema de gestión para veterinaria con React, TypeScript, Tailwind CSS, Node.js, Express, Prisma y PostgreSQL.

## Requisitos

- Node.js 18+
- Docker y Docker Compose (para PostgreSQL)

## Inicio rápido

### 1. Levantar PostgreSQL con Docker

```bash
docker-compose up -d
```

### 2. Configurar variables de entorno

```bash
cp backend/.env.example backend/.env
```

Verifica que `backend/.env` tenga:

```
DATABASE_URL="postgresql://veterinaria:veterinaria123@localhost:5432/veterinaria_db"
PORT=3001
```

### 3. Instalar dependencias y preparar base de datos

```bash
npm install
npm run db:push
```

### 4. Ejecutar la aplicación

```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001

## Estructura del proyecto

```
veterinaria-fullstack/
├── frontend/          # React + Vite + TypeScript + Tailwind
│   └── src/
│       ├── features/    # Módulos por feature (dashboard, pets, clients, consultations)
│       └── shared/      # Componentes compartidos
├── backend/           # Node.js + Express + TypeScript + Prisma
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       └── prisma/
├── docker-compose.yml
└── .env.example
```

## API REST

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /clients | Listar clientes |
| POST | /clients | Crear cliente |
| GET | /clients/:id | Obtener cliente |
| GET | /pets | Listar mascotas |
| POST | /pets | Crear mascota |
| GET | /pets/:id | Obtener mascota |
| GET | /consultations | Listar consultas |
| POST | /consultations | Registrar consulta |

## Comandos útiles

```bash
npm run dev           # Ejecutar frontend y backend
npm run dev:frontend  # Solo frontend
npm run dev:backend   # Solo backend
npm run db:push       # Sincronizar esquema Prisma con la BD
npm run db:studio      # Abrir Prisma Studio (UI para la BD)
npm run db:seed       # Ejecutar seed (si existe)
```

## Datos de ejemplo

Tras `db:push`, crea un cliente en "Clientes" → "Nuevo cliente", luego registra una mascota en "Mascotas" → "Nueva mascota" asignando el dueño. Por último, registra una consulta en "Historial Médico".
