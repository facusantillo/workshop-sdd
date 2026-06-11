# Prompt 02 — Redacción del PRD

**Cuándo usarlo**

Cuando ya tenéis la idea suficientemente clara (idealmente después del Prompt 01) y queréis convertirla en un PRD estructurado, listo para alimentar el flujo `/opsx:propose → /opsx:apply`.

**Cómo usarlo**

A diferencia del Prompt 01, este **no** usa `/opsx:explore`. Se ejecuta como una conversación normal con el agente porque el output es un documento, no un cambio sobre el proyecto. Cuando el PRD esté generado y revisado, lo guardáis como archivo y a partir de ese momento sí entráis en el flujo OpenSpec.

**Prerequisito**

El archivo `PRD_TOOLKIT_00_template.md` debe estar accesible en el workspace abierto en VS Code (idealmente en la misma carpeta que este prompt). El prompt referencia ese archivo como única fuente de verdad de la estructura del PRD. Si en algún momento ajustáis el template, no necesitáis tocar este prompt: los cambios se propagan automáticamente.

---

## El prompt

```
Necesito que generes un PRD completo para un producto que voy a
desarrollar siguiendo la metodología Spec-Driven Development (SDD).
El PRD será el input para el flujo OpenSpec (/opsx:propose → /opsx:apply),
así que debe estar lo suficientemente estructurado y detallado para que
el agente pueda generar los artefactos derivados sin ambigüedades.

ESTRUCTURA A SEGUIR

Leé el archivo PRD_TOOLKIT_00_template.md del workspace y usalo como
estructura exacta para el output. Respetá:

- El orden y nombre de todas las secciones del template
- El formato DADO/CUANDO/ENTONCES para los criterios de aceptación
- La estructura interna de cada PBI (Tipo, Prioridad, Estimación,
  Dependencias, Historia de usuario, Contexto, Criterios de aceptación,
  Alcance técnico, Fuera de alcance, Preguntas abiertas para refinamiento)
- El bloque de anexos al final

Los comentarios HTML del template explican qué va en cada sección:
leélos para entender el intent. NO los incluyas en el output final.

ENTRADAS

Producto: [Nombre]

Descripción corta: [1-3 frases]

Problema que resuelve y situación actual: [Cómo se hace hoy y qué
problemas concretos genera ese cómo]

Usuarios: [2-4 perfiles, qué hacen y qué necesitan]

Funcionalidades principales del MVP: [Lista de 5-10 capacidades que
sí entran en el MVP]

Funcionalidades fuera de alcance: [Lista de cosas que explícitamente
NO entran, incluso si parecen obvias]

Stack técnico: [Backend, frontend, base de datos, ORM si aplica,
testing, entorno local, CI. Si querés que decida yo en base al
contexto, decid "decidir basándose en contexto educativo / profesional
/ etc."]

Restricciones: [Constraints duros: tiempo, stack obligatorio,
servicios externos prohibidos, etc.]

Contexto adicional: [Cualquier información relevante: si es para un
proyecto educativo, una demo, un proyecto interno, etc.]

REGLAS CRÍTICAS (NO NEGOCIABLES)

1. PBI-01 siempre es un Bootstrap técnico que entregue el esqueleto
   del proyecto: scaffold del backend y frontend, esquema de base de
   datos con migración inicial, seed con datos de ejemplo, endpoint
   de salud, frontend vacío pero navegable, docker-compose y CI
   funcional. No es opcional.

2. Entre 5 y 10 PBIs totales. PBI-02 en adelante son features
   independientes que solo dependen del PBI-01.

3. Mínimo 3 escenarios DADO/CUANDO/ENTONCES por PBI. Cada uno debe
   ser testeable: si no podés imaginar el test que verifica el
   criterio, reformulalo o quitalo.

4. Cada PBI con preguntas abiertas para refinamiento explícitas. Es
   preferible una pregunta abierta visible que una decisión implícita
   tuya.

REGLAS DE CALIDAD

- No inventes funcionalidades que no estén en mis entradas. Si crees
  que falta algo crítico, agregalo a "Preguntas abiertas para
  refinamiento" en lugar de añadirlo como hecho.

- Los importes, tiempos, umbrales y métricas concretas deben ser
  realistas. Si no te di un valor, proponé uno razonable y dejá una
  pregunta abierta para confirmarlo.

- Mantené el tono profesional y descriptivo. Sin marketing, sin
  superlativos.

- Si detectás contradicciones o ambigüedades en mis entradas,
  pausá antes de generar el PRD y pedime que las clarifique.

FORMATO DE SALIDA

Markdown completo, listo para guardar como PRD.md. Sin preámbulo,
sin explicaciones tuyas antes o después, solo el documento. Sin
los comentarios HTML del template.
```

---

## Qué esperar como output

Un archivo markdown listo para guardar y commitear al repositorio del proyecto.

Lo que **debería pasar**:

- El agente respeta la estructura exacta del template
- Los criterios de aceptación están en formato DADO/CUANDO/ENTONCES
- El PBI-01 es un bootstrap técnico
- Cada PBI tiene preguntas abiertas para refinamiento
- No inventa funcionalidades
- No incluye los comentarios HTML del template

Lo que **no debería pasar**:

- Añadir features que no estaban en las entradas
- Saltarse el PBI de bootstrap
- Resolver por su cuenta ambigüedades importantes sin marcarlas
- Generar criterios de aceptación vagos no testeables
- Modificar el orden o los nombres de las secciones del template

Si pasa cualquiera de las cosas que no deberían, pedid corrección puntual sin regenerar todo:

> "Reescribí solo el PBI-X. El criterio de aceptación Y no es testeable: no podés verificar 'el usuario se siente cómodo' con un test."

---

## Siguiente paso

Una vez generado el PRD, **revisarlo a fondo antes de iniciar el flujo SDD**. Si encontráis gaps importantes, usad el **Prompt 03 (Refinamiento)** sobre el PRD generado.

Cuando estéis conformes:

1. Guardad el PRD como `PRD.md` en la raíz del repo o en `docs/`
2. Inicializad OpenSpec con `openspec init --tools <vuestro-tool> --profile custom`
3. Rellenad el `config.yaml` con context y rules del proyecto
4. Arrancad el flujo con `/opsx:propose <nombre-de-la-feature>` apuntando al primer PBI