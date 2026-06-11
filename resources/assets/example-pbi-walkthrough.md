# Ejemplo punta a punta — PBI-09 "Exportar gastos a CSV"

Caso del proyecto **Expense Tracker** del taller. Total estimado: 1 sesión, ~2 horas, **~250 LOC en producción + 12 tests** entregados con un scope pivot razonado y trazable.

Este walkthrough muestra un PBI aparentemente simple ("descargar un CSV") que, gracias al ciclo SDD, revela tres decisiones de diseño no triviales antes de tocar código y un pivot mid-apply causado por un caso edge detectado en los tests.

---

## 0. El ticket (GitHub issue)

```markdown
[PBI-09] Exportar gastos a CSV

Como administrador que cierra el mes, quiero descargar todos los gastos en un
archivo CSV, para pasárselo a contabilidad sin tener que copiar los datos
manualmente.

Acceptance Criteria:
- Endpoint GET /api/v1/expenses/export devuelve un CSV
- Headers HTTP correctos: Content-Type: text/csv, Content-Disposition: attachment
- Columnas: fecha, importe, categoría, descripción, estado, autor
- Al abrir en Excel/LibreOffice, las columnas se alinean y los importes/fechas
  son interpretados correctamente
- Botón "Exportar CSV" en la página de gastos del frontend
- Si no hay gastos, el archivo sigue descargándose con solo los headers

Dependencias: PBI-01 (bootstrap)

Preguntas abiertas para refinar:
- ¿Separador coma o punto y coma?
- ¿Encoding UTF-8 con BOM o sin?
- ¿Se puede filtrar por rango de fechas o siempre se exporta todo?
```

---

## 1. `/opsx:explore` — surface unknowns

**Input al agente:**

> Investigar (read-only) PBI-09. Identificar: opciones para generar CSV en Node, decisión de separador/encoding para compatibilidad con Excel en locale español, manejo de caracteres especiales en descripciones, dependencias nuevas necesarias.

**Output del agente (en chat):**

> ### Hallazgos
>
> 1. **Stack actual:** Express + Prisma + TypeScript. Los endpoints existentes devuelven todos JSON. Sin generación de CSV en el codebase.
>
> 2. **Opciones para generar CSV en Node:**
>     - A) Concatenación manual de strings — simple, pero propenso a bugs sutiles con escapado de comas, comillas y saltos de línea.
>     - B) `papaparse` — librería battle-tested, ya usada en uno de tus side projects. Maneja escape RFC 4180 nativo. ~14 KB minificada.
>     - C) `csv-stringify` — alternativa ligera. Similar a B pero menos popular.
>
>     **Recomendación: B (papaparse).** El coste de equivocarse en el escapado es alto y la librería pesa poco.
>
> 3. **Decisión crítica (Excel ES compat):**
>
>     | Pregunta | Default seguro |
>     |---|---|
>     | Separador | Punto y coma (`;`) — Excel en locale ES espera `;` por defecto |
>     | Encoding | UTF-8 **con BOM** — sin BOM, Excel renderiza acentos rotos |
>     | Newline | `\r\n` — compat Windows + funciona en Mac/Linux |
>
> 4. **Manejo de caracteres especiales:**
>     La descripción puede contener cualquier carácter UTF-8. Hay que asegurar que `;`, `"`, `\n` dentro de un campo no rompen la estructura del CSV. RFC 4180 dice: si el valor contiene cualquiera de esos, se envuelve entre comillas y las comillas internas se escapan duplicándolas.
>
>     papaparse lo hace automático con `quotes: true` (siempre) o `quotes: "auto"` (solo cuando hace falta).
>
> 5. **Sobre la pregunta abierta del filtrado por fechas:**
>     Recomiendo dejarlo fuera del PBI-09. Si se acepta, este PBI sigue siendo "exportar todo" — el filtro va en un PBI separado más adelante (cuando aparezca la necesidad real de cerrar meses específicos).
>
> ### Decisiones que necesito que tomes antes de propose
>
> - **D1:** ¿papaparse o concatenación manual? (recomiendo papaparse)
> - **D2:** ¿Separador `;` o `,`? (recomiendo `;` por Excel ES)
> - **D3:** ¿UTF-8 con BOM o sin? (recomiendo con BOM por acentos)
> - **D4:** ¿Quoting siempre o auto? (recomiendo auto, RFC 4180)
> - **D5:** ¿Confirmas que el filtrado por fechas queda fuera de scope?

