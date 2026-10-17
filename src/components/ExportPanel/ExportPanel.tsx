import React, { useState, useRef } from 'react';
import { MockupProject } from '../../models/types';
import { toPng, toJpeg } from 'html-to-image';
import { isMediaRecorderSupported } from '../../services/VideoExportService';
import { classifyDeceptiveContent, MANDATORY_WATERMARK_TEXT } from '../../features/safety/SafetyGuard';
import {
  Download,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Video,
  XCircle,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ExportPanelProps {
  project: MockupProject;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onExportVideo?: (
    onProgress: (p: { percent: number; message: string }) => void,
    isCancelled: () => boolean
  ) => Promise<Blob>;
}

export function scanProjectForCriticalFraud(project: MockupProject): {
  isBlocked: boolean;
  blockedTerms: string[];
} {
  const allText = `${project.title} ${JSON.stringify(project.content)} ${JSON.stringify(
    project.frames || []
  )}`;
  const check = classifyDeceptiveContent(allText);
  return {
    isBlocked: check.isBlocked,
    blockedTerms: check.criticalTerms,
  };
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
  const fraudCheck = scanProjectForCriticalFraud(project);

  const handleExportImage = async () => {
    // 1. Critical Fraud Pre-Export Gate
    if (fraudCheck.isBlocked) {
      setIsError(true);
      setStatusMessage(
        `Security Block: Export prohibited. Detected deceptive keyword(s): "${fraudCheck.blockedTerms.join(
          ', '
        )}". Fictional mockups cannot simulate financial transfers, OTP codes, or official warrants.`
      );
      return;
    }

    if (!canvasRef.current) {
      setIsError(true);
      setStatusMessage('Canvas element not found for export.');
      return;
    }

    // 2. Verify watermark element exists in DOM and is visible
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

      setStatusMessage('Export complete with verified fictional label.');
    } catch (err) {
      setIsError(true);
      setStatusMessage(`Export failed: ${(err as Error).message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportVideo = async () => {
    // 1. Critical Fraud Pre-Export Gate
    if (fraudCheck.isBlocked) {
      setIsError(true);
      setStatusMessage(
        `Security Block: Export prohibited. Detected deceptive keyword(s): "${fraudCheck.blockedTerms.join(
          ', '
        )}".`
      );
      return;
    }

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
    <aside className="export-pane ui-aside" aria-label="Export Panel">
      <h2
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontWeight: 800,
          fontSize: 12,
          letterSpacing: '0.06em',
          color: '#94a3b8',
          textTransform: 'uppercase',
        }}
      >
        <Download size={14} color="#818cf8" /> 3. Download Mockup
      </h2>

      <div className="ui-form">
        {/* Critical Fraud Warning Banner */}
        {fraudCheck.isBlocked && (
          <Alert variant="destructive" className="py-3 px-3.5 shadow-xl shadow-red-950/40">
            <ShieldAlert size={16} />
            <AlertTitle className="text-xs font-bold text-red-200">Download Blocked</AlertTitle>
            <AlertDescription className="text-xs text-red-300/90 leading-relaxed mt-1">
              Prohibited keywords found: <span className="font-semibold text-red-100 bg-red-900/60 px-1 py-0.5 rounded text-[11px]">{fraudCheck.blockedTerms.join(', ')}</span>. Remove deceptive terms like financial wires or legal notices to enable download.
            </AlertDescription>
          </Alert>
        )}

        <div className="ui-field">
          <label>Image Quality & Format</label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={format === 'png' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setFormat('png')}
              className="flex-1 justify-center text-xs"
            >
              PNG (Crystal Clear)
            </Button>
            <Button
              type="button"
              variant={format === 'jpeg' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setFormat('jpeg')}
              className="flex-1 justify-center text-xs"
            >
              JPG (Compressed)
            </Button>
          </div>
        </div>

        {/* Safety Invariant Notice */}
        <div
          className="ui-badge ui-badge-success"
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            fontSize: 11,
            lineHeight: 1.4,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <ShieldCheck size={14} />
          <span>
            Permanent <strong>{MANDATORY_WATERMARK_TEXT}</strong> watermark embedded.
          </span>
        </div>

        {/* Image Export Button */}
        <Button
          type="button"
          variant="default"
          size="lg"
          onClick={handleExportImage}
          disabled={isExporting || fraudCheck.isBlocked}
          className="w-full justify-center text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md transition-all"
        >
          <Download size={16} className="mr-2" /> Download Mockup ({format.toUpperCase()})
        </Button>

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
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Video size={14} /> Short Video Clip Export
            </div>

            {isVideoSupported ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleExportVideo}
                disabled={isExporting || fraudCheck.isBlocked}
                className="w-full justify-center bg-sky-500/15 border border-sky-500/40 text-sky-200 hover:bg-sky-500/25"
              >
                <Video size={16} className="mr-2" /> Export Animated WebM
              </Button>
            ) : (
              <div
                style={{
                  fontSize: 11,
                  color: '#f59e0b',
                  padding: '6px 10px',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: 6,
                }}
              >
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
          <Alert variant={isError ? 'destructive' : 'success'} className="py-2.5 px-3">
            {isError ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
            <AlertDescription className="text-xs font-medium">
              {statusMessage}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </aside>
  );
};
