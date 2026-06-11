# PRD — Expense Tracker

**Estado:** Draft
**Versión:** 1.0
**Autor:** Facundo Santillo Alarcón
**Última actualización:** Abril 2026

---

## 1. Visión del producto

Expense Tracker es una aplicación web para que equipos pequeños registren, aprueben y reporten gastos menores de forma ordenada. Sustituye el flujo habitual de tickets sueltos, hojas de cálculo compartidas y correos de aprobación por un único sistema donde cada gasto tiene estado, trazabilidad y reporte.

El producto está pensado para equipos de entre 5 y 30 personas que hoy gestionan sus gastos de forma informal y necesitan un mínimo de orden para cerrar el mes sin perder tiempo reconstruyendo información.

## 2. Contexto y motivación

Los equipos pequeños dentro de la organización gestionan gastos menores (dietas, desplazamientos, material de oficina, representación) de formas muy heterogéneas. El patrón habitual es:

- Cada persona anota sus gastos en un Excel personal o en papel
- A final de mes se consolidan manualmente en una hoja compartida
- La aprobación ocurre por correo o verbalmente
- La exportación a contabilidad se hace copiando y pegando entre hojas

Esto genera tres problemas concretos:

1. **Pérdida de trazabilidad:** no queda registro de quién aprobó qué ni cuándo
2. **Retrabajo al cierre:** consolidar un mes puede llevar varias horas que nadie tenía planificadas
3. **Dificultad para reportar:** preguntas como "¿cuánto hemos gastado este mes en dietas?" requieren rehacer el cálculo cada vez

Expense Tracker ataca estos tres puntos con un sistema mínimo pero suficiente: registro estructurado, flujo de aprobación con estados, y consultas agregadas disponibles en cualquier momento.

## 3. Objetivos y métricas

### Objetivos del MVP

- Permitir a un usuario registrar un gasto en menos de 30 segundos
- Permitir a un aprobador revisar y decidir sobre un gasto en menos de 15 segundos
- Generar un reporte mensual consolidado sin intervención manual
- Exportar los datos en un formato consumible por herramientas contables estándar

### Métricas de éxito

- Tiempo medio de registro de un gasto < 30s
- Tiempo medio desde creación hasta aprobación/rechazo < 48h
- 100% de los gastos del mes exportables en un solo clic
- Cero gastos "perdidos" sin estado definido al cierre de mes

## 4. Alcance del MVP

### Dentro de alcance

- Registro de gastos con datos básicos (fecha, importe, categoría, descripción, autor)
- Listado y filtrado por criterios simples
- Flujo de aprobación con estados (pendiente / aprobado / rechazado)
- Edición de gastos pendientes por parte del autor
- Consultas agregadas (totales, desglose por categoría)
- Exportación a CSV

### Fuera de alcance (MVP)

- Autenticación simple (sin SSO, sin gestión avanzada de roles)
- Integración directa con software contable externo
- Gestión de justificantes con OCR o reconocimiento automático
- Políticas de aprobación configurables por importe o departamento
- Soporte multimoneda
- Gestión avanzada de roles y permisos
- Notificaciones por email o push
- Dashboards analíticos avanzados
- Mobile nativo

## 5. Usuarios

### Perfiles

- **Colaborador:** registra sus propios gastos, consulta su histórico, edita los que aún están pendientes
- **Aprobador:** revisa gastos pendientes del equipo, los aprueba o rechaza
- **Administrador:** consulta reportes agregados, exporta datos al cierre de mes

Para el MVP los tres perfiles pueden coincidir en la misma persona. No se modelan permisos granulares.

## 6. Requisitos técnicos

### Stack

- **Backend:** .NET 8 Web API con arquitectura por capas (Domain / Application / Infrastructure / Api)
- **Frontend:** Angular (última LTS)
- **Persistencia:** PostgreSQL con Entity Framework Core
- **Entorno local:** docker-compose levantando la base de datos
- **CI:** pipeline que ejecuta build + tests en cada pull request

### Principios de diseño