**Decisión del humano:** "D1 papaparse, D2 `;`, D3 con BOM, D4 auto, D5 confirmado fuera de scope."

---

## 2. `/opsx:propose` — generar los artefactos

El agente escribe automáticamente:

```
openspec/changes/pbi-09-export-csv/
├── proposal.md     ← Por qué + Qué + Capacidades + Impacto
├── design.md       ← 5 decisiones D-01..D-05 + 1 diagrama Mermaid de secuencia
├── specs/
│   └── expense-export/spec.md  ← NEW capability (3 requisitos, 7 escenarios)
└── tasks.md        ← 3 fases / 18 tareas
```

Las cinco decisiones quedan registradas en `design.md`:

- **D-01:** papaparse sobre concatenación manual (rationale: escapado robusto)
- **D-02:** Separador `;` (rationale: locale ES, Excel default)
- **D-03:** UTF-8 con BOM (rationale: render correcto de acentos en Excel)
- **D-04:** Quoting `auto` siguiendo RFC 4180 (rationale: archivos más limpios)
- **D-05:** Sin filtrado por fechas en MVP (rationale: out of scope, PBI futuro)

**Estado del board:** se queda en **Ready** durante propose. Tú revisas los D-XX, validas, das el OK.

---

## 3. `/opsx:apply` — implementación

**Estado del board:** la primera acción del agente es moverlo a **In progress**.

### Fase 1 — Backend: instalar papaparse + servicio

```
✓ npm install papaparse @types/papaparse
✓ src/application/services/expense-export.service.ts (CSV builder con BOM)
✓ src/api/routes/expenses.ts (nuevo endpoint GET /export)
✓ src/api/middleware/error-handler.ts (sin cambios)
✓ 5 tests unitarios verdes
```

### Fase 2 — Mid-apply: pivot detectado

Mientras escribe el test de caracteres especiales, el agente pausa:

> ⏸ Pausa — detecté un caso que el spec no cubría.
>
> **Caso:** un usuario crea un gasto con descripción `Café; agua y bocadillo` (los espacios y el `;` son naturales en lenguaje humano de oficina).
>
> **El test falla:** el `;` de la descripción se interpreta como separador de columnas, partiendo el CSV en mitad de la línea.
>
> **Diagnóstico:** papaparse con `quotes: "auto"` SÍ entrecomilla cuando detecta el separador en el valor — pero solo si el separador está configurado correctamente como opción del unparse. Estaba pasándole los datos sin especificar `delimiter: ";"`, por eso papaparse asumía `,` y no detectaba el conflicto con el `;` de la descripción.
>
> **Tres opciones:**
> - **A)** Quotear TODOS los campos siempre (`quotes: true`) — simple, pero archivos un 30% más grandes.
> - **B)** Pasar correctamente `delimiter: ";"` a `unparse()` para que el quoting `auto` haga su trabajo — estándar RFC 4180, archivos óptimos.
> - **C)** Sanitizar las descripciones reemplazando `;` por `,` antes de exportar — corrompe datos del usuario, inaceptable.
>
> Recomiendo **B** porque es lo que el spec asume implícitamente y es la opción correcta. A es defensivo innecesario. C cambia datos del usuario.

**Decisión del humano:** "B."

El agente:

1. **Actualiza** `src/application/services/expense-export.service.ts` para pasar `delimiter: ";"` a `Papa.unparse()`.
2. **Añade** un escenario explícito al spec: "Descripción con separador en el valor se entrecomilla correctamente".
3. **Añade** la decisión **D-06** a `design.md`: "Configurar `delimiter` en papaparse para que `quotes: auto` reconozca el carácter de separador" con su rationale.
4. **Documenta el pivot** en `tasks.md` con un bloque `Scope pivot during apply 2026-06-11:` para que cualquiera que lea el historial entienda por qué hay un D-06 que no existía en propose.
5. **Re-ejecuta** los tests: ahora pasan los 7 (incluyendo el del `;` en la descripción).

