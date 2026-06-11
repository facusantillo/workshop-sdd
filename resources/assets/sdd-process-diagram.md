# Diagramas Mermaid del proceso SDD

Copia y pega cualquiera de estos en tus slides, tu documentación, o tu README. GitHub, GitLab, Notion, Obsidian y la mayoría de renderers de markdown modernos los renderizan nativamente.

## 1. Flujo completo SDD

```mermaid
flowchart LR
    A[Nuevo PBI<br/>idea o issue] --> B[/opsx:explore/]
    B --> C{¿Approach<br/>validado?}
    C -- No --> B
    C -- Sí --> D[/opsx:propose/]
    D --> E[Revisar<br/>proposal.md<br/>design.md<br/>specs/<br/>tasks.md]
    E -- Ajustar --> D
    E -- Aprobado --> F[/opsx:apply/]
    F --> G{tasks.md<br/>todas hechas?}
    G -- No --> F
    G -- Sí --> H[/opsx:verify/]
    H -- Drift --> F
    H -- Limpio --> I[/opsx:archive/]
    I --> J[gh pr create<br/>--assignee @me]
    J --> K{CI verde?}
    K -- No --> F
    K -- Sí --> L[Auto-merge]
    L --> M((Hecho))
    style A fill:#dbeafe
    style M fill:#86efac
    style C fill:#fef3c7
    style E fill:#fef3c7
    style G fill:#fef3c7
    style H fill:#fef3c7
    style K fill:#fef3c7
```

## 2. Transiciones del project board

```mermaid
stateDiagram-v2
    [*] --> Backlog: PBI creado
    Backlog --> Ready: /opsx:explore arranca
    Ready --> Ready: /opsx:propose
    Ready --> InProgress: /opsx:apply arranca
    InProgress --> InProgress: tareas se completan
    InProgress --> InReview: /opsx:verify arranca
    InReview --> InReview: /opsx:archive
    InReview --> Done: PR mergeado
    Done --> [*]

    InReview --> InProgress: verify detecta drift
```

## 3. Quién decide qué — humano vs IA

```mermaid
flowchart TB
    subgraph User["👤 El humano decide"]
        U1[Scope del cambio]
        U2[Trade-offs de diseño<br/>rationale de cada D-XX]
        U3[Aprobación para implementar]
        U4[Verificación manual]
        U5[Revisión final antes del merge]
    end

    subgraph AI["🤖 La IA ejecuta"]
        A1[Exploración del código<br/>búsqueda en codebase]
        A2[Generar artefactos<br/>proposal + design + specs + tasks]
        A3[Implementar tareas<br/>disciplina de checklist]
        A4[Build + tests<br/>detección de spec drift]
        A5[Archive + sync de specs]
    end

    U1 --> A1
    A1 --> U2
    U2 --> A2
    A2 --> U3
    U3 --> A3
    A3 --> A4
    A4 --> U4
    U4 --> A5
    A5 --> U5
    style User fill:#dbeafe
    style AI fill:#fce7f3
```

## 4. Artefactos como contrato

```mermaid
flowchart LR
    proposal[proposal.md<br/>POR QUÉ + Capacidades] -->|alimenta| design[design.md<br/>CÓMO + D-XX]
    proposal -->|alimenta| specs[specs/<br/>QUÉ + escenarios]
    design --> tasks[tasks.md<br/>EN QUÉ ORDEN]
    specs --> tasks
    tasks -->|guía| code[Implementación]
    specs -.->|verify contra| code
    code -->|al archivar| source[openspec/specs/<br/>Source of Truth]
    specs -.->|delta sync| source
    style proposal fill:#fef3c7
    style design fill:#fef3c7
    style specs fill:#fef3c7
    style tasks fill:#fef3c7
    style code fill:#dbeafe
    style source fill:#86efac
```
