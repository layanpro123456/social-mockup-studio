import { MockupProject } from '../models/types';
import { MANDATORY_WATERMARK_TEXT } from '../features/safety/SafetyGuard';

export interface VideoExportProgress {
  percent: number;
  message: string;
}

export function isMediaRecorderSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.MediaRecorder !== 'undefined' &&
    typeof HTMLCanvasElement !== 'undefined' &&
    typeof HTMLCanvasElement.prototype.captureStream === 'function'
  );
}

export async function recordCanvasToWebM(
  frameImages: { dataUrl: string; durationMs: number }[],
  onProgress?: (progress: VideoExportProgress) => void,
  isCancelled?: () => boolean
): Promise<Blob> {
  if (!isMediaRecorderSupported()) {
    throw new Error('Video recording (MediaRecorder / captureStream) is not supported in this browser.');
  }

  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 1280;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2D canvas context.');

  const stream = canvas.captureStream(30);
  const recordedChunks: Blob[] = [];

  // Determine supported mimeType
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : MediaRecorder.isTypeSupported('video/webm')
    ? 'video/webm'
    : '';

  const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  return new Promise<Blob>(async (resolve, reject) => {
    recorder.onerror = (err) => reject(err);

    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      resolve(blob);
    };

    recorder.start();

    try {
      const totalFrames = frameImages.length;

      for (let i = 0; i < totalFrames; i++) {
        if (isCancelled && isCancelled()) {
          recorder.stop();
          return reject(new Error('Export was cancelled by user.'));
        }

        const { dataUrl, durationMs } = frameImages[i];
        onProgress?.({
          percent: Math.round(((i + 1) / totalFrames) * 90),
          message: `Encoding frame ${i + 1} of ${totalFrames}...`,
        });

        // Load image onto canvas
        await new Promise<void>((res, rej) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Redundant Safety Invariant: Burn watermark into video stream directly
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            ctx.fillRect(canvas.width - 260, canvas.height - 60, 240, 44);
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2;
            ctx.strokeRect(canvas.width - 260, canvas.height - 60, 240, 44);
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 18px sans-serif';
            ctx.fillText(MANDATORY_WATERMARK_TEXT, canvas.width - 240, canvas.height - 32);

            res();
          };
          img.onerror = rej;
          img.src = dataUrl;
        });

        // Hold frame for durationMs
        await new Promise((r) => setTimeout(r, Math.min(durationMs, 10000)));
      }

      onProgress?.({ percent: 98, message: 'Finalizing WebM clip...' });
      recorder.stop();
    } catch (error) {
      recorder.stop();
      reject(error);
    }
  });
}
