# Proposed Architecture

## 1. MVP stack
A lightweight, client-side web app is recommended to work on modest hardware and avoid hosting costs.

- **UI:** React 19 + TypeScript + Vite 6 + shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS + PostCSS + CSS variables
- **State:** React state + hooks
- **Image export:** html-to-image DOM rasterizer
- **Video export:** frame capture plus browser-supported WebM recording
- **Persistence:** browser local storage
- **Tests:** Vitest + React Testing Library (jsdom)

Avoid a backend in the MVP. If a backend is added later, define retention, access control, and deletion policies before storing user projects.

## 2. High-level modules
- `TemplateGallery`: lists generic layouts.
- `ProjectEditor`: edits content and design.
- `PreviewCanvas`: renders the output preview and persistent label.
- `TimelineEditor`: orders frames and sets durations.
- `ExportService`: exports images/video and reports errors.
- `ProjectStorage`: saves/loads project JSON locally.
- `SafetyGuard`: validates content and ensures required labeling remains enabled.

## 3. Suggested folder structure
```text
src/
  app/
  components/
    TemplateGallery/
    ProjectEditor/
    PreviewCanvas/
    TimelineEditor/
    ExportPanel/
  features/
    projects/
    templates/
    rendering/
    safety/
  models/
  services/
  styles/
  tests/
public/
docs/
```

## 4. Data flow
1. User chooses a template.
2. Template creates a typed project object with fictional defaults.
3. Editor updates the project state.
4. Preview renders from the same project state.
5. Safety checks validate required mockup label and disallowed authenticity claims.
6. Export service renders the preview/timeline.
7. Exported file retains visible labeling.

## 5. Engineering notes
- Treat imported project JSON as untrusted input; validate its schema.
- Sanitize text before rendering and never inject user content as raw HTML.
- Limit uploaded asset size and accepted file types.
- Use object URLs carefully and revoke them when no longer needed.
- Feature-detect codecs instead of assuming MP4/WebM support.
- Keep rendering isolated from network requests.
- Do not store passwords, session cookies, or third-party account tokens.
