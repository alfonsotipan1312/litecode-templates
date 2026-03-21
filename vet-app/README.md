# Veterinaria App

Aplicación web fullstack para gestión de una veterinaria.

## Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS (arquitectura por features)
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Base de datos**: PostgreSQL (Docker)

## Requisitos

- Node.js 18+
- Docker y Docker Compose
- npm o pnpm

## Cómo ejecutar

### 1. Levantar PostgreSQL con Docker

```bash
docker-compose up -d
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

### 3. Instalar dependencias y preparar base de datos

```bash
npm install
cd backend
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
cd ..
```

### 4. Ejecutar la aplicación

```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## Estructura

```
vet-app/
├── frontend/           # React + Vite + Tailwind
│   └── src/
│       ├── api/        # Cliente API
│       └── features/   # Módulos por feature
│           ├── dashboard/
│           ├── pets/
│           ├── clients/
│           └── consultations/
├── backend/            # Express + Prisma
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       └── prisma.ts
├── docker-compose.yml
└── .env.example
```

## Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /clients | Listar clientes |
| POST | /clients | Crear cliente |
| GET | /pets | Listar mascotas |
| GET | /pets/:id | Detalle de mascota |
| POST | /pets | Crear mascota |
| GET | /consultations | Listar consultas |
| POST | /consultations | Registrar consulta |
