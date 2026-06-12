# Spec: expense-persistence

## Purpose

Defines the domain model, database schema, migrations, client instantiation, and seed data strategy for persisting expense records via Prisma and PostgreSQL.

## Requirements

### Requirement: Modelo de dominio Expense

El sistema SHALL definir una entidad `Expense` persistida en PostgreSQL mediante Prisma, con los campos: `id`, `date`, `amount` (entero, en céntimos), `currency` (enum), `category` (enum), `description`, `author` (string), `status` (enum) y `createdAt`. Los montos SHALL almacenarse como enteros en céntimos para evitar errores de redondeo en cálculos posteriores.

#### Scenario: Schema con tipos correctos

- **WHEN** se inspecciona el schema de Prisma de la entidad `Expense`
- **THEN** `amount` es de tipo entero (no decimal ni float)
- **AND** `currency`, `category` y `status` son enums de Prisma
- **AND** `id` y `createdAt` tienen valores generados por defecto

#### Scenario: Persistencia de un gasto

- **WHEN** se crea un registro `Expense` con todos los campos requeridos
- **THEN** el registro se persiste y puede recuperarse con los mismos valores
- **AND** `id` y `createdAt` quedan poblados automáticamente

#### Scenario: Rechazo de estado inválido

- **WHEN** se intenta persistir un `Expense` con un `status` fuera del enum (`Pending`, `Approved`, `Rejected`)
- **THEN** la operación falla con un error de validación de tipo
- **AND** no se crea ningún registro

### Requirement: Enums de dominio

El sistema SHALL modelar como enums de Prisma los conjuntos cerrados de valores: `Category` (`TRAVEL`, `FOOD`, `SOFTWARE`, `OFFICE`, `OTHER`), `ExpenseStatus` (`PENDING`, `APPROVED`, `REJECTED`) y `Currency` (`EUR`, `USD`, con `EUR` por defecto).

#### Scenario: Valores de categoría disponibles

- **WHEN** se consultan los valores válidos del enum `Category`
- **THEN** incluye exactamente `TRAVEL`, `FOOD`, `SOFTWARE`, `OFFICE` y `OTHER`

#### Scenario: Moneda por defecto

- **WHEN** se crea un `Expense` sin especificar `currency`
- **THEN** el valor persistido es `EUR`

### Requirement: Migración inicial

El sistema SHALL incluir una migración inicial de Prisma versionada en `prisma/migrations/` que cree la tabla de gastos y los enums asociados.

#### Scenario: Migración sobre base limpia

- **WHEN** se ejecuta `npm run migrate` contra una base de datos vacía
- **THEN** se crea la tabla de gastos con todas las columnas y enums
- **AND** el comando termina con código de salida 0

#### Scenario: Migración idempotente

- **WHEN** se ejecuta `npm run migrate` sobre una base ya migrada
- **THEN** no se aplican cambios adicionales
- **AND** el comando termina sin error

### Requirement: Cliente Prisma singleton

El sistema SHALL instanciar el cliente de Prisma como singleton en `src/infrastructure/prisma.ts`, reutilizado por toda la aplicación.

#### Scenario: Reutilización de instancia

- **WHEN** dos módulos distintos importan el cliente Prisma
- **THEN** ambos reciben la misma instancia
- **AND** no se abren conexiones duplicadas a la base de datos

### Requirement: Seed con contrato de distribución

El sistema SHALL proveer un seed ejecutable vía `npm run seed` que cargue al menos 15 gastos cumpliendo: cada `Category` aparece al menos una vez, cada `ExpenseStatus` aparece al menos 3 veces, al menos 5 gastos en estado `APPROVED`, montos variados, y fechas en el mes corriente y el anterior.

#### Scenario: Distribución mínima garantizada

- **WHEN** se ejecuta `npm run seed` sobre una base recién migrada
- **THEN** la tabla de gastos contiene al menos 15 registros
- **AND** cada valor de `Category` está representado al menos una vez
- **AND** cada valor de `ExpenseStatus` aparece al menos 3 veces
- **AND** hay al menos 5 gastos con estado `APPROVED`

#### Scenario: Seed reproducible

- **WHEN** se ejecuta el seed dos veces sobre la misma base
- **THEN** el resultado es consistente y sin registros duplicados accidentales
- **AND** el comando no deja la base en estado inválido