- Arquitectura limpia pero mínima: sin MediatR, sin CQRS, sin event sourcing
- El dominio es simple y cabe en una sola entidad agregada (`Expense`)
- Persistencia con migraciones EF Core versionadas en el repo
- Seed de datos inicial para que el entorno local arranque con contenido

### Restricciones

- El entorno debe levantarse en una máquina nueva con un único comando (`docker-compose up` + migraciones)
- Ninguna feature del MVP requiere configuración externa (SMTP, colas, storage, etc.)
- Todas las APIs devuelven JSON; el frontend consume directamente la Web API sin BFF intermedio

---

# Épica — Expense Tracker Core MVP

**Objetivo:** Entregar la primera versión funcional de Expense Tracker que permita a un equipo registrar, aprobar y reportar sus gastos mensuales, sustituyendo los flujos manuales actuales.

**Resultado esperado:** Un sistema web funcional, con backend en .NET y frontend en Angular, capaz de gestionar el ciclo de vida completo de un gasto desde su creación hasta su exportación.

**Historias incluidas:** 8
**Dependencias externas:** Ninguna
**Dependencias internas:** PBI-01 bloquea al resto. PBI-02 a PBI-08 son independientes entre sí.

## Dependencias entre PBIs

```
PBI-01 (Bootstrap)
   │
   ├── PBI-02 (Crear gasto)
   ├── PBI-03 (Filtrar por categoría)
   ├── PBI-04 (Aprobar gasto)
   ├── PBI-05 (Rechazar con motivo)
   ├── PBI-06 (Editar gasto pendiente)
   ├── PBI-07 (Total de gastos aprobados)
   ├── PBI-08 (Desglose por categoría)
   └── PBI-09 (Exportar a CSV)
```

PBI-01 entrega el esqueleto técnico del proyecto. A partir de su merge, las otras 8 historias se pueden abordar en paralelo sin bloqueos cruzados.

---

## PBI-01 — Bootstrap del proyecto Expense Tracker

**Tipo:** Technical enabler
**Prioridad:** Crítica (bloquea al resto de la épica)
**Estimación:** 5 puntos

### Historia de usuario

> **Como** equipo de desarrollo
> **Quiero** disponer del esqueleto técnico del proyecto Expense Tracker con persistencia, entorno local reproducible y CI funcionando
> **Para** poder empezar a implementar las features del producto sin fricción de setup.

### Contexto

Este es el primer PBI de la épica. Entrega la base sobre la que el resto de historias van a construir. Debe ser **lo más mínimo posible** manteniendo todo lo necesario para que las siguientes features arranquen sin bloqueos: modelo de dominio base, migraciones, seed, endpoints de salud, frontend vacío pero navegable, docker-compose y CI.

### Criterios de aceptación

**DADO** un entorno de desarrollo limpio
**CUANDO** un desarrollador clona el repositorio y ejecuta `docker-compose up` seguido del comando de migraciones
**ENTONCES** el backend arranca en el puerto configurado, el frontend arranca en el suyo, y la base de datos queda creada con el seed inicial cargado

**DADO** el backend arrancado
**CUANDO** se consulta el endpoint `GET /health`
**ENTONCES** la respuesta es `200 OK` con un body que incluye el estado de la aplicación y la conectividad con la base de datos

**DADO** el frontend arrancado
**CUANDO** se accede a la ruta raíz
**ENTONCES** se muestra una página de bienvenida con el nombre del producto y la versión

**DADO** un pull request abierto contra la rama principal
**CUANDO** el CI se ejecuta
**ENTONCES** compila la solución completa y ejecuta todos los tests, fallando el pipeline si cualquiera de los dos pasos falla

**DADO** la base de datos recién migrada
**CUANDO** se consulta la tabla de gastos
**ENTONCES** contiene al menos 15 gastos de ejemplo distribuidos entre distintas categorías y estados, suficientes para que las consultas y reportes posteriores tengan contenido

### Alcance técnico

**Backend:**
- Solución .NET 8 con proyectos separados para Domain, Application, Infrastructure y Api
- Entidad `Expense` con los campos mínimos: Id, Date, Amount, Category, Description, Author, Status, CreatedAt
- Value objects para Money (importe + moneda) y Category
- Estados posibles del gasto: `Pending`, `Approved`, `Rejected`
- `DbContext` con configuración de la entidad y migraciones iniciales
- Endpoint `GET /health` que reporta estado de la app y de la base de datos
- Seed de datos ejecutable al arrancar si la tabla está vacía

