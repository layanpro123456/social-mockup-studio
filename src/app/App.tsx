import React, { useState, useEffect, useRef } from 'react';
import { MockupProject, TemplateKind } from '../models/types';
import { createDefaultProject } from '../features/templates/templateDefaults';
import { TemplateGallery } from '../components/TemplateGallery/TemplateGallery';
import { ProjectEditor } from '../components/ProjectEditor/ProjectEditor';
import { PreviewCanvas } from '../components/PreviewCanvas/PreviewCanvas';
import { ExportPanel } from '../components/ExportPanel/ExportPanel';
import {
  saveProjectToLocal,
  loadProjectFromLocal,
  exportProjectAsJSON,
  importProjectFromJSON,
} from '../services/ProjectStorage';
import { Sparkles, FileDown, FileUp, RotateCcw, AlertOctagon } from 'lucide-react';

export const App: React.FC = () => {
  const [project, setProject] = useState<MockupProject>(() => {
    const saved = loadProjectFromLocal();
    return saved || createDefaultProject('chat');
  });

  const [importError, setImportError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save to localStorage on updates
  useEffect(() => {
    saveProjectToLocal(project);
  }, [project]);

  const handleSelectTemplate = (template: TemplateKind) => {
    const newProj = createDefaultProject(template);
    setProject(newProj);
    setImportError(null);
  };

  const handleReset = () => {
    if (window.confirm('Reset current mockup to default sample values?')) {
      setProject(createDefaultProject(project.template));
      setImportError(null);
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
      setImportError(null);
    }
    // Reset file input
    e.target.value = '';
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

          <button type="button" onClick={handleReset} className="btn-secondary" title="Reset to Template Defaults">
            <RotateCcw size={14} /> Reset
          </button>
          <button type="button" onClick={handleImportClick} className="btn-secondary" title="Import Valid Project JSON">
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
        </div>
      </header>

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

        {/* Center: Live Canvas Viewport */}
        <main className="canvas-viewport">
          <PreviewCanvas ref={canvasRef} project={project} />
        </main>

        {/* Right: Export Controls */}
        <ExportPanel project={project} canvasRef={canvasRef} />
      </div>
    </div>
  );
};
