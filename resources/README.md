# Spec-Driven Development — Recursos del taller

Bundle de plantillas y assets para empezar a trabajar con SDD en cualquier proyecto, tras el taller del **12 de junio de 2026 en Monlau**.

Está pensado para docentes de DAM/DAW que quieran:

1. Aplicar la metodología SDD en sus propios proyectos (TFG dirigidos, proyectos de aula, side projects)
2. Tener una referencia rápida del flujo `explore → propose → apply → verify → archive`
3. Disponer de plantillas listas para arrancar un repositorio nuevo sin perder tiempo en configuración

---

## ¿Qué es SDD?

> **Ningún código se escribe sin spec. Ningún código mergea sin verify.**

Cada cambio pasa por 5 fases con artefactos versionados:

```
/opsx:explore  →  /opsx:propose  →  /opsx:apply  →  /opsx:verify  →  /opsx:archive  →  PR + CI
   (ticket)        (proposal +        (código +       (drift           (specs sync         (auto-merge)
                    design + specs     tests)         check)            a source of
                    + tasks)                                            truth)
```

Cada fase tiene su slash command. Cada slash command es un agente que carga un prompt curado. El estado vive en `openspec/changes/<change-name>/`.

---

## Estructura del bundle

```
workshop-resources/
├── README.md                                    # este archivo
├── assets/
│   ├── sdd-cheatsheet.md                        # 1 página con el flujo completo (imprimir y tener cerca)
│   ├── sdd-process-diagram.md                   # diagramas Mermaid del proceso
│   └── example-pbi-walkthrough.md               # ejemplo del taller punta a punta (Expense Tracker)
├── templates/
│   ├── AGENTS.md.template                       # instrucciones agnósticas (Claude Code, Cursor, etc.)
│   ├── CLAUDE.md.template                       # instrucciones específicas para Claude Code (avanzado)
│   ├── copilot-instructions.md.template         # instrucciones para GitHub Copilot
│   ├── openspec-config.yaml.template            # configuración OpenSpec
│   ├── github-pbi-issue-template.md             # plantilla de issue de GitHub para un PBI
│   ├── github-pr-template.md                    # plantilla de PR
│   └── github-actions-ci.yml.template           # workflow CI mínimo
└── claude-skills/
    ├── opsx-explore.md                          # skill de exploración
    ├── opsx-propose.md                          # skill de propuesta (genera todos los artefactos)
    ├── opsx-apply.md                            # skill de implementación
    ├── opsx-verify.md                           # skill de verificación
    └── opsx-archive.md                          # skill de archivo
```

---

## Cómo usarlo

### Caso 1 — Proyecto nuevo desde cero

```bash
# 1. Crear y entrar al repo
mkdir mi-proyecto && cd mi-proyecto && git init

# 2. Instalar OpenSpec CLI
npm install -g @fission-ai/openspec

# 3. Inicializar OpenSpec con perfil custom (el flujo expandido del taller)
openspec init --tools github-copilot --profile custom
# o con --tools claude si vas a usar Claude Code

# 4. Copiar las plantillas necesarias
cp workshop-resources/templates/AGENTS.md.template ./AGENTS.md
cp workshop-resources/templates/openspec-config.yaml.template ./openspec/config.yaml

# Si usas Claude Code, también:
cp workshop-resources/templates/CLAUDE.md.template ./CLAUDE.md
mkdir -p .claude/commands/opsx
cp workshop-resources/claude-skills/*.md .claude/commands/opsx/

# Si usas Copilot:
mkdir -p .github
cp workshop-resources/templates/copilot-instructions.md.template ./.github/copilot-instructions.md

# 5. Plantillas de GitHub (opcional pero recomendado)
mkdir -p .github/ISSUE_TEMPLATE .github/workflows
cp workshop-resources/templates/github-pbi-issue-template.md .github/ISSUE_TEMPLATE/pbi.md
cp workshop-resources/templates/github-pr-template.md .github/PULL_REQUEST_TEMPLATE.md
cp workshop-resources/templates/github-actions-ci.yml.template .github/workflows/ci.yml

# 6. Reemplazar todos los placeholders (busca {{...}}) por tus valores
```

### Caso 2 — Proyecto existente

Empezad por `AGENTS.md` (o `CLAUDE.md`) y `openspec/config.yaml`. Con esos dos solos ya hacéis que la próxima sesión del agente sepa cómo trabajar en vuestro proyecto.

Después, en el siguiente cambio que entre, haced un ciclo completo `/opsx:explore` → `/opsx:archive`. Os vais a dar cuenta enseguida si las plantillas necesitan ajustes para vuestro dominio.

---

## ¿Por qué dos archivos de instrucciones (AGENTS.md + CLAUDE.md)?

Cada herramienta tiene su sweet spot:

| Herramienta | Cuándo |
|---|---|
| **Claude Code** | Sesiones largas (≥1h), refactors multi-archivo, exploración de unknowns, generación de specs, conversaciones extensas con contexto |
| **GitHub Copilot** | Auto-complete dentro del IDE, suggestions inline mientras tecleas, completar funciones cortas, generar boilerplate |

Tener `AGENTS.md` (genérico) + `CLAUDE.md` (específico) + `copilot-instructions.md` permite que **ambos agentes vean las mismas reglas del proyecto** sin duplicar conocimiento. Cada uno carga lo que le corresponde.

Si solo vais a usar uno, podéis quedaros con `AGENTS.md`. Es lo mínimo.

---

## Por dónde empezar a leer

Si tenéis 5 minutos: leed `assets/sdd-cheatsheet.md`.

Si tenéis 20 minutos: leed `assets/sdd-cheatsheet.md` + `assets/example-pbi-walkthrough.md`.

Si vais a montar el flujo en un repositorio propio: el orden es `README.md` (este) → `templates/AGENTS.md.template` → `templates/openspec-config.yaml.template`.

---

## Recursos del taller

Además de este bundle, recordad que en el taller cubrimos:

- **PRD del Expense Tracker** — proyecto demo donde se ve el flujo completo en acción
- **`config.yaml` poblado** para Node + Express + Prisma + React (en `templates/openspec-config.yaml.template`)
- **Configuración MCP** para Atlassian, GitHub y Context7 (vista en el taller)
- **Toolkit de prompts** para generar PRDs con IA (Prompts 01–03)
- **Quick reference card** (este mismo `assets/sdd-cheatsheet.md`)

---

## Licencia

MIT. Usadlo, modificadlo, compartidlo.
