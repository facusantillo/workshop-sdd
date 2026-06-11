<!--
Los títulos de PR usan Conventional Commits:
  feat(<scope>): descripción corta
  fix(<scope>): descripción corta
  docs(<scope>): descripción corta

Mantén el título bajo 70 caracteres. El detalle va en el body.
-->

## Resumen

<!-- 1-3 bullets sobre qué hace este cambio y por qué. -->

## Decisiones de diseño

<!-- Decisiones clave de openspec/changes/<name>/design.md. Pega la lista D-XX con resúmenes de una línea. -->

## Specs

<!-- Enlace a las specs archivadas en openspec/specs/ si este PR llegó vía /opsx:archive -->
- NEW: `openspec/specs/<capability>/spec.md`
- MODIFIED: `openspec/specs/<capability>/spec.md`

## Plan de tests

- [ ] `<comando de build>` clean
- [ ] `<comando de test>` verde
- [ ] `openspec validate <change-name>` válido
- [ ] `[MANUAL]` <lista cualquier validación in-environment>

## Fuera de scope

<!-- Lo que NO entra en este cambio intencionalmente. Ayuda a los revisores a calibrar. -->

Closes #<issue-number>
