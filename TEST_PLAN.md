# Test Plan

## 1. Unit tests
- New projects contain fictional sample data and `mockup=true`.
- Required fields and character limits are validated.
- Imported JSON is schema-validated; invalid input is rejected safely.
- User text is rendered as text and cannot execute HTML or scripts.
- Watermark rendering is always enabled for export.
- Watermark position and contrast meet minimum readability requirements.
- Unsupported image/video formats produce understandable errors.

## 2. Component tests
- Template gallery selects the correct template.
- Editing a message updates the preview.
- Timeline reordering updates frame order.
- Export settings display the correct dimensions and duration.
- Keyboard navigation reaches all editor controls.
- Delete-project action asks for confirmation.

## 3. End-to-end acceptance tests
1. Create a fictional chat with two sample participants.
2. Edit messages and verify the preview updates.
3. Export a PNG and verify that `FICTIONAL MOCKUP` is visible.
4. Create a two-frame short clip and verify that the label appears in both frames.
5. Import a valid project JSON and verify the project loads.
6. Import malformed JSON and verify a safe error is shown.
7. Attempt to disable the watermark through UI and imported JSON; export must still retain it.
8. Verify that no login or third-party credentials are requested.
9. Test a narrow mobile viewport and a desktop viewport.
10. Test export failure and cancellation behavior.

## 4. Manual quality checks
- Text does not overflow or become unreadable.
- Long handles and messages wrap safely.
- Exported image matches preview dimensions.
- Video timing and transitions match the timeline.
- The fictional label remains visible against every background.
- No output falsely claims platform authenticity.