**Frontend:**
- Aplicación Angular con routing inicial
- Página de bienvenida en la ruta raíz mostrando nombre y versión
- Servicio HTTP configurado con la URL base del backend
- Página placeholder para "Gastos" (sin contenido real, solo la ruta preparada)

**Infraestructura:**
- `docker-compose.yml` levantando PostgreSQL con credenciales de desarrollo y volumen persistente
- Variables de entorno documentadas en `.env.example`
- README con instrucciones de arranque

**CI:**
- Pipeline que se ejecuta en cada pull request contra la rama principal
- Job de build de la solución backend
- Job de ejecución de tests unitarios
- El pipeline falla si cualquiera de los dos pasos falla

### Fuera de alcance

- Autenticación o gestión de usuarios (se simulará con un autor fijo en los endpoints)
- Endpoints funcionales de negocio (los añade cada PBI posterior)
- Tests de integración completos (solo los mínimos del health)
- Dockerización del backend y frontend (solo la base de datos en esta fase)
- Configuración de entornos distintos a local

### Preguntas abiertas para refinamiento

- ¿Qué estructura exacta de carpetas seguimos en el backend?
- ¿La moneda se modela como value object con código ISO o se asume EUR implícito?
- ¿El seed se ejecuta automáticamente al arrancar o mediante un comando explícito?
- ¿La versión mostrada en el frontend viene del `package.json`, del backend, o hardcodeada?

---

## PBI-02 — Crear un gasto

**Tipo:** Feature
**Prioridad:** Alta
**Estimación:** 3 puntos
**Dependencias:** PBI-01

### Historia de usuario

> **Como** colaborador del equipo
> **Quiero** registrar un gasto que acabo de tener
> **Para** que quede guardado en el sistema y pueda ser revisado y aprobado más adelante.

### Contexto

Esta es la historia que habilita la entrada de datos al sistema. Sin ella, las demás features no tienen sobre qué operar. Debe cubrir tanto el endpoint de backend como el formulario de frontend que permita al usuario introducir los datos.

### Criterios de aceptación

**DADO** un usuario en la página de gastos
**CUANDO** rellena el formulario de nuevo gasto con fecha, importe, categoría y descripción y pulsa "Guardar"
**ENTONCES** el gasto queda persistido con estado `Pending`, se muestra en el listado y el formulario se limpia

**DADO** un usuario intenta crear un gasto
**CUANDO** el importe es cero o negativo, o la fecha es futura, o la categoría está vacía
**ENTONCES** el sistema rechaza la operación y muestra un mensaje de error claro indicando qué campo es incorrecto

**DADO** un gasto recién creado
**CUANDO** se consulta el endpoint de detalle del gasto
**ENTONCES** devuelve todos los campos del gasto incluyendo `CreatedAt` con el timestamp del momento de creación y `Status` en `Pending`

### Alcance técnico

- Endpoint `POST /api/expenses` que recibe los datos del gasto y devuelve el recurso creado con su identificador
- Validaciones de entrada en backend (importe, fecha, categoría obligatoria, descripción con longitud mínima)
- Componente Angular con formulario reactivo, validaciones en cliente y feedback visual de error/éxito
- Integración con el listado existente (placeholder de PBI-01) para mostrar el gasto recién creado sin recargar la página

### Fuera de alcance

- Adjuntar justificantes o imágenes
- Categorías configurables (usar lista fija de 5-6 valores por ahora)
- Edición del gasto (cubierto por PBI-06)

### Preguntas abiertas para refinamiento

- ¿Qué pasa si el usuario introduce un importe con muchos decimales? ¿Redondeamos? ¿Rechazamos?
- ¿La descripción tiene un mínimo y un máximo de caracteres? ¿Cuáles?
- ¿El autor del gasto viene de alguna parte o se usa un valor fijo tipo "current-user" durante el MVP?

---

