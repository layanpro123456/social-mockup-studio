import React, { useState } from 'react';
import { MockupProject } from '../../models/types';
import { toPng, toJpeg } from 'html-to-image';
import { Download, ShieldCheck, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

interface ExportPanelProps {
  project: MockupProject;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ project, canvasRef }) => {
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleExport = async () => {
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
      link.download = `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_mockup.${format === 'jpeg' ? 'jpg' : 'png'}`;
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

  return (
    <div className="export-pane">
      <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.05em', color: '#9ca3af', textTransform: 'uppercase' }}>
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
            Visible <strong>FICTIONAL MOCKUP</strong> watermark will be rendered into exported media.
          </div>
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', marginTop: 8 }}
        >
          {isExporting ? (
            'Rendering...'
          ) : (
            <>
              <Download size={16} /> Export {format.toUpperCase()}
            </>
          )}
        </button>

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
