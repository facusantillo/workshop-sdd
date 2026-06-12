## 1. Monorepo y tooling base

- [x] 1.1 Inicializar `package.json` raíz con `npm workspaces` apuntando a `backend` y `frontend`
- [x] 1.2 Configurar `"type": "module"` (ESM) y versión `0.1.0` en el `package.json` raíz como fuente única de verdad
- [x] 1.3 Añadir scripts de workspace en la raíz: `dev`, `build`, `lint`, `test`, `migrate`, `seed`
- [x] 1.4 Configurar ESLint + Prettier + `tsconfig` base compartido en modo estricto
- [x] 1.5 Crear `.gitignore`, `.env.example` (backend y frontend) y commitear `package-lock.json`
- [x] 1.6 Verificar: `npm install` desde la raíz instala ambos workspaces sin error

## 2. Infraestructura local

- [x] 2.1 Crear `docker-compose.yml` con PostgreSQL 16, credenciales de desarrollo y volumen persistente
- [x] 2.2 Documentar las variables de entorno requeridas en `.env.example` (DATABASE_URL, VITE_API_URL, etc.)
- [x] 2.3 Verificar: `docker-compose up` levanta PostgreSQL y persiste datos entre reinicios

## 3. Backend — estructura y persistencia

- [x] 3.1 Scaffold del backend con Express 4 + TypeScript estricto y estructura por capas (`domain`, `application`, `infrastructure`, `api`)
- [x] 3.2 Definir enums Prisma `Category`, `ExpenseStatus`, `Currency` (default `EUR`)
- [x] 3.3 Definir el modelo `Expense` en el schema de Prisma (`amount` como `Int` en céntimos)
- [x] 3.4 Generar la migración inicial en `prisma/migrations/`
- [x] 3.5 Implementar el cliente Prisma como singleton en `src/infrastructure/prisma.ts`
- [x] 3.6 Definir la entidad de dominio `Expense` y la constante `MOCK_AUTHOR` en la capa de aplicación
- [x] 3.7 Verificar: `DD` crea la tabla y enums sobre base limpia y es idempotente

## 4. Backend — health, errores y arranque

- [x] 4.1 Implementar middleware centralizado de errores con shape `{ error, details? }`
- [x] 4.2 Implementar `GET /api/v1/health` con el contrato cerrado (status, version, uptime, checks.database)
- [x] 4.3 Hacer que el health haga ping a la DB (`SELECT 1`), mida `latencyMs` y devuelva `503` si falla
- [x] 4.4 Leer `version` desde el `package.json` raíz en el health
- [x] 4.5 Cablear el bootstrap de Express (server, rutas, middleware) y el script `dev`
- [x] 4.6 Verificar: backend arranca y `GET /api/v1/health` responde `200` con DB activa y `503` con DB caída

## 5. Backend — seed

- [x] 5.1 Implementar `prisma/seed.ts` ejecutable vía `npm run seed`
- [x] 5.2 Garantizar el contrato de distribución: ≥15 gastos, todas las categorías, ≥3 por estado, ≥5 aprobados, montos variados, fechas del mes corriente y anterior
- [x] 5.3 Verificar: tras `npm run seed`, una consulta confirma las invariantes de distribución

## 6. Frontend — shell

- [x] 6.1 Scaffold del frontend con Vite 5 + React 18 + TypeScript estricto
- [x] 6.2 Inyectar `VITE_APP_VERSION` en `vite.config` desde el `package.json` raíz
- [x] 6.3 Configurar React Router con rutas `/` (bienvenida) y `/expenses` (placeholder) + fallback de ruta desconocida
- [x] 6.4 Implementar la página de bienvenida mostrando nombre del producto y versión (con degradado si la versión falta)
- [x] 6.5 Implementar el cliente HTTP en `src/lib/api.ts` con base `VITE_API_URL` y default local documentado
- [x] 6.6 Verificar: `npm run dev` levanta el frontend, `/` muestra nombre+versión y `/expenses` renderiza placeholder

## 7. Tests mínimos

- [x] 7.1 Configurar Vitest en backend y frontend
- [x] 7.2 Backend: test de integración de `GET /api/v1/health` → `200` + shape con `checks.database.status: "up"`
- [x] 7.3 Backend: test del seed que valida las invariantes del contrato de distribución
- [x] 7.4 Frontend: test de render de la bienvenida (monta y muestra nombre + versión) con React Testing Library
- [x] 7.5 Verificar: `npm run test` pasa en ambos workspaces

## 8. CI

- [x] 8.1 Crear workflow de GitHub Actions disparado en PR contra la rama principal
- [x] 8.2 Job de backend: install + lint + build + test, con service container `postgres:16`
- [x] 8.3 Job de frontend: install + lint + build + test
- [x] 8.4 Asegurar que el pipeline falla si cualquier paso (lint, build o test) falla
- [ ] 8.5 Verificar: un PR con código válido pasa en verde; uno con lint o test roto falla

## 9. Documentación y cierre

- [x] 9.1 Escribir el README con instrucciones de arranque paso a paso, incluyendo `npm run seed` explícito
- [ ] 9.2 Verificar end-to-end: clonar limpio → `docker-compose up` → `npm install` → `npm run migrate` → `npm run seed` → backend, frontend y DB operativos
- [ ] 9.3 Ejecutar lint + type-check + tests completos del monorepo antes de abrir el PR
