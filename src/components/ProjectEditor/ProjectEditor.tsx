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
import { AlertTriangle, Plus, Trash2, Info, ShieldAlert, Mic, Sparkles, Smartphone } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {warningMessage && (
        <div
          style={{
            backgroundColor: isCritical ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${isCritical ? '#ef4444' : '#f59e0b'}`,
            borderRadius: 6,
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

      {/* Platform-Inspired Theme Preset */}
      <div
        style={{
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          padding: 12,
          borderRadius: 8,
          border: '1px solid rgba(99, 102, 241, 0.25)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 6,
            fontSize: 12,
            fontWeight: 700,
            color: '#a5b4fc',
          }}
        >
          <Sparkles size={14} /> Platform-Inspired Theme
        </div>
        <select
          value={project.presetStyle || 'default'}
          onChange={(e) => {
            const updated = applyPresetToProject(project, e.target.value as PresetStyle);
            onChange(updated);
          }}
          style={{ width: '100%', fontSize: 13 }}
        >
          <option value="default">Modern Generic (Default)</option>
          <option value="whatsapp-style">Emerald Messaging (WhatsApp-Inspired)</option>
          <option value="facebook-style">Community Feed (Facebook-Inspired)</option>
          <option value="twitter-style">Microblog Post (X-Inspired)</option>
          <option value="instagram-style">Visual Story (Instagram-Inspired)</option>
        </select>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 5, lineHeight: 1.3 }}>
          {PLATFORM_PRESETS.find((p) => p.id === (project.presetStyle || 'default'))?.tagline}
        </div>
      </div>

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

      {/* Device Status Bar & Notifications Controls */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          padding: 12,
          borderRadius: 8,
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Smartphone size={14} /> Device Status Bar & Notifications
          </span>
        </div>

        {/* Status Bar Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
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
              Show Device Status Bar
            </label>
          </div>

          {(project.statusBar?.enabled ?? true) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '8px 10px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 6 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#9ca3af', marginBottom: 3 }}>
                  Status Time
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
                  Cellular Signal ({project.statusBar?.signalBars ?? 4} Bars)
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

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, gridColumn: 'span 2' }}>
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
                <label style={{ fontSize: 11, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', marginLeft: 12 }}>
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

        {/* Notification Banner Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
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
            Show Floating Push Notification
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
                    Notification Title / Sender
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
                  Notification Message
                </label>
                <input
                  type="text"
                  value={project.notificationBanner?.message || ''}
                  placeholder="Hey, have you checked the new design mockup?"
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
  );
};

