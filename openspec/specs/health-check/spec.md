# Spec: health-check

## Purpose

Defines the health-check HTTP endpoint that reports application status and database connectivity, with a stable response contract.

## Requirements

### Requirement: Endpoint de salud

El sistema SHALL exponer `GET /api/v1/health` que reporte el estado de la aplicación y la conectividad con la base de datos. La respuesta SHALL seguir un contrato cerrado con los campos `status` (`"ok"` | `"degraded"`), `version`, `uptime` (segundos) y `checks.database` (`status`: `"up"` | `"down"`, `latencyMs`).

#### Scenario: Aplicación y base de datos sanas

- **WHEN** se consulta `GET /api/v1/health` con la base de datos accesible
- **THEN** la respuesta es `200 OK`
- **AND** el body tiene `status: "ok"` y `checks.database.status: "up"`
- **AND** el body incluye `version`, `uptime` y `checks.database.latencyMs`

#### Scenario: Base de datos no disponible

- **WHEN** se consulta `GET /api/v1/health` y el ping a la base de datos falla
- **THEN** la respuesta es `503 Service Unavailable`
- **AND** el body tiene `status: "degraded"` y `checks.database.status: "down"`

#### Scenario: Contrato de respuesta estable

- **WHEN** se consulta el endpoint de salud en cualquier estado
- **THEN** el body siempre contiene las claves `status`, `version`, `uptime` y `checks.database`
- **AND** no expone detalles internos de conexión (credenciales, host, puerto)

### Requirement: Versión reportada desde fuente única

El endpoint de salud SHALL reportar el campo `version` tomado del `package.json` raíz del proyecto, garantizando una fuente única de verdad compartida con el frontend.

#### Scenario: Versión coherente

- **WHEN** se consulta `GET /api/v1/health`
- **THEN** el valor de `version` coincide con la versión del `package.json` raíz
