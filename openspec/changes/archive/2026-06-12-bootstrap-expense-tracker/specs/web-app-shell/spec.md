## ADDED Requirements

### Requirement: Página de bienvenida

El frontend SHALL mostrar en la ruta raíz (`/`) una página de bienvenida con el nombre del producto y la versión de la aplicación, obtenida desde la variable de build `VITE_APP_VERSION`.

#### Scenario: Render de bienvenida

- **WHEN** un usuario accede a la ruta raíz `/`
- **THEN** se muestra el nombre del producto "Expense Tracker"
- **AND** se muestra la versión proveniente de `VITE_APP_VERSION`

#### Scenario: Versión ausente

- **WHEN** se monta la página de bienvenida sin `VITE_APP_VERSION` definida
- **THEN** la página renderiza sin romperse
- **AND** muestra un valor de versión por defecto o vacío en lugar de fallar

### Requirement: Routing inicial

El frontend SHALL configurar React Router con las rutas `/` (bienvenida) y `/expenses` (placeholder preparado para futuras features), sin contenido funcional de negocio.

#### Scenario: Navegación a placeholder de gastos

- **WHEN** un usuario navega a `/expenses`
- **THEN** se renderiza una página placeholder sin error
- **AND** la ruta está registrada en el router

#### Scenario: Ruta desconocida

- **WHEN** un usuario navega a una ruta no registrada
- **THEN** la aplicación no crashea
- **AND** muestra un estado de "no encontrado" o redirige a la raíz

### Requirement: Cliente HTTP configurado

El frontend SHALL exponer un cliente HTTP en `src/lib/api.ts` con la URL base del backend tomada de la variable de entorno `VITE_API_URL`.

#### Scenario: URL base inyectada

- **WHEN** se inicializa el cliente HTTP
- **THEN** su URL base coincide con el valor de `VITE_API_URL`

#### Scenario: Variable ausente en desarrollo

- **WHEN** `VITE_API_URL` no está definida
- **THEN** el cliente usa un valor por defecto local documentado
- **AND** la aplicación arranca igualmente
