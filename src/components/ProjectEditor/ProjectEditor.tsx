import React, { useState } from 'react';
import {
  MockupProject,
  PresetStyle,
  WatermarkPosition,
  ChatContent,
  FeedPostContent,
  ProfileCardContent,
  StoryContent,
  ShortVideoContent,
} from '../../models/types';
import {
  checkDisallowedPatterns,
  classifyDeceptiveContent,
  sanitizeText,
} from '../../features/safety/SafetyGuard';
import {
  validateImageFile,
  createManagedObjectURL,
  revokeManagedObjectURL,
} from '../../features/safety/AssetSanitizer';
import { applyPresetToProject, PLATFORM_PRESETS } from '../../features/templates/platformPresets';
import { AlertTriangle, Plus, Trash2, Info, ShieldAlert, Mic, Sparkles, Smartphone, MessageSquare, ShieldCheck, Check } from 'lucide-react';

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

  const handleAddAudioNote = () => {
    const newMsg = {
      id: `msg_audio_${Date.now()}`,
      senderId: isSelfSender ? 'user_self' : 'user_other',
      senderName: isSelfSender ? 'You (Sample)' : 'Alex (Sample)',
      text: 'Voice note (0:14)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: isSelfSender,
      status: 'read' as const,
      audioNote: {
        durationSec: 14,
        playedSec: 0,
      },
    };
    onUpdate({
      messages: [...(content.messages || []), newMsg],
    });
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
          <button
            type="button"
            onClick={handleAddMessage}
            className="btn-primary"
            style={{ padding: '8px 12px' }}
            title="Add Text Message"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            onClick={handleAddAudioNote}
            className="btn-secondary"
            style={{ padding: '8px 10px' }}
            title="Add Synthetic Voice Note"
          >
            <Mic size={15} color="#10b981" />
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
  const [imageError, setImageError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setImageError(validation.error || 'Invalid image file.');
      e.target.value = '';
      return;
    }

    setImageError(null);
    if (content.imageUrl && content.imageUrl.startsWith('blob:')) {
      revokeManagedObjectURL(content.imageUrl);
    }

    const objectUrl = createManagedObjectURL(file);
    onUpdate({ imageUrl: objectUrl });
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    if (content.imageUrl && content.imageUrl.startsWith('blob:')) {
      revokeManagedObjectURL(content.imageUrl);
    }
    onUpdate({ imageUrl: '' });
    setImageError(null);
  };

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
            onUpdate({ displayName: sanitizeText(e.target.value, 60) });
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
            onUpdate({ handle: sanitizeText(e.target.value, 60) });
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
            onUpdate({ caption: sanitizeText(e.target.value, 1000) });
          }}
          style={{ width: '100%', resize: 'vertical' }}
        />
      </div>

      {/* Safe Image Upload */}
      <div>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
          Post Image (PNG, JPG, WebP max 2MB)
        </label>
        {content.imageUrl ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 6, fontSize: 12 }}>
            <span style={{ color: '#38bdf8' }}>Image attached</span>
            <button
              type="button"
              onClick={handleRemoveImage}
              style={{ color: '#ef4444', fontSize: 11, fontWeight: 600 }}
            >
              Remove
            </button>
          </div>
        ) : (
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageUpload}
            style={{ width: '100%', fontSize: 12 }}
          />
        )}
        {imageError && (
          <div style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>
            {imageError}
          </div>
        )}
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

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
            Reposts / Shares
          </label>
          <input
            type="number"
            value={content.repostsCount ?? content.sharesCount ?? 0}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10) || 0;
              onUpdate({ repostsCount: val, sharesCount: val });
            }}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
            Views (Mock)
          </label>
          <input
            type="number"
            value={content.viewsCount ?? 14200}
            onChange={(e) => onUpdate({ viewsCount: parseInt(e.target.value, 10) || 0 })}
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

