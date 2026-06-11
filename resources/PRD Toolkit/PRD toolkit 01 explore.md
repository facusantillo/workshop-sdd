# Prompt 01 — Exploración de la idea inicial

**Cuándo usarlo**

Cuando tenéis una idea de producto pero no la tenéis del todo formulada. Antes de escribir un PRD, antes de tomar decisiones técnicas. El objetivo de este prompt es **descubrir qué queréis construir realmente**, no empezar a construirlo.

**Cómo usarlo**

Pegadlo en Copilot Chat (o Claude Code) precedido del comando `/opsx:explore`. El agente entrará en modo investigación: no escribirá código, no creará archivos, solo razonará en voz alta con vosotros.

También funciona como prompt suelto en una conversación normal con el agente si no estáis dentro de un proyecto OpenSpec inicializado.

---

## El prompt

```
/opsx:explore

Quiero explorar la siguiente idea de producto antes de escribir el PRD.

IDEA INICIAL
[Describid la idea en 2-5 frases. No os preocupéis si está poco definida,
ese es el punto. Incluid lo que sepáis sobre el problema que queréis
resolver y para quién.]

CONTEXTO ADICIONAL
- Audiencia objetivo: [Quién va a usar esto. Si no lo sabéis con
  certeza, decid "no estoy seguro, probablemente X o Y"]
- Contexto de uso: [Educativo, profesional, personal, demostrativo, etc.]
- Restricciones conocidas: [Tiempo disponible, stack obligatorio,
  conocimiento del equipo, etc. Si no hay, decid "ninguna específica"]
- Inspiración o referencias: [Si existen productos similares o ejemplos
  que tengáis en mente]

LO QUE NECESITO DE VOS

Quiero que actúes como un product engineer senior que me ayuda a
clarificar la idea antes de comprometerme a construirla. Específicamente:

1. PROBLEMA REAL. Reformulá el problema en tus propias palabras.
   Si crees que el problema que enuncio no es el problema real,
   decímelo y proponé tu versión.

2. PREGUNTAS DE DESCUBRIMIENTO. Hacé entre 5 y 8 preguntas concretas
   cuyas respuestas me ayuden a definir mejor el producto. Priorizá
   preguntas que me obliguen a tomar decisiones, no preguntas teóricas.

3. ENFOQUES POSIBLES. Proponé 2 o 3 maneras distintas de abordar la
   idea, con sus trade-offs. No tienen que ser variaciones técnicas
   sino formas de entender el alcance (ej: "versión mínima como
   herramienta interna" vs "versión más ambiciosa con multi-tenant").

4. ALCANCE MÍNIMO PROPUESTO. Sugerí cuál sería el subconjunto más
   pequeño de funcionalidades que aún aportaría valor real. Justificá
   por qué cada cosa entra o no.

5. RIESGOS Y SUPUESTOS. Listá los supuestos que estás haciendo al
   responder y los riesgos principales que ves en la idea tal como
   está formulada.

No escribas código ni crees archivos. Esta es una conversación de
investigación. Cuando termines, esperá mis respuestas a tus preguntas
antes de proponer nada concreto.
```

---

## Qué esperar como output

El agente debería devolver una respuesta estructurada con esos 5 bloques. **No debería** generar un PRD directamente, ni proponer stack, ni empezar a escribir código.

Si lo hace (algunos modelos tienden a saltarse el modo exploración), respondé:

> "Pará. Estás saltando a soluciones. Volvé al modo exploración: solo preguntas y trade-offs, sin propuestas concretas todavía."

---

## Siguiente paso

Una vez tengáis claridad tras la conversación de exploración, pasad al **Prompt 02 (Redacción del PRD)** para convertir las decisiones tomadas en un documento estructurado.