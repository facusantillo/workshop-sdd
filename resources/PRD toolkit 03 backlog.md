# Prompt 03 — Carga al backlog vía MCP

**Cuándo usarlo**

Después de generar el PRD con el Prompt 02. Toma el documento markdown y crea automáticamente la épica y los tickets correspondientes en el backlog real (Jira o GitHub Projects), conectándolos con sus dependencias.

Es el paso que transforma el PRD de "documento estático" a "trabajo accionable" sin que tengáis que copiar y pegar a mano cada PBI en el sistema de gestión.

**Cómo usarlo**

Conversación normal con el agente, con el MCP del destino correspondiente ya configurado y autenticado.

**Prerequisitos**

- `PRD.md` (o el archivo que generasteis con el Prompt 02) en el workspace
- MCP del destino conectado:
  - Para **Jira**: el MCP de Atlassian autenticado contra vuestro site
  - Para **GitHub Projects**: el MCP de GitHub con un PAT que tenga scope `project`
- Tener identificados los datos del destino: project key de Jira, o owner/repo/project number de GitHub

---

## El prompt

```
Necesito que cargues los PBIs del PRD del workspace en el backlog
de destino que indico abajo, usando el MCP correspondiente. El
objetivo es transformar el documento en tickets accionables,
manteniendo la jerarquía (épica + historias) y las dependencias.

PRD DE ORIGEN

Leé el archivo PRD.md del workspace.

DESTINO

Tipo: [Jira | GitHub Project]

Si el destino es Jira:
- Site URL: [https://tuempresa.atlassian.net]
- Project key: [ej: WORK, MON, etc.]
- Tipo de issue para la épica: [Epic]
- Tipo de issue para los PBIs: [Story | Task | según prefieras]

Si el destino es GitHub Project:
- Owner: [usuario u organización]
- Repo donde crear los issues: [nombre del repo]
- Project number: [número del project board, si querés añadir
  los issues automáticamente al board]

MAPPING

Para la épica del PRD:
- Título: nombre de la épica del PRD
- Descripción: combinar "Objetivo" + "Resultado esperado"
  manteniendo el formato markdown
- Labels: epic, sdd, mvp

Para cada PBI:
- Título con el formato: "[PBI-XX] <nombre del PBI>"
- Descripción: incluir en este orden, manteniendo markdown:
  - Historia de usuario completa
  - Contexto (si existe)
  - Criterios de aceptación
  - Alcance técnico
  - Fuera de alcance (si existe)
  - Preguntas abiertas para refinamiento (si existen)
- Labels: 
  - Tipo del PBI: technical-enabler o feature
  - Prioridad: priority-critical / priority-high / priority-medium / priority-low
  - sdd
- Estimación: el valor de "Estimación" del PRD (en story points
  si el destino lo soporta)
- Vincular a la épica creada antes

DEPENDENCIAS

Configurar la relación de bloqueo según el árbol de dependencias
del PRD. En la mayoría de PRDs generados con este flujo, el patrón
es: PBI-01 (Bootstrap) bloquea a todos los demás.

- En Jira: usar el link type "blocks" / "is blocked by"
- En GitHub Projects: usar la referencia textual en la descripción
  ("Blocked by: #<numero-issue>") y, si el project tiene un campo
  custom para dependencias, configurarlo

REGLAS DE EJECUCIÓN

1. ANTES DE CREAR NADA, mostrame un resumen de lo que vas a hacer:
   - Cuántas issues vas a crear (1 épica + N PBIs)
   - Lista de títulos
   - Relaciones de bloqueo que vas a configurar
   Esperá mi confirmación explícita antes de proceder.

2. Crear primero la épica. Después los PBIs en orden numérico
   (PBI-01, PBI-02, ...). Cada PBI debe quedar vinculado a la
   épica como issue hija.

3. Configurar las relaciones de bloqueo solo después de que
   todos los PBIs existan. Si lo hacés antes, los IDs no existen
   todavía.

4. Si algún paso falla, paráte y reportame el error en lugar de
   continuar y dejar tickets a medias.

5. Al terminar, dame un resumen con:
   - URL de la épica creada
   - Lista de URLs de los PBIs creados, en orden
   - Relaciones de bloqueo configuradas
   - Cualquier paso que no se haya podido completar y por qué

NO HAGAS

- No crees workflows, sprints, ni configuraciones del project.
  Solo issues y sus relaciones.
- No modifiques issues existentes en el backlog. Si detectás
  algo que parece duplicado, parate y preguntame.
- No inventes campos custom que no te haya pedido.
```

---

## Qué esperar como output

**Antes de tocar nada**, el agente debe darte un resumen tipo:

> Voy a crear 1 épica y 9 PBIs en el proyecto MON de Jira:
>
> - Épica: "Expense Tracker Core MVP"
> - PBI-01 — Bootstrap del proyecto Expense Tracker
> - PBI-02 — Crear un gasto
> - PBI-03 — Filtrar gastos por categoría
> - ...
>
> Y configuraré 8 relaciones de bloqueo (PBI-01 bloquea a PBI-02 a PBI-09).
>
> ¿Confirmás que proceda?

Después de tu confirmación, ejecuta y devuelve algo como:

> Listo. Creado:
>
> - Épica: MON-100 — https://...
> - PBI-01: MON-101 — https://...
> - PBI-02: MON-102 — https://...
> - ...
>
> Relaciones de bloqueo configuradas: PBI-01 (MON-101) bloquea a MON-102, MON-103, ...

---

## Errores comunes

**El agente intenta crear sin confirmar primero.**
Recordale: "Pediste mostrar el resumen antes de proceder. Volvé a empezar y mostralo."

**Los PBIs no quedan vinculados a la épica.**
En Jira: pedile explícitamente que use el campo "Epic Link" o "Parent" (depende de la configuración del proyecto). En GitHub Projects: confirmá que el project number es correcto.

**Las dependencias se cargan antes que los issues.**
Si el agente intenta configurar bloqueos antes de tener todos los IDs, los enlaces fallan. Recordale el orden: "Crear todas las issues primero, configurar dependencias al final."

**Issues duplicados por reintentos.**
Si la operación falla a mitad de camino y reintentás, podés acabar con duplicados. Antes de retry, pedile al agente que verifique qué issues ya existen y solo cree las que faltan.

---

## Siguiente paso

Una vez los tickets están en el backlog, ya tenés el ciclo completo del lado de planificación. Ahora podéis arrancar la implementación:

1. `openspec init --tools <vuestro-tool> --profile custom` en el repo del proyecto
2. Rellenar `config.yaml` con context y rules
3. `/opsx:propose <nombre-de-la-feature>` apuntando al primer PBI del backlog
4. Continuar el ciclo: `/opsx:apply` → `/opsx:verify` → `/opsx:archive`

El loop ya cerró: idea vaga → PRD → backlog real → código.