# Product Specification

## 1. Main navigation
- **Projects:** recent mockup projects and “New project”.
- **Templates:** generic chat, feed post, profile card, story, comment thread, short-video frame.
- **Editor:** content fields, preview, styling controls, timeline when using video.
- **Export:** image/video format, dimensions, duration, watermark preview.

## 2. Core user flow
1. Select a generic template.
2. Enter fictional content or generate sample content.
3. Customize colors, spacing, avatar, and typography.
4. Preview the result with the fictional label visible.
5. For video, arrange frames and set each frame's duration/transition.
6. Export and review the finished file.

## 3. Template requirements
### Chat conversation
- Conversation title must be fictional or clearly labeled as a sample.
- Each message contains sender ID, text, timestamp, and optional delivery-state styling.
- Use generic message bubbles; do not imply the output is an authentic WhatsApp export.
- Include a persistent `FICTIONAL MOCKUP` label.

### Feed post
- Fields: fictional display name, fictional handle, avatar, caption, optional image, comments, and reactions.
- Do not include platform verification marks.
- Use a generic social feed layout.

### Short-video mockup
- Fields: fictional creator, caption, audio label (optional), frame sequence, and duration.
- Use original icons and generic controls rather than copied platform assets.
- The fictional label remains visible in every frame.

### Profile card
- Fictional name, handle, bio, follower count marked as sample data, and optional abstract avatar.
- Avoid claims of real verification or real follower metrics.

## 4. Editor behavior
- Changes update the preview immediately.
- Validate required fields and character limits.
- Provide undo/redo for content edits if practical.
- Warn before leaving with unsaved changes.
- Watermark cannot be disabled in exported files.
- Allow the user to choose watermark position and style within readability limits.

## 5. Export behavior
- Images: PNG first; JPG optional.
- Video: WebM or MP4 based on supported browser/runtime capabilities.
- Default clip duration: 5–15 seconds; configurable within a safe maximum such as 30 seconds.
- Show progress, cancel, and clear errors.
- Include a `mockup=true` project flag in project JSON.
- Exports should not include fabricated platform signatures, cryptographic authenticity claims, or fake verification indicators.
