# Product Requirements — Social Mockup Studio

## 1. Purpose
Create a web application for generating fictional social-media-style content mockups, including screenshots and short animated clips. Supported formats may include chat conversations, feed posts, profile cards, short-video layouts, comments, reactions, and story-style frames.

The application must make it easy to create fictional content while ensuring exported media is not easily mistaken for authentic platform records.

## 2. Target users
- UI/UX designers preparing prototypes
- Teachers and trainers creating examples
- Video creators producing fictional scenes
- Marketers storyboarding sample content
- Developers testing layouts with synthetic data

## 3. Product principles
1. **Fictional by default:** use invented names, handles, avatars, timestamps, and messages.
2. **Transparent output:** exported images and videos display a clear `FICTIONAL MOCKUP` label.
3. **No real-account access:** no login to third-party social networks and no scraping.
4. **No identity impersonation:** do not recreate a real person's account or claim that a fictional post is authentic.
5. **User control:** allow editing, previewing, and deleting projects and exports.

## 4. MVP features
### 4.1 Project creation
- Create, rename, duplicate, and delete a mockup project.
- Choose a canvas preset: square post, portrait post, story, chat screen, profile card, or short-video frame.
- Choose a generic visual theme inspired by common social-media patterns, not an exact clone of a platform's current UI.

### 4.2 Fictional content editor
- Edit display name, fictional handle, bio, post text, comments, reactions, and timestamps.
- Add synthetic chat messages with sender, text, and relative timestamp.
- Select from built-in abstract avatars or upload assets the user has rights to use.
- Generate sample data using fictional names and clearly synthetic handles.
- Provide a “randomize sample content” action.
- Include accessibility labels and keyboard navigation.

### 4.3 Image export
- Preview output before export.
- Export PNG and JPG at common aspect ratios.
- Include a visible `FICTIONAL MOCKUP` watermark by default.
- Keep the watermark readable at normal viewing size.
- Add metadata identifying the file as generated mockup content where supported.

### 4.4 Short-video export
- Build a sequence of frames or messages on a timeline.
- Set duration, transition, and simple animation (fade, slide, typing indicator).
- Export a short MP4 or WebM clip when supported by the chosen implementation.
- Keep a visible mockup label throughout the clip, not only on the opening frame.
- Provide a preview and cancel/retry feedback during rendering.

### 4.5 Project management
- Save drafts locally in the browser for the MVP.
- Import/export a project as a JSON file.
- Clearly warn users not to put sensitive personal information into projects.
- Provide a delete-project action.

## 5. Non-functional requirements
- Responsive on desktop and mobile browsers.
- Core editor usable with keyboard and screen readers.
- Reasonable rendering performance on modest computers.
- Validate and sanitize user-entered text.
- Avoid uploading user assets to a server in the MVP unless required and clearly disclosed.
- Handle unsupported codecs and export failures with helpful messages.
- Do not require paid APIs for core functionality.

## 6. Out of scope
- Connecting to WhatsApp, Facebook, Instagram, TikTok, or other live services.
- Scraping profiles, messages, or posts.
- Generating exact replicas of platform interfaces or official verification badges.
- Removing the mockup watermark.
- Creating fabricated evidence, fake receipts, fake account verification, or deceptive screenshots intended to pass as genuine.
- Using real people's likenesses or names to imply they authored fictional content.

## 7. Acceptance criteria
- A user can create and edit a fictional post or conversation without creating an account.
- A user can preview a mockup and export a PNG/JPG.
- A user can assemble at least two frames and export a short clip if video rendering is supported.
- All exports visibly identify themselves as fictional mockups.
- The app rejects or warns on attempts to remove required labeling or create authenticity claims.
- No third-party social account credentials are requested or stored.
