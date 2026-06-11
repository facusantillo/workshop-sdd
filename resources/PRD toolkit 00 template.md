# PRD Template

**Cómo usar este template**

Este archivo es la estructura mínima de un PRD que funciona bien como input para el flujo SDD (OpenSpec). Está pensado para copiarse, renombrarse al producto que vayáis a desarrollar y rellenarse sustituyendo los bloques `[...]` y los comentarios HTML por contenido real.

Funciona como destino del **Prompt 02 (Redacción)** y del **Prompt 03 (Refinamiento)**, pero también podéis rellenarlo a mano si preferís pensarlo sin ayuda del agente. La calidad del PRD condiciona directamente la calidad de los artefactos que generen `/opsx:propose` y `/opsx:apply` después.

---

# PRD — [Nombre del producto]

**Estado:** Draft
**Versión:** 1.0
**Autor:** [Nombre]
**Última actualización:** [Mes Año]

---

## 1. Visión del producto

<!--
2-4 párrafos cortos respondiendo:
- Qué es el producto en una frase
- Qué reemplaza o mejora respecto a la situación actual
- Para qué tipo de usuario u organización está pensado

Tono: descriptivo, no comercial. Imaginad que se lo estáis explicando a
otro developer que se va a unir al proyecto la semana que viene.
-->

[Visión del producto]

## 2. Contexto y motivación

<!--
Explicar el problema real que el producto resuelve.

Incluir:
- Cómo se hace hoy (sin el producto)
- Qué problemas concretos genera ese cómo (3-5 puntos)
- Por qué este producto es la respuesta a esos problemas

Si no podéis articular el problema con claridad, todavía no estáis listos
para escribir el PRD. Volved al Prompt 01 (Exploración) primero.
-->

[Descripción del contexto y motivación]

## 3. Objetivos y métricas

### Objetivos del MVP

<!--
3-5 objetivos concretos y verificables. Cada objetivo debe ser
una afirmación clara de algo que el sistema debe permitir hacer,
no una intención abstracta.

Bien: "Permitir registrar un gasto en menos de 30 segundos"
Mal:  "Mejorar la experiencia del usuario"
-->

- [Objetivo 1]
- [Objetivo 2]
- [Objetivo 3]

### Métricas de éxito

<!--
Cómo vais a saber si los objetivos se cumplen. Métricas medibles,
no opiniones.

Bien: "Tiempo medio de aprobación < 48h"
Mal:  "Los usuarios están contentos con el sistema"
-->

- [Métrica 1]
- [Métrica 2]
- [Métrica 3]

## 4. Alcance del MVP

### Dentro de alcance

<!--
Lista de capacidades funcionales que sí entran en el MVP.
Mantenedla corta y honesta: cada item que añadís cuesta tiempo y
complejidad. Si dudáis si algo entra o no, probablemente no entra.
-->

- [Capacidad 1]
- [Capacidad 2]
- [Capacidad 3]

### Fuera de alcance (MVP)

<!--
Igual de importante que lo de dentro de alcance. Decir explícitamente
qué NO entra evita malentendidos posteriores y le da contexto valioso
al agente cuando ejecute el flujo SDD.

Incluir cosas que parezcan obvias pero que alguien podría asumir
que entran: autenticación, integraciones externas, mobile, etc.
-->

- [Algo que NO está]
- [Otra cosa que NO está]
- [Otra más]

## 5. Usuarios

### Perfiles

<!--
2-4 perfiles de usuario. Para cada uno: qué hace en el sistema
y por qué le importa.

En MVPs pequeños es habitual que varios perfiles los cubra la misma
persona. Eso es válido, pero los perfiles siguen siendo útiles para
estructurar el alcance.
-->

- **[Perfil 1]:** [Qué hace, qué necesita]
- **[Perfil 2]:** [Qué hace, qué necesita]
- **[Perfil 3]:** [Qué hace, qué necesita]

## 6. Requisitos técnicos

### Stack

<!--
Concretad el stack tecnológico. Si no estáis seguros, este es el
momento de decidirlo, no después de empezar a codificar.

Si estáis en un contexto educativo, considerad qué stack ya conocen
vuestros alumnos o qué queréis enseñarles.
-->

- **Backend:** [Tecnología + versión]
- **Frontend:** [Tecnología + versión]
- **Base de datos:** [Motor + versión]
- **ORM / acceso a datos:** [Si aplica]
- **Testing:** [Framework]
- **Entorno local:** [Cómo se levanta]
- **CI:** [Plataforma y qué hace]

### Principios de diseño

<!--
3-5 principios que guíen las decisiones técnicas. Pensad en cosas
que el agente debería saber para no inventarse patrones que no queréis.

Ejemplos:
- "Arquitectura por capas pero sin sobreingeniería"
- "Validación de entradas con Zod en backend y frontend"
- "API REST con prefijo /api/v1"
- "TypeScript en modo estricto"
-->

- [Principio 1]
- [Principio 2]
- [Principio 3]

### Restricciones

<!--
Constraints duros que el sistema debe respetar. Esto es lo que el
agente NO debe violar.