### Fase 3 — Frontend: botón de exportar

```
✓ src/components/ExpensesPage/ExportButton.tsx
✓ src/lib/api.ts (añadido cliente para /export)
✓ 2 tests del componente
✓ Build clean, type-check clean, lint clean
```

**Total final:** 12/12 tests verdes, 0 warnings, 0 errors.

---

## 4. `/opsx:verify` — drift check

**Estado del board:** primera acción del agente → mover a **In review**.

Checks:

- ✅ Todas las `[ ]` en `tasks.md` están en `[x]` (incluyendo las añadidas durante el pivot)
- ✅ `npm run build` clean
- ✅ `npm test` verde (12/12)
- ✅ `openspec validate pbi-09-export-csv` ✅
- ✅ Specs reflejan el código implementado (incluyendo D-06)

---

## 5. `/opsx:archive` — sync de specs

```bash
openspec archive pbi-09-export-csv --yes
```

El delta del spec se merge en `openspec/specs/expense-export/spec.md` (capacidad nueva). La carpeta del change se mueve a `openspec/changes/archive/2026-06-11-pbi-09-export-csv/`.

---

## 6. PR + CI

```bash
git commit -m "feat(export): PBI-09 CSV export with Excel ES compatibility"
gh pr create --title "[PBI-09] Exportar gastos a CSV" --assignee @me --body "..."
gh pr merge $PR --auto --squash
```

CI ejecuta build + tests + `openspec validate`. Verde. Auto-merge. Issue se cierra solo via `Closes #9`. Branch local se borra.

---

## Lo que se aprende

| Lección | Cómo se manifestó aquí |
|---|---|
| **Explore vale oro** | Las tres decisiones críticas (separador, encoding, escapado) salieron en explore. Sin ese paso, las habría tenido que tomar el agente en apply de forma silenciosa, sin trazabilidad. |
| **El humano decide los trade-offs, el agente ejecuta** | papaparse vs manual, `;` vs `,`, BOM vs sin BOM, quoting siempre vs auto: todas decisiones humanas. El agente propuso, listó alternativas, recomendó, y esperó la decisión. |
| **Las specs son vivas** | Cuando el test reveló que el `;` en una descripción rompía el CSV, el agente reescribió la spec ANTES de seguir codeando. Verify pasó porque las specs reflejan la realidad. |
| **El pivot está documentado** | `tasks.md` dice literalmente *"Scope pivot during apply 2026-06-11: añadido D-06 sobre configuración explícita de delimiter en papaparse tras descubrir edge case en tests."* Cualquiera que lea el historial entiende por qué. |
| **CI es el merge gate** | El archivo se mueve a `archive/` ANTES del PR. El PR existe para que CI valide. Si CI falla, el change ya estaba archivado: queda como evidencia de que el flujo se respetó, no como un fast-forward escondido. |
| **El trabajo "obvio" no era obvio** | El PBI parecía trivial ("descarga un CSV"). El ciclo SDD reveló 6 decisiones técnicas no triviales que, sin spec, habrían quedado implícitas en el código y serían imposibles de revertir o auditar. |

---

## Lo que NO hizo el agente (y debería haber hecho un humano sin SDD)

- ❌ Suponer que `,` era buen separador (el dev medio asume `,`; rompe en Excel ES)
- ❌ Olvidar el BOM (los acentos saldrían rotos en Excel; el dev medio no se da cuenta hasta que el cliente se queja)
- ❌ Escribir su propio quoting (que casi siempre tiene bugs sutiles con valores que contienen comillas)
- ❌ Dejar el `;` en descripciones sin escapar (test que solo aparece en producción con datos reales)
- ❌ Olvidarse de documentar las decisiones (en 6 meses nadie sabría por qué el separador es `;`)

El ciclo SDD no es overhead. Es la diferencia entre código que funciona en demo y código que sobrevive a contabilidad pidiéndolo el último día del mes.
