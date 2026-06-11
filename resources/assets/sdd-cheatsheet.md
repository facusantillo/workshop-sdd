# SDD con IA — Cheatsheet de una página

> Imprime esto. Tenlo cerca de tu monitor.

```
┌────────────────────────────────────────────────────────────────────┐
│                  Spec-Driven Development (SDD) loop                 │
└────────────────────────────────────────────────────────────────────┘

      EXPLORE        PROPOSE         APPLY        VERIFY      ARCHIVE       PR
        │              │              │             │            │            │
        ▼              ▼              ▼             ▼            ▼            ▼
   /opsx:explore  /opsx:propose  /opsx:apply  /opsx:verify  /opsx:archive  gh pr
   "PBI X.Y"      "PBI X.Y"      "<name>"     "<name>"      "<name>"       create
        │              │              │             │            │            │
   Investigar     proposal.md    Implementar   Build verde   Specs sync    Auto-merge
   Aflorar        design.md      Actualizar    Tests pasan   a source      al verde
   unknowns       specs/         tasks.md      Match spec    of truth
   Decidir        tasks.md       Pausar        Sin drift     Mover change
   approach       (revisar!)     [MANUAL] tasks               a archive/

       ▲              ▲              ▲             ▲            ▲
       │              │              │             │            │
   READY         READY           IN PROGRESS    IN REVIEW    IN REVIEW       DONE
                                                                          ↑ cierra issue
                                                                          ↑ borra branch
```

## Reglas de oro

1. **Sin spec no hay código.** Te saltas explore/propose → escribes lo que no es, dos veces.
2. **Mueve el ticket ANTES de empezar el trabajo.** Solo así el cycle time mide la realidad.
3. **Verify es innegociable.** Archivar sin verify = spec equivocada en la source of truth = PBIs siguientes envenenadas.
4. **Auto-merge es la puerta.** "En local funciona" no es prueba. Lo dice el CI.
5. **Actualiza `tasks.md` sobre la marcha.** Tu yo futuro (y futuros lectores) necesitan la traza.

## Los cuatro artefactos

| Archivo | Qué responde |
|---|---|
| `proposal.md` | **Por qué** este cambio. Qué entrega. Qué capacidades toca. |
| `design.md` | **Cómo** — decisiones D-XX con rationale + alternativas. Diagramas Mermaid. Riesgos. |
| `specs/<capability>/spec.md` | **Qué** — escenarios WHEN/THEN. Testeables. |
| `tasks.md` | **En qué orden** — chunks de < 2h. Checkboxes. Prefijo `[MANUAL]` para pasos en entorno. |

## Cinco reglas de buenas specs

1. Formato WHEN/THEN. Cada escenario es un test potencial.
2. Usa SHALL / MUST. No "should" / "may".
3. Al menos 2 escenarios por requisito: happy path + edge case.
4. Sé explícito con los NFRs (timeouts, retries, rate limits).
5. Operaciones ADDED / MODIFIED / REMOVED para delta specs.

## Cinco anti-patrones

1. ❌ "Es un cambio rápido, sin PBI" → Acaba siendo 4 horas y rompe otra cosa.
2. ❌ Saltarse explore en un PBI "obvio" → Descubres en apply que la API no soporta lo que necesitas.
3. ❌ Escribir la spec DESPUÉS del código → La spec acaba narrando el bug.
4. ❌ Archivar sin verify → Se publica una spec incorrecta. Los PBIs siguientes la leerán como verdad.
5. ❌ Generar planning docs que nadie pidió → Ruido.

## Lo que la IA hace bien

✅ Investigación exhaustiva sobre un codebase conocido
✅ Generar boilerplate que respete patrones existentes
✅ Mantener disciplina de checklist
✅ Detectar spec drift durante verify
✅ Identificar edge cases en tests

## Lo que sigues haciendo tú

🧠 Validar decisiones de diseño (el rationale de cada D-XX tiene que ser correcto)
🧠 Aprobar pivots de scope mid-apply
🧠 Verificación en entorno (tareas `[MANUAL]`)
🧠 Revisar PRs antes del auto-merge
🧠 Mantener la línea de "sin atajos"