## PBI-03 — Filtrar gastos por categoría

**Tipo:** Feature
**Prioridad:** Media
**Estimación:** 2 puntos
**Dependencias:** PBI-01

### Historia de usuario

> **Como** usuario que consulta gastos
> **Quiero** poder filtrar el listado por categoría
> **Para** encontrar rápidamente los gastos de un tipo concreto sin tener que recorrer toda la lista.

### Criterios de aceptación

**DADO** un listado de gastos con varias categorías distintas
**CUANDO** el usuario selecciona una categoría en el filtro
**ENTONCES** el listado muestra únicamente los gastos de esa categoría, manteniendo el orden por fecha descendente

**DADO** un filtro de categoría activo
**CUANDO** el usuario lo deselecciona o selecciona "Todas"
**ENTONCES** el listado vuelve a mostrar todos los gastos

**DADO** una categoría sin gastos asociados
**CUANDO** el usuario la selecciona en el filtro
**ENTONCES** se muestra un mensaje vacío informativo ("No hay gastos en esta categoría") en lugar del listado

### Alcance técnico

- Endpoint `GET /api/expenses` con soporte para query parameter `category`
- Componente de filtro en el frontend (select o chips) integrado en la página de gastos
- Actualización reactiva del listado al cambiar el filtro

### Fuera de alcance

- Filtros combinados (categoría + otros criterios)
- Filtros por fecha o estado (podrían ser PBIs separados en una futura iteración)

### Preguntas abiertas para refinamiento

- ¿El filtro es un dropdown simple o chips multiselección?
- ¿El filtro persiste al recargar la página (query string) o se resetea?

---

## PBI-04 — Aprobar un gasto

**Tipo:** Feature
**Prioridad:** Alta
**Estimación:** 2 puntos
**Dependencias:** PBI-01

### Historia de usuario

> **Como** aprobador del equipo
> **Quiero** marcar un gasto pendiente como aprobado
> **Para** dejar constancia de que he revisado el gasto y es válido.

### Criterios de aceptación

**DADO** un gasto en estado `Pending`
**CUANDO** el aprobador pulsa el botón "Aprobar" sobre ese gasto
**ENTONCES** el estado cambia a `Approved`, se registra el timestamp de aprobación, y la UI refleja el cambio sin recargar

**DADO** un gasto que ya no está en estado `Pending`
**CUANDO** se intenta aprobarlo
**ENTONCES** la operación es rechazada con un mensaje que indica que solo los gastos pendientes pueden ser aprobados

**DADO** un gasto aprobado
**CUANDO** se consulta su detalle
**ENTONCES** incluye los campos `ApprovedAt` y mantiene el estado `Approved` de forma persistente

### Alcance técnico

- Endpoint `PUT /api/expenses/{id}/approve` idempotente (aprobar algo ya aprobado no debería romper, aunque puede devolver 409)
- Campo `ApprovedAt` nullable en la entidad `Expense`
- Botón "Aprobar" en el listado/detalle del frontend, visible solo si el estado es `Pending`
- Feedback visual claro al cambiar el estado (color, badge, etc.)

### Preguntas abiertas para refinamiento

- ¿El endpoint devuelve 409 Conflict o 200 idempotente si ya estaba aprobado?
- ¿Quién queda registrado como aprobador? ¿Hace falta guardarlo en esta iteración?
- ¿El botón de aprobar pide confirmación o actúa directamente?

---

## PBI-05 — Rechazar un gasto con motivo

**Tipo:** Feature
**Prioridad:** Alta
**Estimación:** 3 puntos
**Dependencias:** PBI-01

### Historia de usuario

> **Como** aprobador del equipo
> **Quiero** rechazar un gasto pendiente indicando el motivo
> **Para** que el autor entienda qué falta o qué está mal y pueda tomar acción.

### Criterios de aceptación

**DADO** un gasto en estado `Pending`
**CUANDO** el aprobador pulsa "Rechazar", introduce un motivo y confirma
**ENTONCES** el gasto pasa a estado `Rejected`, el motivo queda persistido junto al gasto, y se registra el timestamp del rechazo

