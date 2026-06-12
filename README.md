# Expense Tracker

Aplicación web para que equipos pequeños registren, aprueben y reporten gastos mensuales.

## Requisitos previos

- Node.js 22+
- Docker + Docker Compose

## Arranque del entorno local

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd workshop-sdd
```

### 2. Copiar variables de entorno

```bash
cp .env.example .env
```

El archivo `.env.example` incluye los valores por defecto para desarrollo local. Si no cambias el `docker-compose.yml`, no necesitas modificar nada.

### 3. Levantar la base de datos

```bash
docker-compose up -d
```

Esto inicia PostgreSQL 16 en `localhost:5432`. Los datos se persisten en el volumen `postgres_data`.

### 4. Instalar dependencias

```bash
npm install
```

Instala las dependencias de ambos workspaces (`backend` y `frontend`) desde la raíz.

### 5. Ejecutar la migración inicial

```bash
npm run migrate
```

Crea las tablas y enums en la base de datos.

### 6. Cargar datos de ejemplo

```bash
npm run seed
```

Carga al menos 15 gastos de ejemplo con diferentes categorías, estados y montos.

### 7. Iniciar los servidores

```bash
npm run dev
```

- **Backend:** http://localhost:3001
- **Frontend:** http://localhost:5173

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia backend y frontend en modo desarrollo |
| `npm run build` | Compila TypeScript y genera el bundle de producción |
| `npm run lint` | Ejecuta ESLint en ambos workspaces |
| `npm run test` | Ejecuta los tests de ambos workspaces |
| `npm run migrate` | Ejecuta las migraciones de Prisma |
| `npm run seed` | Carga los datos de ejemplo |

## API

### Health check

```
GET /api/v1/health
```

Respuesta `200 OK` (DB activa):
```json
{
  "status": "ok",
  "version": "0.1.0",
  "uptime": 123.45,
  "checks": {
    "database": {
      "status": "up",
      "latencyMs": 12
    }
  }
}
```

Respuesta `503 Service Unavailable` (DB caída): mismo shape con `status: "degraded"` y `database.status: "down"`.

## Estructura del proyecto

```
workshop-sdd/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma     # Modelo de datos
│   │   └── seed.ts           # Datos de ejemplo
│   └── src/
│       ├── domain/           # Entidades y tipos
│       ├── application/      # Casos de uso y servicios
│       ├── infrastructure/   # Prisma singleton
│       └── api/              # Controladores Express y middleware
├── frontend/
│   └── src/
│       ├── lib/api.ts        # Cliente HTTP
│       └── pages/            # Componentes de página
├── docker-compose.yml
└── .env.example
```

## Modelo de datos

Los montos se almacenan como **enteros en céntimos** (p. ej. `1999` = 19,99 €) para evitar errores de redondeo.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `amount` | `Int` | Monto en céntimos |
| `currency` | `EUR` \| `USD` | Moneda (default: EUR) |
| `category` | `TRAVEL` \| `FOOD` \| `SOFTWARE` \| `OFFICE` \| `OTHER` | Categoría |
| `status` | `PENDING` \| `APPROVED` \| `REJECTED` | Estado del gasto |
| `author` | `string` | Autor (email) |

## CI

El workflow de GitHub Actions se ejecuta en cada PR contra `main` y:
1. Levanta un contenedor de PostgreSQL 16
2. Ejecuta lint + build + test en backend y frontend
3. Falla si cualquier paso falla