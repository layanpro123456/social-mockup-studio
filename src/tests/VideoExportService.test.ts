import { describe, it, expect } from 'vitest';
import { isMediaRecorderSupported, recordCanvasToWebM } from '../services/VideoExportService';

describe('VideoExportService', () => {
  it('correctly reports MediaRecorder support in node/jsdom test environment', () => {
    // In standard jsdom without browser MediaRecorder polyfill, it should safely return false without throwing
    const supported = isMediaRecorderSupported();
    expect(typeof supported).toBe('boolean');
  });

  it('rejects recording when MediaRecorder is not supported', async () => {
    await expect(recordCanvasToWebM([])).rejects.toThrow(
      /Video recording .* is not supported in this browser/
    );
  });
});
