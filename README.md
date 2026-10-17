# Social Mockup Studio

A specification pack for a tool that creates **clearly fictional social-media-style mockups** as images and short videos. It is intended for demos, UI prototyping, education, storytelling, and content planning—not for creating deceptive evidence or impersonating real people.

## Documents
- `REQUIREMENTS.md` — product requirements and scope
- `PRODUCT_SPEC.md` — user flows, screens, and output behavior
- `ARCHITECTURE.md` — proposed technical design
- `SAFETY_AND_ABUSE_PREVENTION.md` — trust and safety requirements
- `TEST_PLAN.md` — acceptance tests and quality checks
- `IMPLEMENTATION_PLAN.md` — phased build plan
- `DATA_MODEL.md` — proposed data structures

## MVP recommendation
Build a responsive web app that lets users compose fictional posts, profiles, comments, and chat conversations, then export PNG/JPG mockups or short MP4/WebM clips. Use original, platform-inspired components rather than pixel-perfect copies of any platform. Put a visible `FICTIONAL MOCKUP` watermark on exports by default.

## Important boundaries
- Do not connect to or scrape social-media accounts.
- Do not use real platform login screens, authentication flows, or official logos in a way that implies authenticity.
- Do not generate fake proof of payment, verification, account ownership, threats, confessions, or other purported evidence.
- Do not support cloning a real person's identity or account.
- Keep a visible fictional/demo label in exported media.
