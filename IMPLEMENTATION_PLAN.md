# Implementation Plan

## Phase 1 — Foundation
- Create the React + TypeScript + Vite project.
- Add formatting, linting, and test commands.
- Define typed project/template models.
- Build a responsive application shell.

**Done when:** app starts locally and unit tests run.

## Phase 2 — Image mockups
- Implement generic chat, feed post, and profile-card templates.
- Add editable fields and live preview.
- Add a persistent fictional watermark.
- Implement PNG export and validate the result.

**Done when:** a user can edit and export a labeled PNG.

## Phase 3 — Projects
- Add local draft persistence.
- Add import/export of schema-validated project JSON.
- Add duplicate, rename, and delete project actions.

**Done when:** projects survive refresh and malformed imports fail safely.

## Phase 4 — Short video
- Add frame timeline, duration controls, and simple transitions.
- Implement a browser-supported video export proof of concept.
- Keep the fictional label visible in every frame.
- Document browser/codec limitations.

**Done when:** a short labeled clip can be previewed and exported in supported browsers.

## Phase 5 — Quality and release
- Complete unit, component, and end-to-end tests.
- Check keyboard accessibility and mobile layout.
- Review safety checklist.
- Write setup, usage, and troubleshooting instructions.

**Done when:** all acceptance criteria in `REQUIREMENTS.md` and tests in `TEST_PLAN.md` pass.

## Build priorities
1. Reliable PNG export.
2. Clear fictional labeling.
3. Simple, editable templates.
4. Project persistence.
5. Short-video export after a browser compatibility proof of concept.
