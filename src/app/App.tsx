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
  AlertTriangle,
  CheckCircle2,
  Copy,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'destructive';
  title: string;
  description?: string;
}

export const App: React.FC = () => {
  const [project, setProject] = useState<MockupProject>(() => {
    const saved = loadProjectFromLocal();
    return saved || createDefaultProject('chat');
  });

  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

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
    showToast({
      type: 'info',
      title: 'Template Selected',
      description: `Loaded ${template} format.`,
    });
  };

  const confirmReset = () => {
    setProject(createDefaultProject(project.template));
    setActiveFrameIndex(0);
    setIsPlaying(false);
    setImportError(null);
    setResetDialogOpen(false);
    showToast({
      type: 'warning',
      title: 'Template Reset',
      description: 'Mockup restored to default template structure.',
    });
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
    showToast({
      type: 'success',
      title: 'Mockup Duplicated',
      description: `Created "${duplicated.title}".`,
    });
  };

  const confirmDelete = () => {
    const fresh = createDefaultProject('chat');
    setProject(fresh);
    setActiveFrameIndex(0);
    setIsPlaying(false);
    setDeleteDialogOpen(false);
    showToast({
      type: 'info',
      title: 'New Canvas Started',
      description: 'Canvas cleared. Ready with fresh Generic Chat.',
    });
  };

  const handleSaveProject = () => {
    exportProjectAsJSON(project);
    showToast({
      type: 'info',
      title: 'Project Saved',
      description: `Exported "${project.title}.json" file.`,
    });
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
      showToast({
        type: 'success',
        title: 'Project Imported',
        description: `Successfully loaded "${result.project.title}".`,
      });
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
      <header className="app-header ui-header">
        <div className="header-brand">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
            }}
          >
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1>Social Mockup Studio</h1>
              <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 text-[11px]">
                Fictional Mode Enforced
              </Badge>
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1, fontWeight: 500 }}>
              Design realistic posts & chats for stories, prototypes & presentations
            </div>
          </div>
        </div>

        <nav className="header-actions" aria-label="Project Actions">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            style={{ display: 'none' }}
          />

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleDuplicate}
            title="Duplicate Current Mockup"
          >
            <Copy size={13} className="mr-1.5" /> Duplicate
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setResetDialogOpen(true)}
            title="Reset to Template Defaults"
          >
            <RotateCcw size={13} className="mr-1.5" /> Start Fresh
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleImportClick}
            title="Open Saved Mockup Project (.json)"
          >
            <FileUp size={13} className="mr-1.5" /> Open File
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleSaveProject}
            title="Save Project File to Computer (.json)"
          >
            <FileDown size={13} className="mr-1.5" /> Save Project
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8"
            title="Delete Project & Start Fresh"
          >
            <Trash2 size={13} />
          </Button>
        </nav>
      </header>

      {/* Safety Policy Reminder Sub-Bar */}
      <aside
        role="status"
        aria-label="Safety Policy"
        style={{
          backgroundColor: '#0a0f1d',
          borderBottom: '1px solid #1a2538',
          padding: '5px 24px',
          fontSize: 11,
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <ShieldCheck size={13} color="#38bdf8" />
        <span>
          <strong>Ethical Boundary Reminder:</strong> All mockups are synthetic prototypes. Permanent "FICTIONAL MOCKUP" label is automatically applied.
        </span>
      </aside>

      {/* Global Error Banner */}
      {importError && (
        <Alert variant="destructive" className="rounded-none border-x-0 border-t-0 py-2.5 px-6 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <AlertOctagon className="h-4 w-4 shrink-0 text-red-400" />
            <div>
              <AlertTitle className="text-xs font-semibold text-red-200">Import Failed</AlertTitle>
              <AlertDescription className="text-xs font-medium text-red-300">{importError}</AlertDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setImportError(null)}
            className="h-7 px-2.5 text-xs text-red-200 hover:bg-red-500/20"
          >
            Dismiss
          </Button>
        </Alert>
      )}

      {/* Main Studio Body */}
      <div className="main-content">
        {/* Left Column: Templates & Editor */}
        <aside className="sidebar ui-aside" aria-label="Mockup Design Tools">
          <section className="sidebar-section">
            <h2 className="sidebar-title">1. Choose a Format</h2>
            <TemplateGallery
              currentTemplate={project.template}
              onSelectTemplate={handleSelectTemplate}
            />
          </section>

          <section className="sidebar-section" style={{ flex: 1 }}>
            <h2 className="sidebar-title">2. Edit Mockup</h2>
            <ProjectEditor project={project} onChange={setProject} />
          </section>
        </aside>

        {/* Center: Live Canvas Viewport with Timeline Tray */}
        <main
          className="canvas-viewport ui-main"
          role="main"
          aria-label="Mockup Canvas Preview"
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

      {/* Alert Dialog: Reset Template Confirmation */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-2.5 text-amber-400 mb-1">
              <RotateCcw className="h-5 w-5" />
              <AlertDialogTitle className="text-base text-slate-100 font-semibold">
                Reset Mockup to Defaults?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-slate-300 text-xs leading-relaxed">
              This will revert all fields and content in the current <strong className="text-white capitalize">{project.template}</strong> template back to initial sample state. Any unsaved edits will be discarded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReset}
              className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-lg shadow-amber-600/30"
            >
              Yes, Reset Template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog: Delete Project Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-2.5 text-red-400 mb-1">
              <Trash2 className="h-5 w-5" />
              <AlertDialogTitle className="text-base text-slate-100 font-semibold">
                Delete Project & Start Fresh?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-slate-300 text-xs leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{project.title}"</strong>? This will erase the current canvas and start a fresh Generic Chat mockup.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-500 text-white font-medium text-xs shadow-lg shadow-red-600/30"
            >
              Yes, Delete & Start Fresh
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Floating Toast Notification Stack */}
      <div
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-3 fade-in',
              t.type === 'success' && 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100 shadow-emerald-500/10',
              t.type === 'info' && 'bg-sky-950/90 border-sky-500/50 text-sky-100 shadow-sky-500/10',
              t.type === 'warning' && 'bg-amber-950/90 border-amber-500/50 text-amber-100 shadow-amber-500/10',
              t.type === 'destructive' && 'bg-red-950/90 border-red-500/50 text-red-100 shadow-red-500/10'
            )}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              {t.type === 'info' && <Sparkles className="h-4 w-4 text-sky-400" />}
              {t.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-400" />}
              {t.type === 'destructive' && <AlertOctagon className="h-4 w-4 text-red-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold leading-tight">{t.title}</p>
              {t.description && (
                <p className="text-[11px] opacity-85 mt-0.5 leading-snug">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              className="shrink-0 text-xs opacity-60 hover:opacity-100 p-0.5 text-current rounded"
              aria-label="Dismiss toast"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
