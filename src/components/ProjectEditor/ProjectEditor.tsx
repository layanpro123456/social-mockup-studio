import React, { useState } from 'react';
import { MockupProject, WatermarkPosition, ChatContent, FeedPostContent, ProfileCardContent } from '../../models/types';
import { checkDisallowedPatterns, sanitizeText } from '../../features/safety/SafetyGuard';
import { AlertTriangle, Plus, Trash2, Info } from 'lucide-react';

interface ProjectEditorProps {
  project: MockupProject;
  onChange: (updated: MockupProject) => void;
}

interface TemplateFieldsProps<T> {
  content: T;
  onUpdate: (partial: Partial<T>) => void;
  onValidate: (text: string) => void;
}

const ChatEditorFields: React.FC<TemplateFieldsProps<ChatContent>> = ({
  content,
  onUpdate,
  onValidate,
}) => {
  const [newMessageText, setNewMessageText] = useState('');
  const [isSelfSender, setIsSelfSender] = useState(true);

  const handleAddMessage = () => {
    if (!newMessageText.trim()) return;
    onValidate(newMessageText);
    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: isSelfSender ? 'user_self' : 'user_other',
      senderName: isSelfSender ? 'You (Sample)' : 'Alex (Sample)',
      text: sanitizeText(newMessageText),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: isSelfSender,
      status: 'delivered' as const,
    };
    onUpdate({
      messages: [...(content.messages || []), newMsg],
    });
    setNewMessageText('');
  };

  const handleDeleteMessage = (id: string) => {
    onUpdate({
      messages: (content.messages || []).filter((m) => m.id !== id),
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
          Conversation Title
        </label>
        <input
          type="text"
          value={content.conversationTitle || ''}
          onChange={(e) => {
            onValidate(e.target.value);
            onUpdate({ conversationTitle: sanitizeText(e.target.value) });
          }}
          style={{ width: '100%' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>
          Add Fictional Message
        </label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <button
            type="button"
            onClick={() => setIsSelfSender(true)}
            className={isSelfSender ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}
          >
            Outgoing (Self)
          </button>
          <button
            type="button"
            onClick={() => setIsSelfSender(false)}
            className={!isSelfSender ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}
          >
            Incoming (Other)
          </button>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            type="text"
            placeholder="Type sample message..."
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddMessage();
              }
            }}
            style={{ flex: 1 }}
          />
          <button type="button" onClick={handleAddMessage} className="btn-primary" style={{ padding: '8px 12px' }}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>
          Messages ({content.messages?.length || 0})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
          {content.messages?.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 6,
                fontSize: 12,
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                <strong>{m.isSelf ? 'You: ' : `${m.senderName}: `}</strong>
                {m.text}
              </span>
              <button
                type="button"
                onClick={() => handleDeleteMessage(m.id)}
                style={{ color: '#ef4444', padding: 2 }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeedPostEditorFields: React.FC<TemplateFieldsProps<FeedPostContent>> = ({
  content,
  onUpdate,
  onValidate,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
          Fictional Author Name
        </label>
        <input
          type="text"
          value={content.displayName || ''}
          onChange={(e) => {
            onValidate(e.target.value);
            onUpdate({ displayName: sanitizeText(e.target.value) });
          }}
          style={{ width: '100%' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
          Sample Handle
        </label>
        <input
          type="text"
          value={content.handle || ''}
          onChange={(e) => {
            onValidate(e.target.value);
            onUpdate({ handle: sanitizeText(e.target.value) });
          }}
          style={{ width: '100%' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
          Caption / Body
        </label>
        <textarea
          rows={3}
          value={content.caption || ''}
          onChange={(e) => {
            onValidate(e.target.value);
            onUpdate({ caption: sanitizeText(e.target.value) });
          }}
          style={{ width: '100%', resize: 'vertical' }}
        />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
            Likes (Mock)
          </label>
          <input
            type="number"
            value={content.likesCount ?? 0}
            onChange={(e) => onUpdate({ likesCount: parseInt(e.target.value, 10) || 0 })}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
            Comments (Mock)
          </label>
          <input
            type="number"
            value={content.commentsCount ?? 0}
            onChange={(e) => onUpdate({ commentsCount: parseInt(e.target.value, 10) || 0 })}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

const ProfileCardEditorFields: React.FC<TemplateFieldsProps<ProfileCardContent>> = ({
  content,
  onUpdate,
  onValidate,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
          Profile Name
        </label>
        <input
          type="text"
          value={content.displayName || ''}
          onChange={(e) => {
            onValidate(e.target.value);
            onUpdate({ displayName: sanitizeText(e.target.value) });
          }}
          style={{ width: '100%' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
          Handle
        </label>
        <input
          type="text"
          value={content.handle || ''}
          onChange={(e) => {
            onValidate(e.target.value);
            onUpdate({ handle: sanitizeText(e.target.value) });
          }}
          style={{ width: '100%' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
          Bio Description
        </label>
        <textarea
          rows={2}
          value={content.bio || ''}
          onChange={(e) => {
            onValidate(e.target.value);
            onUpdate({ bio: sanitizeText(e.target.value) });
          }}
          style={{ width: '100%', resize: 'vertical' }}
        />
      </div>
    </div>
  );
};

export const ProjectEditor: React.FC<ProjectEditorProps> = ({ project, onChange }) => {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const handleTextValidation = (text: string) => {
    const check = checkDisallowedPatterns(text);
    if (!check.isSafe) {
      setWarningMessage(`Safety alert: "${check.flaggedTerms.join(', ')}" is not allowed in fictional mockups.`);
    } else {
      setWarningMessage(null);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = sanitizeText(e.target.value);
    handleTextValidation(clean);
    onChange({ ...project, title: clean });
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...project,
      fictionalLabel: {
        ...project.fictionalLabel,
        position: e.target.value as WatermarkPosition,
      },
    });
  };

  const updateContent = (partial: Record<string, unknown>) => {
    onChange({
      ...project,
      content: {
        ...project.content,
        ...partial,
      },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {warningMessage && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            borderRadius: 6,
            padding: '8px 12px',
            color: '#fca5a5',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <AlertTriangle size={16} color="#ef4444" />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* Project Title */}
      <div>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
          Project Title
        </label>
        <input
          type="text"
          value={project.title}
          onChange={handleTitleChange}
          style={{ width: '100%' }}
        />
      </div>

      {/* Fictional Label Settings */}
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 12, borderRadius: 8, border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#fbbf24' }}>
            Watermark Enforcement
          </span>
          <span style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
            <Info size={12} /> Always Active
          </span>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>
            Watermark Position
          </label>
          <select
            value={project.fictionalLabel.position}
            onChange={handlePositionChange}
            style={{ width: '100%' }}
          >
            <option value="bottom-right">Bottom Right (Default)</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="top-right">Top Right</option>
            <option value="top-left">Top Left</option>
          </select>
        </div>
      </div>

      {/* Dynamic Template Fields */}
      {project.template === 'chat' && (
        <ChatEditorFields
          content={project.content as unknown as ChatContent}
          onUpdate={updateContent}
          onValidate={handleTextValidation}
        />
      )}
      {project.template === 'feed-post' && (
        <FeedPostEditorFields
          content={project.content as unknown as FeedPostContent}
          onUpdate={updateContent}
          onValidate={handleTextValidation}
        />
      )}
      {project.template === 'profile-card' && (
        <ProfileCardEditorFields
          content={project.content as unknown as ProfileCardContent}
          onUpdate={updateContent}
          onValidate={handleTextValidation}
        />
      )}
    </div>
  );
};
