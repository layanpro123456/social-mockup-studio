import React, { useState, useEffect, useRef } from 'react';
import { MockupProject, TemplateKind, ShortVideoFrame } from '../models/types';
import { createDefaultProject } from '../features/templates/templateDefaults';
import { TemplateGallery } from '../components/TemplateGallery/TemplateGallery';
import { ProjectEditor } from '../components/ProjectEditor/ProjectEditor';
import { PreviewCanvas } from '../components/PreviewCanvas/PreviewCanvas';
import { ExportPanel } from '../components/ExportPanel/ExportPanel';
import { TimelineEditor } from '../components/TimelineEditor/TimelineEditor';
import {
  saveProjectToLocal,
  loadProjectFromLocal,
  exportProjectAsJSON,
  importProjectFromJSON,
} from '../services/ProjectStorage';
import { recordCanvasToWebM } from '../services/VideoExportService';
import { toPng } from 'html-to-image';
import {
  Sparkles,
  FileDown,
  FileUp,
  RotateCcw,
  AlertOctagon,
  Copy,
  Trash2,
  ShieldCheck,
} from 'lucide-react';

export const App: React.FC = () => {
  const [project, setProject] = useState<MockupProject>(() => {
    const saved = loadProjectFromLocal();
    return saved || createDefaultProject('chat');
  });

  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save to localStorage on updates
  useEffect(() => {
    saveProjectToLocal(project);
  }, [project]);

  // Timeline playback simulation
  useEffect(() => {
    if (!isPlaying || project.template !== 'short-video') return;

    const frames = project.frames || [];
    if (frames.length === 0) return;

    const currentDuration = frames[activeFrameIndex]?.durationMs || 3000;
    const timer = setTimeout(() => {
      setActiveFrameIndex((prev) => (prev + 1) % frames.length);
    }, currentDuration);

    return () => clearTimeout(timer);
  }, [isPlaying, activeFrameIndex, project.template, project.frames]);

  const handleSelectTemplate = (template: TemplateKind) => {
    const newProj = createDefaultProject(template);
    setProject(newProj);
    setActiveFrameIndex(0);
    setIsPlaying(false);
    setImportError(null);
  };

  const handleReset = () => {
    if (window.confirm('Reset current mockup to default template values?')) {
      setProject(createDefaultProject(project.template));
      setActiveFrameIndex(0);
      setIsPlaying(false);
      setImportError(null);
    }
  };

  const handleDuplicate = () => {
    const duplicated: MockupProject = {
      ...project,
      id: `mockup_${Date.now()}`,
      title: `Copy of ${project.title}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProject(duplicated);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete project "${project.title}" and start fresh?`)) {
      const fresh = createDefaultProject('chat');
      setProject(fresh);
      setActiveFrameIndex(0);
      setIsPlaying(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await importProjectFromJSON(file);
    if (!result.project || result.errors.length > 0) {
      setImportError(`Failed to import: ${result.errors.join('; ')}`);
    } else {
      setProject(result.project);
      setActiveFrameIndex(0);
      setIsPlaying(false);
      setImportError(null);
    }
    // Reset file input
    e.target.value = '';
  };

  const handleUpdateFrames = (frames: ShortVideoFrame[]) => {
    setProject({
      ...project,
      frames,
    });
  };

  const handleVideoExport = async (
    onProgress: (p: { percent: number; message: string }) => void,
    isCancelled: () => boolean
  ): Promise<Blob> => {
    if (!canvasRef.current) throw new Error('Canvas element missing');

    const frames = project.frames || [];
    if (frames.length === 0) throw new Error('No frames found for short video export.');

    const initialFrame = activeFrameIndex;
    setIsPlaying(false);

    try {
      const frameImages: { dataUrl: string; durationMs: number }[] = [];

      // Snapshot each frame sequentially
      for (let i = 0; i < frames.length; i++) {
        if (isCancelled()) throw new Error('Export cancelled');

        setActiveFrameIndex(i);
        onProgress({
          percent: Math.round(((i + 1) / frames.length) * 40),
          message: `Capturing frame ${i + 1} of ${frames.length}...`,
        });

        // Small delay for DOM to re-render frame
        await new Promise((r) => setTimeout(r, 120));

        const dataUrl = await toPng(canvasRef.current, { cacheBust: true, pixelRatio: 2 });
        frameImages.push({
          dataUrl,
          durationMs: frames[i].durationMs || 3000,
        });
      }

      // Record captured snapshots into WebM
      const blob = await recordCanvasToWebM(
        frameImages,
        (prog) => {
          onProgress({
            percent: 40 + Math.round(prog.percent * 0.6),
            message: prog.message,
          });
        },
        isCancelled
      );

      return blob;
    } finally {
      setActiveFrameIndex(initialFrame);
    }
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="app-header">
        <div className="header-brand">
          <Sparkles color="#6366f1" size={22} />
          <h1>Social Mockup Studio</h1>
          <span className="safety-pill">Fictional Mode Enforced</span>
        </div>

        <div className="header-actions">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            style={{ display: 'none' }}
          />

          <button
            type="button"
            onClick={handleDuplicate}
            className="btn-secondary"
            title="Duplicate Current Project"
          >
            <Copy size={14} /> Duplicate
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary"
            title="Reset to Template Defaults"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            className="btn-secondary"
            title="Import Valid Project JSON"
          >
            <FileUp size={14} /> Import JSON
          </button>
          <button
            type="button"
            onClick={() => exportProjectAsJSON(project)}
            className="btn-secondary"
            title="Export Schema JSON"
          >
            <FileDown size={14} /> Export JSON
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="btn-secondary"
            style={{ color: '#ef4444' }}
            title="Delete Project"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </header>

      {/* Safety Policy Reminder Bar */}
      <div
        style={{
          backgroundColor: 'rgba(30, 41, 59, 0.7)',
          borderBottom: '1px solid #1e293b',
          padding: '6px 24px',
          fontSize: 11,
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <ShieldCheck size={14} color="#38bdf8" />
        <span>
          <strong>Ethical Boundary Reminder:</strong> Generated outputs are synthetic prototypes. Do not
          create deceptive evidence or impersonate real people. Watermarks remain active on all exports.
        </span>
      </div>

      {/* Global Error Banner */}
      {importError && (
        <div
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '10px 24px',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertOctagon size={16} />
            <span>{importError}</span>
          </div>
          <button
            onClick={() => setImportError(null)}
            style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Studio Body */}
      <div className="main-content">
        {/* Left Column: Templates & Editor */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">1. Select Template</div>
            <TemplateGallery
              currentTemplate={project.template}
              onSelectTemplate={handleSelectTemplate}
            />
          </div>

          <div className="sidebar-section" style={{ flex: 1 }}>
            <div className="sidebar-title">2. Customize Content</div>
            <ProjectEditor project={project} onChange={setProject} />
          </div>
        </aside>

        {/* Center: Live Canvas Viewport with Timeline Tray */}
        <main
          className="canvas-viewport"
          style={{
            flexDirection: 'column',
            padding: project.template === 'short-video' ? '20px 20px 0 20px' : '32px',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: 0,
            }}
          >
            <PreviewCanvas
              ref={canvasRef}
              project={project}
              activeFrameIndex={activeFrameIndex}
            />
          </div>

          {/* Timeline Editor for Short Video Template */}
          {project.template === 'short-video' && (
            <div style={{ width: '100%', maxWidth: 780, marginTop: 14 }}>
              <TimelineEditor
                frames={project.frames || []}
                activeFrameIndex={activeFrameIndex}
                isPlaying={isPlaying}
                onSelectFrame={setActiveFrameIndex}
                onTogglePlay={() => setIsPlaying((p) => !p)}
                onUpdateFrames={handleUpdateFrames}
              />
            </div>
          )}
        </main>

        {/* Right: Export Controls */}
        <ExportPanel
          project={project}
          canvasRef={canvasRef}
          onExportVideo={handleVideoExport}
        />
      </div>
    </div>
  );
};
