# Spec: dev-tooling

## Purpose

Defines the local development environment, CI pipeline, environment configuration, and onboarding documentation required to run the project reproducibly.

## Requirements

### Requirement: Entorno local reproducible

El sistema SHALL proveer un `docker-compose.yml` que levante PostgreSQL 16 con credenciales de desarrollo y volumen persistente, de modo que un desarrollador pueda arrancar el entorno desde cero.

#### Scenario: Arranque desde cero

- **WHEN** un desarrollador con el repo recién clonado ejecuta `docker-compose up`, `npm install`, `npm run migrate` y `npm run seed`
- **THEN** la base de datos arranca y queda migrada con el seed cargado
- **AND** el backend y el frontend pueden arrancar contra esa base

#### Scenario: Persistencia entre reinicios

- **WHEN** se detiene y se vuelve a levantar el contenedor de PostgreSQL
- **THEN** los datos previamente persistidos siguen disponibles gracias al volumen

### Requirement: Configuración por variables de entorno

El sistema SHALL documentar todas las variables de entorno necesarias en archivos `.env.example` para backend y frontend, sin incluir secretos reales.

#### Scenario: Plantilla de entorno completa

- **WHEN** un desarrollador copia `.env.example` a `.env`
- **THEN** dispone de todas las variables requeridas para arrancar (URL de base de datos, `VITE_API_URL`, etc.)
- **AND** ningún valor real sensible está versionado en el repositorio

### Requirement: Scripts npm consistentes

El sistema SHALL exponer scripts npm de workspace coherentes: `dev`, `build`, `lint`, `test`, `migrate` y `seed`, ejecutables de forma uniforme en el monorepo.

#### Scenario: Scripts disponibles

- **WHEN** se inspeccionan los scripts del workspace
- **THEN** existen `dev`, `build`, `lint`, `test`, `migrate` y `seed`
- **AND** cada uno ejecuta su función en el paquete correspondiente

### Requirement: Pipeline de integración continua

El sistema SHALL ejecutar un workflow de GitHub Actions en cada pull request contra la rama principal que instale dependencias, ejecute lint, compile TypeScript y corra los tests de backend y frontend. El pipeline SHALL fallar si cualquiera de los pasos (lint, build o test) falla.

#### Scenario: PR con código válido

- **WHEN** se abre un PR cuyo código pasa lint, compila y aprueba los tests
- **THEN** el pipeline de CI termina en verde

#### Scenario: PR con fallo de lint

- **WHEN** se abre un PR cuyo código falla el lint
- **THEN** el pipeline de CI falla
- **AND** el PR queda marcado como no apto para merge

#### Scenario: PR con test fallido

- **WHEN** se abre un PR con un test que falla
- **THEN** el pipeline de CI falla en el paso de test
- **AND** reporta qué job (backend o frontend) falló

### Requirement: Documentación de arranque

El sistema SHALL incluir un README con instrucciones paso a paso para levantar el entorno local, incluyendo `npm run seed` como paso explícito.

#### Scenario: Instrucciones suficientes

- **WHEN** un desarrollador nuevo sigue el README de principio a fin
- **THEN** logra arrancar backend, frontend y base de datos sin información externa adicional
- **AND** el paso de seed aparece documentado explícitamente