const StoryEditorFields: React.FC<TemplateFieldsProps<StoryContent>> = ({
  content,
  onUpdate,
  onValidate,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
          Creator Name
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
          Story Sticker Caption
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
            Gradient Top
          </label>
          <input
            type="color"
            value={content.gradientFrom || '#312e81'}
            onChange={(e) => onUpdate({ gradientFrom: e.target.value })}
            style={{ width: '100%', height: 36, padding: 2, cursor: 'pointer' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
            Gradient Bottom
          </label>
          <input
            type="color"
            value={content.gradientTo || '#0f172a'}
            onChange={(e) => onUpdate({ gradientTo: e.target.value })}
            style={{ width: '100%', height: 36, padding: 2, cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
};

const ShortVideoEditorFields: React.FC<TemplateFieldsProps<ShortVideoContent>> = ({
  content,
  onUpdate,
  onValidate,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
          Creator Name
        </label>
        <input
          type="text"
          value={content.creator || ''}
          onChange={(e) => {
            onValidate(e.target.value);
            onUpdate({ creator: sanitizeText(e.target.value) });
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
          Reel Caption
        </label>
        <textarea
          rows={2}
          value={content.caption || ''}
          onChange={(e) => {
            onValidate(e.target.value);
            onUpdate({ caption: sanitizeText(e.target.value) });
          }}
          style={{ width: '100%', resize: 'vertical' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
          Fictional Audio Track Label
        </label>
        <input
          type="text"
          value={content.audioTrack || ''}
          onChange={(e) => {
            onValidate(e.target.value);
            onUpdate({ audioTrack: sanitizeText(e.target.value) });
          }}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

export const ProjectEditor: React.FC<ProjectEditorProps> = ({ project, onChange }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'phone' | 'watermark'>('content');
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isCritical, setIsCritical] = useState(false);

  const handleTextValidation = (text: string) => {
    const classification = classifyDeceptiveContent(text);
    if (!classification.isSafe) {
      if (classification.isBlocked) {
        setIsCritical(true);
        setWarningMessage(
          `Security Blocker: "${classification.criticalTerms.join(
            ', '
          )}" is prohibited. Export will be blocked until removed.`
        );
      } else {
        setIsCritical(false);
        setWarningMessage(
          `Advisory Warning: "${classification.warningTerms.join(
            ', '
          )}" indicates sensitive content. Keep mockups clearly fictional.`
        );
      }
    } else {
      setWarningMessage(null);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = sanitizeText(e.target.value, 120);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {warningMessage && (
        <div
          style={{
            backgroundColor: isCritical ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${isCritical ? '#ef4444' : '#f59e0b'}`,
            borderRadius: 8,
            padding: '8px 12px',
            color: isCritical ? '#fca5a5' : '#fde68a',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {isCritical ? <ShieldAlert size={16} color="#ef4444" /> : <AlertTriangle size={16} color="#f59e0b" />}
          <span>{warningMessage}</span>
        </div>
      )}

      {/* Mockup Title Header */}
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-color)' }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Mockup Title
        </label>
        <input
          type="text"
          value={project.title}
          onChange={handleTitleChange}
          style={{ width: '100%', fontSize: 13, fontWeight: 600 }}
          placeholder="e.g. Sample Generic Chat"
        />
      </div>

      {/* Segmented Navigation Tab Bar */}
      <div className="tab-group">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          <MessageSquare size={13} /> Content
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'style' ? 'active' : ''}`}
          onClick={() => setActiveTab('style')}
        >
          <Sparkles size={13} /> Style
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'phone' ? 'active' : ''}`}
          onClick={() => setActiveTab('phone')}
        >
          <Smartphone size={13} /> Phone Bar
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'watermark' ? 'active' : ''}`}
          onClick={() => setActiveTab('watermark')}
        >
          <ShieldCheck size={13} /> Watermark
        </button>
      </div>

      {/* TAB 1: CONTENT (Messages, Post text, Photo, Audio note) */}
      {activeTab === 'content' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
          {project.template === 'story' && (
            <StoryEditorFields
              content={project.content as unknown as StoryContent}
              onUpdate={updateContent}
              onValidate={handleTextValidation}
            />
          )}
          {project.template === 'short-video' && (
            <ShortVideoEditorFields
              content={project.content as unknown as ShortVideoContent}
              onUpdate={updateContent}
              onValidate={handleTextValidation}
            />
          )}
        </div>
      )}

      {/* TAB 2: STYLE (Platform Presets) */}
      {activeTab === 'style' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} /> Choose Platform Style
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { id: 'default', label: 'Modern Clean', icon: '✨', desc: 'Minimalist neutral theme' },
              { id: 'whatsapp-style', label: 'WhatsApp', icon: '💬', desc: 'Emerald chat & voice notes' },
              { id: 'facebook-style', label: 'Facebook', icon: '👍', desc: 'Community feed & reactions' },
              { id: 'twitter-style', label: 'X / Twitter', icon: '𝕏', desc: 'Dark microblog & impressions' },
            ].map((p) => {
              const isSelected = (project.presetStyle || 'default') === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    const updated = applyPresetToProject(project, p.id as PresetStyle);
                    onChange(updated);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '10px 12px',
                    borderRadius: 8,
                    textAlign: 'left',
                    backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid #6366f1' : '1px solid var(--border-color)',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>{p.icon}</span>
                    {isSelected && <Check size={14} color="#a5b4fc" />}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 12 }}>{p.label}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2, lineHeight: 1.3 }}>{p.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PHONE BAR (Status bar & Pop-up notifications) */}
      {activeTab === 'phone' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Status Bar */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              padding: 12,
              borderRadius: 8,
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <label style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={project.statusBar?.enabled ?? true}
                onChange={(e) => {
                  onChange({
                    ...project,
                    statusBar: {
                      ...(project.statusBar || {
                        time: '9:41',
                        signalBars: 4,
                        networkType: '5G',
                        wifiBars: 3,
                        batteryLevel: 94,
                        isCharging: false,
                        showDynamicIsland: true,
                      }),
                      enabled: e.target.checked,
                    },
                  });
                }}
              />
              Show Phone Status Bar
            </label>

            {(project.statusBar?.enabled ?? true) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '8px 10px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 6 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#9ca3af', marginBottom: 3 }}>
                    Clock Time
                  </label>
                  <input
                    type="text"
                    value={project.statusBar?.time || '9:41'}
                    placeholder="9:41"
                    onChange={(e) => {
                      onChange({
                        ...project,
                        statusBar: {
                          ...(project.statusBar || { enabled: true, signalBars: 4, batteryLevel: 94 }),
                          enabled: true,
                          time: e.target.value,
                        },
                      });
                    }}
                    style={{ width: '100%', fontSize: 12, padding: '4px 8px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#9ca3af', marginBottom: 3 }}>
                    Network
                  </label>
                  <select
                    value={project.statusBar?.networkType || '5G'}
                    onChange={(e) => {
                      onChange({
                        ...project,
                        statusBar: {
                          ...(project.statusBar || { enabled: true, time: '9:41', batteryLevel: 94 }),
                          enabled: true,
                          networkType: e.target.value as any,
                        },
                      });
                    }}
                    style={{ width: '100%', fontSize: 12, padding: '4px 8px' }}
                  >
                    <option value="5G">5G</option>
                    <option value="LTE">LTE</option>
                    <option value="4G">4G</option>
                    <option value="Wi-Fi">Wi-Fi only</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#9ca3af', marginBottom: 3 }}>
                    Signal ({project.statusBar?.signalBars ?? 4} Bars)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={4}
                    value={project.statusBar?.signalBars ?? 4}
                    onChange={(e) => {
                      onChange({
                        ...project,
                        statusBar: {
                          ...(project.statusBar || { enabled: true, time: '9:41', batteryLevel: 94 }),
                          enabled: true,
                          signalBars: Number(e.target.value) as 1 | 2 | 3 | 4,
                        },
                      });
                    }}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#9ca3af', marginBottom: 3 }}>
                    Battery ({project.statusBar?.batteryLevel ?? 94}%)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={project.statusBar?.batteryLevel ?? 94}
                    onChange={(e) => {
                      onChange({
                        ...project,
                        statusBar: {
                          ...(project.statusBar || { enabled: true, time: '9:41', signalBars: 4 }),
                          enabled: true,
                          batteryLevel: Number(e.target.value),
                        },
                      });
                    }}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 11, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={project.statusBar?.isCharging ?? false}
                      onChange={(e) => {
                        onChange({
                          ...project,
                          statusBar: {
                            ...(project.statusBar || { enabled: true, time: '9:41', signalBars: 4, batteryLevel: 94 }),
                            enabled: true,
                            isCharging: e.target.checked,
                          },
                        });
                      }}
                    />
                    Charging (⚡)
                  </label>
                  <label style={{ fontSize: 11, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={project.statusBar?.showDynamicIsland ?? true}
                      onChange={(e) => {
                        onChange({
                          ...project,
                          statusBar: {
                            ...(project.statusBar || { enabled: true, time: '9:41', signalBars: 4, batteryLevel: 94 }),
                            enabled: true,
                            showDynamicIsland: e.target.checked,
                          },
                        });
                      }}
                    />
                    Dynamic Island
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Pop-up Notification */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              padding: 12,
              borderRadius: 8,
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <label style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={project.notificationBanner?.enabled ?? false}
                onChange={(e) => {
                  onChange({
                    ...project,
                    notificationBanner: {
                      ...(project.notificationBanner || {
                        appName: 'Messages',
                        timeAgo: 'now',
                        title: 'Alex Parker',
                        message: 'Hey, have you checked the new design mockup?',
                        avatarEmoji: '💬',
                      }),
                      enabled: e.target.checked,
                    },
                  });
                }}
              />
              Show Pop-up Notification
            </label>

            {(project.notificationBanner?.enabled ?? false) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '8px 10px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 6 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>
                      App Name
                    </label>
                    <input
                      type="text"
                      value={project.notificationBanner?.appName || 'Messages'}
                      onChange={(e) => {
                        onChange({
                          ...project,
                          notificationBanner: {
                            ...(project.notificationBanner || { enabled: true }),
                            enabled: true,
                            appName: e.target.value,
                          },
                        });
                      }}
                      style={{ width: '100%', fontSize: 12, padding: '4px 8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>
                      Time Ago
                    </label>
                    <input
                      type="text"
                      value={project.notificationBanner?.timeAgo || 'now'}
                      onChange={(e) => {
                        onChange({
                          ...project,
                          notificationBanner: {
                            ...(project.notificationBanner || { enabled: true }),
                            enabled: true,
                            timeAgo: e.target.value,
                          },
                        });
                      }}
                      style={{ width: '100%', fontSize: 12, padding: '4px 8px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 8 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>
                      Icon
                    </label>
                    <input
                      type="text"
                      value={project.notificationBanner?.avatarEmoji || '💬'}
                      onChange={(e) => {
                        onChange({
                          ...project,
                          notificationBanner: {
                            ...(project.notificationBanner || { enabled: true }),
                            enabled: true,
                            avatarEmoji: e.target.value,
                          },
                        });
                      }}
                      style={{ width: '100%', textAlign: 'center', fontSize: 14, padding: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>
                      Sender / Title
                    </label>
                    <input
                      type="text"
                      value={project.notificationBanner?.title || 'Alex Parker'}
                      onChange={(e) => {
                        onChange({
                          ...project,
                          notificationBanner: {
                            ...(project.notificationBanner || { enabled: true }),
                            enabled: true,
                            title: e.target.value,
                          },
                        });
                      }}
                      style={{ width: '100%', fontSize: 12, padding: '4px 8px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>
                    Message Preview
                  </label>
                  <input
                    type="text"
                    value={project.notificationBanner?.message || ''}
                    placeholder="Type preview message..."
                    onChange={(e) => {
                      onChange({
                        ...project,
                        notificationBanner: {
                          ...(project.notificationBanner || { enabled: true }),
                          enabled: true,
                          message: e.target.value,
                        },
                      });
                    }}
                    style={{ width: '100%', fontSize: 12, padding: '4px 8px' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: WATERMARK (Position & Ethics) */}
      {activeTab === 'watermark' && (
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={14} /> Watermark Placement
            </span>
            <span style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Info size={12} /> Always Active
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>
              Choose Corner on Mockup
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[
                { pos: 'top-left', label: 'Top Left' },
                { pos: 'top-right', label: 'Top Right' },
                { pos: 'bottom-left', label: 'Bottom Left' },
                { pos: 'bottom-right', label: 'Bottom Right (Default)' },
              ].map((c) => {
                const isSelected = project.fictionalLabel.position === c.pos;
                return (
                  <button
                    key={c.pos}
                    type="button"
                    onClick={() => {
                      onChange({
                        ...project,
                        fictionalLabel: {
                          ...project.fictionalLabel,
                          position: c.pos as WatermarkPosition,
                        },
                      });
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      backgroundColor: isSelected ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255,255,255,0.03)',
                      border: isSelected ? '1px solid #fbbf24' : '1px solid var(--border-color)',
                      color: isSelected ? '#fbbf24' : '#cbd5e1',
                      cursor: 'pointer',
                    }}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4, backgroundColor: 'rgba(0,0,0,0.2)', padding: 8, borderRadius: 6 }}>
            The <strong>FICTIONAL MOCKUP</strong> watermark protects your prototypes from being misused as real evidence or fraud.
          </div>
        </div>
      )}
    </div>
  );
};

