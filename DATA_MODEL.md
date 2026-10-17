# Data Model

The following is a proposed TypeScript model. Validate imported JSON at runtime before use.

```ts
type TemplateKind =
  | "chat"
  | "feed-post"
  | "profile-card"
  | "story"
  | "short-video";

type MockupProject = {
  schemaVersion: 1;
  id: string;
  title: string;
  template: TemplateKind;
  mockup: true;
  createdAt: string;
  updatedAt: string;
  theme: {
    background: string;
    accent: string;
    fontFamily: string;
  };
  fictionalLabel: {
    text: "FICTIONAL MOCKUP";
    enabled: true;
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  };
  content: Record<string, unknown>;
  frames?: Array<{
    id: string;
    durationMs: number;
    transition: "cut" | "fade" | "slide";
    content: Record<string, unknown>;
  }>;
};
```

## Rules
- `mockup` must always be `true`.
- `fictionalLabel.enabled` must always be `true`.
- The label text must not be user-editable to an empty string.
- Validate every imported field and limit text and asset sizes.
- Treat all user content as untrusted.
- Keep the model free of third-party credentials and live account identifiers.