**DADO** el aprobador inicia el flujo de rechazo
**CUANDO** intenta confirmar sin haber introducido motivo
**ENTONCES** el sistema no permite completar la acción y pide explícitamente el motivo

**DADO** un gasto rechazado
**CUANDO** se consulta su detalle
**ENTONCES** incluye el campo `RejectionReason` con el texto introducido y `RejectedAt` con el timestamp

### Alcance técnico

- Endpoint `PUT /api/expenses/{id}/reject` que recibe `{ reason: string }` en el body
- Validación de que el `reason` no sea vacío ni solo whitespace
- Campos `RejectionReason` y `RejectedAt` en la entidad
- Diálogo modal en el frontend para capturar el motivo antes de enviar

### Preguntas abiertas para refinamiento

- ¿Hay un mínimo de longitud para el motivo? ¿Un máximo?
- ¿Se puede revertir un rechazo o es definitivo?
- ¿El motivo se muestra al autor en el listado o solo en el detalle?

---

## PBI-06 — Editar un gasto pendiente

**Tipo:** Feature
**Prioridad:** Media
**Estimación:** 3 puntos
**Dependencias:** PBI-01

### Historia de usuario

> **Como** colaborador que registró un gasto
> **Quiero** poder corregir los datos de un gasto mío mientras esté pendiente
> **Para** arreglar errores de tipeo o añadir información sin tener que borrarlo y crearlo de nuevo.

### Criterios de aceptación

**DADO** un gasto en estado `Pending`
**CUANDO** el autor abre el gasto y modifica cualquiera de sus campos editables
**ENTONCES** los cambios se guardan, se refleja en el listado y el gasto mantiene su estado `Pending`

**DADO** un gasto en estado `Approved` o `Rejected`
**CUANDO** se intenta editarlo
**ENTONCES** la operación es rechazada con un mensaje que indica que solo los gastos pendientes son editables

**DADO** un gasto editado
**CUANDO** se consulta su detalle
**ENTONCES** incluye un timestamp `UpdatedAt` que refleja la última modificación

### Alcance técnico

- Endpoint `PUT /api/expenses/{id}` con validaciones equivalentes a las de creación
- Solo permite editar si el estado es `Pending` (devuelve 409 en caso contrario)
- Campo `UpdatedAt` nullable en la entidad
- Formulario de edición en frontend, reutilizando el componente de creación si es posible

### Preguntas abiertas para refinamiento

- ¿Se puede editar cualquier campo o algunos son inmutables (ej: fecha, autor)?
- ¿Guardamos histórico de cambios o solo el último valor?
- ¿El botón "Editar" aparece solo para el autor o para cualquier usuario?

---

## PBI-07 — Total de gastos aprobados

**Tipo:** Feature
**Prioridad:** Media
**Estimación:** 2 puntos
**Dependencias:** PBI-01

### Historia de usuario

> **Como** administrador que revisa los gastos del equipo
> **Quiero** ver el total acumulado de gastos aprobados
> **Para** saber cuánto lleva consumido el equipo sin tener que sumar a mano.

### Criterios de aceptación

**DADO** un conjunto de gastos con distintos estados
**CUANDO** se consulta el endpoint de total
**ENTONCES** devuelve la suma de importes de los gastos en estado `Approved`, ignorando los demás

**DADO** no hay ningún gasto aprobado
**CUANDO** se consulta el endpoint de total
**ENTONCES** devuelve cero

**DADO** la página de gastos
**CUANDO** el usuario accede a ella
**ENTONCES** se muestra el total acumulado de gastos aprobados en una zona visible (header, KPI card o similar)

### Alcance técnico

- Endpoint `GET /api/expenses/total` que devuelve `{ totalApproved: number, count: number }`
- Componente de KPI en el frontend que consume el endpoint al cargar la página
- Actualización del KPI cuando cambia el estado de algún gasto (aprobación/rechazo)

### Preguntas abiertas para refinamiento

- ¿El total se calcula sobre todos los gastos aprobados históricos o solo del mes en curso?
- ¿El KPI se refresca en tiempo real o al recargar la página?
- ¿Qué pasa con multimoneda? (Por ahora asumimos moneda única.)

