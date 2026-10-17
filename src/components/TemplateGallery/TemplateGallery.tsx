import React from 'react';
import { TemplateKind } from '../../models/types';
import { TEMPLATE_METADATA } from '../../features/templates/templateDefaults';
import { MessageSquare, Layout, User, Smartphone, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateGalleryProps {
  currentTemplate: TemplateKind;
  onSelectTemplate: (template: TemplateKind) => void;
}

const ICONS: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare size={16} />,
  Layout: <Layout size={16} />,
  User: <User size={16} />,
  Smartphone: <Smartphone size={16} />,
  Video: <Video size={16} />,
};

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  currentTemplate,
  onSelectTemplate,
}) => {
  const templates = Object.entries(TEMPLATE_METADATA) as [TemplateKind, typeof TEMPLATE_METADATA[TemplateKind]][];

  return (
    <nav className="grid grid-cols-2 gap-2" aria-label="Template Formats">
      {templates.map(([key, item]) => {
        const isSelected = currentTemplate === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelectTemplate(key)}
            className={cn(
              'flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-all cursor-pointer',
              isSelected
                ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-sm'
                : 'border-slate-800/80 bg-slate-900/40 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
            )}
            title={`${item.name} — ${item.description}`}
            aria-pressed={isSelected}
          >
            <div
              className={cn(
                'w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors',
                isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
              )}
            >
              {ICONS[item.icon] || <Layout size={16} />}
            </div>
            <span className="text-xs font-semibold leading-tight truncate">{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
};

