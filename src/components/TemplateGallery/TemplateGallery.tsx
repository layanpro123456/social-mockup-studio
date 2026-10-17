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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {templates.map(([key, item]) => {
        const isSelected = currentTemplate === key;
        return (
          <button
            key={key}
            onClick={() => onSelectTemplate(key)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 8,
              textAlign: 'left',
              backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: isSelected ? '1px solid #4f46e5' : '1px solid #2e3c54',
              color: '#f9fafb',
              transition: 'all 0.15s ease',
            }}
          >
            <div
              style={{
                padding: 8,
                borderRadius: 6,
                backgroundColor: isSelected ? '#4f46e5' : '#1f2937',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {ICONS[item.icon] || <Layout size={20} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{item.name}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', lineHeight: 1.3 }}>{item.description}</div>
              <div style={{ fontSize: 10, color: '#6366f1', marginTop: 4, fontWeight: 500 }}>
                {item.defaultCanvas}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
