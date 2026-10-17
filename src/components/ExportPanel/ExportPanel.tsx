import React, { useState, useRef } from 'react';
import { MockupProject } from '../../models/types';
import { toPng, toJpeg } from 'html-to-image';
import { isMediaRecorderSupported } from '../../services/VideoExportService';
import {
  Download,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Video,
  XCircle,
} from 'lucide-react';

interface ExportPanelProps {
  project: MockupProject;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onExportVideo?: (
    onProgress: (p: { percent: number; message: string }) => void,
    isCancelled: () => boolean
  ) => Promise<Blob>;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  project,
  canvasRef,
  onExportVideo,
}) => {
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<{ percent: number; message: string } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const cancelExportRef = useRef(false);

  const isVideoSupported = isMediaRecorderSupported();

  const handleExportImage = async () => {
    if (!canvasRef.current) {
      setIsError(true);
      setStatusMessage('Canvas element not found for export.');
      return;
    }

    // Verify watermark exists in DOM
    const watermark = canvasRef.current.querySelector('[data-testid="fictional-mockup-watermark"]');
    if (!watermark) {
      setIsError(true);
      setStatusMessage('Safety violation: Watermark must be present on export canvas.');
      return;
    }

    try {
      setIsExporting(true);
      setStatusMessage('Generating high-resolution mockup...');
      setIsError(false);

      const dataUrl =
        format === 'png'
          ? await toPng(canvasRef.current, { cacheBust: true, pixelRatio: 2 })
          : await toJpeg(canvasRef.current, { quality: 0.95, pixelRatio: 2 });

      const link = document.createElement('a');
      link.download = `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_mockup.${
        format === 'jpeg' ? 'jpg' : 'png'
      }`;
      link.href = dataUrl;
      link.click();

      setStatusMessage('Export complete with fictional label.');
    } catch (err) {
      setIsError(true);
      setStatusMessage(`Export failed: ${(err as Error).message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportVideo = async () => {
    if (!onExportVideo) return;
    cancelExportRef.current = false;
    setIsExporting(true);
    setIsError(false);
    setStatusMessage(null);
    setExportProgress({ percent: 10, message: 'Preparing video frames...' });

    try {
      const blob = await onExportVideo(
        (progress) => setExportProgress(progress),
        () => cancelExportRef.current
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_mockup.webm`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      setStatusMessage('WebM video clip exported with fictional watermark in every frame!');
    } catch (err) {
      setIsError(true);
      setStatusMessage(`Video export failed: ${(err as Error).message}`);
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  const handleCancelExport = () => {
    cancelExportRef.current = true;
  };

  return (
    <div className="export-pane">
      <div
        style={{
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: '0.05em',
          color: '#9ca3af',
          textTransform: 'uppercase',
        }}
      >
        Export Studio
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>
            Image Format
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              onClick={() => setFormat('png')}
              className={format === 'png' ? 'btn-primary' : 'btn-secondary'}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              PNG (Lossless)
            </button>
            <button
              type="button"
              onClick={() => setFormat('jpeg')}
              className={format === 'jpeg' ? 'btn-primary' : 'btn-secondary'}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              JPG
            </button>
          </div>
        </div>

        {/* Safety Invariant Notice */}
        <div
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 8,
            padding: 12,
            fontSize: 12,
            color: '#34d399',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <ShieldCheck size={16} /> Trust & Safety Verified
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
            Visible <strong>FICTIONAL MOCKUP</strong> watermark will be rendered into all exported images
            and video frames.
          </div>
        </div>

        {/* Image Export Button */}
        <button
          type="button"
          onClick={handleExportImage}
          disabled={isExporting}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '10px 16px' }}
        >
          <Download size={16} /> Export Image ({format.toUpperCase()})
        </button>

        {/* Video Export Option for Short Video Template */}
        {project.template === 'short-video' && (
          <div
            style={{
              paddingTop: 12,
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Video size={14} /> Short Video Clip Export
            </div>

            {isVideoSupported ? (
              <button
                type="button"
                onClick={handleExportVideo}
                disabled={isExporting}
                className="btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '10px 16px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  borderColor: '#0284c7',
                  color: '#e0f2fe',
                }}
              >
                <Video size={16} /> Export Animated WebM
              </button>
            ) : (
              <div style={{ fontSize: 11, color: '#f59e0b', padding: '6px 10px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: 6 }}>
                WebM recording not supported on this browser engine.
              </div>
            )}
          </div>
        )}

        {/* Export Progress Bar */}
        {isExporting && exportProgress && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              padding: 10,
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: 6,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}>
              <span>{exportProgress.message}</span>
              <span>{exportProgress.percent}%</span>
            </div>
            <div style={{ height: 6, backgroundColor: '#374151', borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${exportProgress.percent}%`,
                  backgroundColor: '#6366f1',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
            <button
              type="button"
              onClick={handleCancelExport}
              style={{
                alignSelf: 'flex-end',
                color: '#ef4444',
                fontSize: 11,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 4,
              }}
            >
              <XCircle size={12} /> Cancel
            </button>
          </div>
        )}

        {statusMessage && (
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              fontSize: 12,
              backgroundColor: isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: isError ? '#fca5a5' : '#6ee7b7',
              border: `1px solid ${isError ? '#ef4444' : '#10b981'}`,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {isError ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
            <span>{statusMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