---

## PBI-08 — Desglose de gastos por categoría

**Tipo:** Feature
**Prioridad:** Media
**Estimación:** 3 puntos
**Dependencias:** PBI-01

### Historia de usuario

> **Como** administrador
> **Quiero** ver el gasto total agrupado por categoría
> **Para** identificar en qué tipos de gasto el equipo está consumiendo más.

### Criterios de aceptación

**DADO** un conjunto de gastos distribuidos en varias categorías
**CUANDO** se consulta el endpoint de desglose
**ENTONCES** devuelve una lista con `category`, `count` y `total` por cada categoría que tenga al menos un gasto aprobado, ordenada por total descendente

**DADO** el desglose en el frontend
**CUANDO** el usuario accede a la página de reportes
**ENTONCES** ve la información en una tabla o visualización simple (gráfico de barras, tabla con totales)

**DADO** una categoría sin gastos aprobados
**CUANDO** se genera el desglose
**ENTONCES** esa categoría no aparece en el resultado

### Alcance técnico

- Endpoint `GET /api/expenses/by-category` con la agregación en base de datos
- Componente de visualización en el frontend (tabla básica es suficiente, gráfico es bonus)

### Preguntas abiertas para refinamiento

- ¿El desglose incluye solo gastos aprobados o también pendientes?
- ¿Se puede filtrar por rango de fechas?
- ¿El orden es siempre por total o configurable por el usuario?

---

## PBI-09 — Exportar gastos a CSV

**Tipo:** Feature
**Prioridad:** Media
**Estimación:** 2 puntos
**Dependencias:** PBI-01

### Historia de usuario

> **Como** administrador que cierra el mes
> **Quiero** descargar todos los gastos en un archivo CSV
> **Para** pasárselo a contabilidad sin tener que copiar los datos manualmente.

### Criterios de aceptación

**DADO** un conjunto de gastos en el sistema
**CUANDO** el usuario pulsa el botón "Exportar CSV"
**ENTONCES** el navegador descarga un archivo CSV con todos los gastos incluyendo columnas para fecha, importe, categoría, descripción, estado y autor

**DADO** el CSV descargado
**CUANDO** se abre en Excel o LibreOffice
**ENTONCES** las columnas están correctamente alineadas, los importes usan el formato numérico local y las fechas son reconocidas como tales

**DADO** el flujo de exportación
**CUANDO** no hay gastos en el sistema
**ENTONCES** el botón sigue funcionando pero se muestra un mensaje informativo indicando que el archivo está vacío

### Alcance técnico

- Endpoint `GET /api/expenses/export` que devuelve el CSV con los headers HTTP correctos (`Content-Type: text/csv`, `Content-Disposition: attachment; filename=...`)
- Generación del CSV con escape correcto de caracteres especiales (comas en descripciones, comillas, saltos de línea)
- Botón de exportación en la página de gastos

### Preguntas abiertas para refinamiento

- ¿Separador coma o punto y coma? (Afecta a Excel en locale español.)
- ¿Encoding UTF-8 con BOM o sin BOM? (Afecta a Excel para caracteres acentuados.)
- ¿Se pueden filtrar los gastos a exportar por rango de fechas o siempre se exporta todo?

---

## Anexos

### Estructura de carpetas sugerida (orientativa)

```
expense-tracker/
├── backend/
│   ├── src/
│   │   ├── ExpenseTracker.Domain/
│   │   ├── ExpenseTracker.Application/
│   │   ├── ExpenseTracker.Infrastructure/
│   │   └── ExpenseTracker.Api/
│   └── tests/
│       └── ExpenseTracker.Tests/
├── frontend/
│   └── src/app/
├── docker-compose.yml
├── .github/workflows/ci.yml  (o azure-pipelines.yml)
└── README.md
```

### Datos de seed (orientativo)

El seed inicial debe incluir al menos 15 gastos repartidos entre categorías y estados, para que las features de filtrado, agregación y exportación tengan contenido con el que trabajar desde el primer momento. Categorías sugeridas: `Dietas`, `Transporte`, `Material`, `Representación`, `Formación`, `Otros`.