Ejemplos:
- "El entorno se levanta con un único comando"
- "Ninguna feature requiere SMTP u otros servicios externos"
- "Todo TypeScript en modo estricto"
-->

- [Restricción 1]
- [Restricción 2]

---

# Épica — [Nombre del producto] Core MVP

**Objetivo:** [Una frase explicando qué entrega esta épica]

**Resultado esperado:** [Cómo se ve el sistema cuando la épica está completa]

**Historias incluidas:** [N]
**Dependencias externas:** [Ninguna / Lista]
**Dependencias internas:** [PBI-01 bloquea al resto / Otras]

## Dependencias entre PBIs

<!--
Un árbol o diagrama simple mostrando qué PBI depende de qué.

Patrón habitual: PBI-01 es un Bootstrap técnico que bloquea a todos
los demás. PBI-02 a PBI-N son independientes entre sí y se pueden
trabajar en paralelo después del bootstrap.
-->

```
PBI-01 ([Bootstrap])
   │
   ├── PBI-02 ([Nombre])
   ├── PBI-03 ([Nombre])
   └── ...
```

[Explicación textual de las dependencias]

---

## PBI-01 — [Nombre del Bootstrap]

**Tipo:** Technical enabler
**Prioridad:** Crítica
**Estimación:** [puntos]

### Historia de usuario

> **Como** [perfil]
> **Quiero** [capacidad]
> **Para** [valor].

### Contexto

<!--
Por qué este PBI es necesario y qué entrega exactamente. Si es el
bootstrap, dejad claro que su trabajo es habilitar el resto, no
implementar features de negocio.
-->

[Contexto del PBI]

### Criterios de aceptación

<!--
Formato DADO / CUANDO / ENTONCES. Mínimo 3 escenarios por PBI:
- Happy path
- Edge case o error
- Verificación posterior (estado, persistencia, integraciones)

Cada criterio debe ser testeable. Si no podéis imaginar el test que
lo verifica, todavía no es un criterio: es una intención.
-->

**DADO** [precondición]
**CUANDO** [acción]
**ENTONCES** [resultado esperado]

**DADO** [precondición]
**CUANDO** [acción]
**ENTONCES** [resultado esperado]

**DADO** [precondición]
**CUANDO** [acción]
**ENTONCES** [resultado esperado]

### Alcance técnico

<!--
Detalle técnico de qué se construye. Agrupar por área (Backend,
Frontend, Infraestructura, CI) si el PBI toca varias.

Este es el bloque que el agente lee con más atención en /opsx:apply,
así que cuanto más concreto, mejor el output.
-->

**Backend:**
- [Tarea técnica 1]
- [Tarea técnica 2]

**Frontend:**
- [Tarea técnica 1]
- [Tarea técnica 2]

**Infraestructura:**
- [Tarea técnica 1]

**CI:**
- [Tarea técnica 1]

### Fuera de alcance

<!--
Decir explícitamente qué este PBI NO incluye. Especialmente útil
en el bootstrap para evitar que el agente intente meter features
del producto que corresponden a PBIs posteriores.
-->

- [Algo que NO entra en este PBI]
- [Otra cosa que NO entra]

### Preguntas abiertas para refinamiento

<!--
Cualquier decisión que aún no esté tomada. Dejadla aquí para
discutirla con el equipo (o con el agente vía /opsx:explore)
antes de ejecutar /opsx:apply.

NO empezar la implementación con preguntas abiertas sin resolver:
el agente las resolverá por su cuenta y probablemente no como
queríais.
-->

- ¿[Pregunta 1]?
- ¿[Pregunta 2]?

---

## PBI-02 — [Nombre de la primera feature]

**Tipo:** Feature
**Prioridad:** [Alta/Media/Baja]
**Estimación:** [puntos]
**Dependencias:** PBI-01

### Historia de usuario

> **Como** [perfil]
> **Quiero** [capacidad]
> **Para** [valor].

### Criterios de aceptación

**DADO** [...]
**CUANDO** [...]
**ENTONCES** [...]

### Alcance técnico

- [Tarea 1]
- [Tarea 2]

### Fuera de alcance

- [Algo que no entra]

### Preguntas abiertas para refinamiento

- ¿[Pregunta]?

---

<!--
Replicar el bloque de PBI por cada feature del MVP.

Recomendación: entre 5 y 10 PBIs para un MVP. Menos de 5 suele
significar que estáis empaquetando demasiado en cada uno. Más de 10
suele significar que el MVP no es realmente mínimo.
-->

## PBI-N — [Última feature]

...

---

## Anexos

### Estructura de carpetas sugerida

<!--
Esquema orientativo de cómo queréis que quede organizado el repo.
No es obligatorio pero ayuda mucho al agente a generar código en
los sitios correctos.
-->

```
[nombre-del-proyecto]/
├── backend/
├── frontend/
├── docker-compose.yml
└── README.md
```

### Datos de seed (orientativo)

<!--
Si vuestro producto tiene datos de ejemplo, listarlos aquí.
Útil para que el bootstrap genere un entorno con contenido
sobre el que probar las features.
-->

[Descripción del seed]