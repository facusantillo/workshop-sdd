## Why

El proyecto Expense Tracker no tiene todavía base técnica: no hay esqueleto de backend, frontend, persistencia ni CI. Sin esa base, ninguna de las features del MVP (#3–#10) puede arrancar sin fricción de setup ni decisiones de infraestructura repetidas. Este cambio resuelve el PBI-01 (#2), que **bloquea a todos los demás PBIs de la épica** (#1).

## What Changes

- Se inicializa un **monorepo con npm workspaces** (`/backend`, `/frontend`) con TypeScript estricto y ESM en ambos paquetes.
- Se crea el **modelo de dominio `Expense`** con su schema de Prisma, migración inicial y enums (`Category`, `ExpenseStatus`, `Currency`), persistido en PostgreSQL 16.
- Se añade un **seed reproducible** (`npm run seed`) que cumple un contrato de distribución (≥15 gastos, todas las categorías, todos los estados) para que los PBIs siguientes tengan datos de prueba representativos.
- Se expone un **endpoint de salud** `GET /api/v1/health` con un contrato de respuesta cerrado que reporta estado de la app y conectividad con la base de datos.
- Se monta el **shell del frontend** (React 18 + Vite): página de bienvenida con nombre y versión, routing inicial (`/`, `/expenses` placeholder) y cliente HTTP configurado.
- Se monta el **tooling de entorno y CI**: `docker-compose` con PostgreSQL, `.env.example`, scripts npm consistentes (`dev`, `build`, `lint`, `test`, `migrate`, `seed`), README de arranque y workflow de GitHub Actions que ejecuta lint + build + test en cada PR.
- Se establece el **manejo centralizado de errores** (middleware de Express) como patrón transversal.

## Capabilities

### New Capabilities
- `expense-persistence`: Modelo de dominio `Expense`, schema de Prisma con enums, migración inicial, cliente singleton y seed con contrato de distribución verificable.
- `health-check`: Endpoint `GET /api/v1/health` con contrato de respuesta cerrado (200 sano / 503 con DB caída) que reporta versión, uptime y conectividad con la base de datos.
- `web-app-shell`: Aplicación React con routing inicial, página de bienvenida que muestra nombre y versión, y cliente HTTP configurado contra el backend.
- `dev-tooling`: Entorno local reproducible (docker-compose + PostgreSQL), variables de entorno documentadas, scripts npm de workspace y pipeline de CI que falla si lint, build o test fallan.

### Modified Capabilities
<!-- Ninguna: no existen specs previas; este es el bootstrap inicial. -->

## Impact

- **Código nuevo**: estructura completa de `/backend` (capas `domain`, `application`, `infrastructure`, `api`) y `/frontend` (Vite + React Router).
- **Persistencia**: nuevo schema Prisma + migración inicial; base de datos PostgreSQL 16 vía docker-compose con volumen persistente.
- **APIs**: nuevo endpoint `GET /api/v1/health` bajo el prefijo `/api/v1`.
- **Dependencias nuevas**: Express, Prisma, TypeScript, Vite, React, React Router, Vitest, React Testing Library; ESLint para lint.
- **Infraestructura**: `docker-compose.yml`, workflow de GitHub Actions, `.env.example`, scripts npm a nivel raíz.
- **Desbloquea**: #3, #4, #5, #6, #7, #8, #9, #10 — todas las features del MVP construyen sobre esta base.

## Non-goals

- Autenticación o gestión de usuarios — el autor se simula con una constante fija (`MOCK_AUTHOR`) en la capa de aplicación.
- Endpoints funcionales de negocio (crear, filtrar, aprobar, rechazar, editar, totales, desglose, export) — los aporta cada PBI posterior.
- Validación de payloads con Zod — se introduce en #3, donde existe el primer payload de entrada real. El bootstrap solo monta el patrón de error middleware.
- Dockerización del backend y frontend — en esta fase solo la base de datos corre en contenedor.
- Tests de integración exhaustivos o umbral de coverage — solo el mínimo del health y el render de bienvenida.
- Configuración de entornos distintos al local.
