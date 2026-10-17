import React from 'react';
import { TemplateKind } from '../../models/types';
import { TEMPLATE_METADATA } from '../../features/templates/templateDefaults';
import { MessageSquare, Layout, User, Smartphone, Video } from 'lucide-react';

interface TemplateGalleryProps {
  currentTemplate: TemplateKind;
  onSelectTemplate: (template: TemplateKind) => void;
}

const ICONS: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare size={20} />,
  Layout: <Layout size={20} />,
  User: <User size={20} />,
  Smartphone: <Smartphone size={20} />,
  Video: <Video size={20} />,
};

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  currentTemplate,
  onSelectTemplate,
}) => {
  const templates = Object.entries(TEMPLATE_METADATA) as [TemplateKind, typeof TEMPLATE_METADATA[TemplateKind]][];

  return (
    <nav className="ui-cards-grid" aria-label="Template Formats">
      {templates.map(([key, item]) => {
        const isSelected = currentTemplate === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelectTemplate(key)}
            className={`ui-card-btn ${isSelected ? 'active' : ''}`}
            title={`${item.name} — ${item.description}`}
            aria-pressed={isSelected}
          >
            <div className="ui-card-icon">
              {ICONS[item.icon] || <Layout size={16} />}
            </div>
            <span className="ui-card-title">{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
};
