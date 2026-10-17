import React, { useState, useRef } from 'react';
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
import {
  AlertTriangle,
  Plus,
  Trash2,
  Info,
  ShieldAlert,
  Mic,
  Sparkles,
  Smartphone,
  MessageSquare,
  ShieldCheck,
  Check,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MockupAvatar } from '../common/MockupAvatar';

interface ProjectEditorProps {
  project: MockupProject;
  onChange: (updated: MockupProject) => void;
}

interface TemplateFieldsProps<T> {
  content: T;
  onUpdate: (partial: Partial<T>) => void;
  onValidate: (text: string) => void;
}

interface AvatarUploadFieldProps {
  label: string;
  avatarUrl?: string;
  name: string;
  size?: number;
  showOnlineToggle?: boolean;
  isOnline?: boolean;
  onOnlineToggle?: (online: boolean) => void;
  showStoryRingToggle?: boolean;
  hasStoryRing?: boolean;
  onStoryRingToggle?: (ring: boolean) => void;
  onChange: (url: string) => void;
}

const AvatarUploadField: React.FC<AvatarUploadFieldProps> = ({
  label,
  avatarUrl,
  name,
  size = 42,
  showOnlineToggle = false,
  isOnline = true,
  onOnlineToggle,
  showStoryRingToggle = false,
  hasStoryRing = true,
  onStoryRingToggle,
  onChange,
}) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid image file.');
      e.target.value = '';
      return;
    }

    setError(null);
    if (avatarUrl && avatarUrl.startsWith('blob:')) {
      revokeManagedObjectURL(avatarUrl);
    }
    const url = createManagedObjectURL(file);
    onChange(url);
    e.target.value = '';
  };

  const handleRemove = () => {
    if (avatarUrl && avatarUrl.startsWith('blob:')) {
      revokeManagedObjectURL(avatarUrl);
    }
    onChange('');
    setError(null);
  };

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-slate-400">{label}</div>
      <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
        <MockupAvatar
          src={avatarUrl}
          name={name}
          size={size}
          showOnlineDot={showOnlineToggle && isOnline}
          storyRing={showStoryRingToggle && hasStoryRing}
        />
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-7 text-xs px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200"
            >
              <Upload size={12} className="mr-1.5" />
              {avatarUrl ? 'Change' : 'Upload Photo'}
            </Button>
            {avatarUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="h-7 text-xs px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                Remove
              </Button>
            )}
          </div>
          <p className="text-[10px] text-slate-400 truncate">
            {avatarUrl ? 'Custom photo active' : 'Initial letters fallback'}
          </p>
        </div>
      </div>

      {(showOnlineToggle || showStoryRingToggle) && (
        <div className="flex items-center gap-4 pt-0.5">
          {showOnlineToggle && onOnlineToggle && (
            <label className="text-[11px] text-slate-300 flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isOnline}
                onChange={(e) => onOnlineToggle(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800"
              />
              Online Status Dot 🟢
            </label>
          )}
          {showStoryRingToggle && onStoryRingToggle && (
            <label className="text-[11px] text-slate-300 flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasStoryRing}
                onChange={(e) => onStoryRingToggle(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800"
              />
              Gradient Story Ring 🎨
            </label>
          )}
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="py-2 px-3 text-xs">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

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

      <AvatarUploadField
        label="Contact Profile Picture"
        avatarUrl={content.contactAvatarUrl}
        name={content.conversationTitle || 'Alex Parker'}
        showOnlineToggle
        isOnline={content.contactIsOnline ?? true}
        onOnlineToggle={(online) => onUpdate({ contactIsOnline: online })}
        onChange={(url) => onUpdate({ contactAvatarUrl: url })}
      />

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

      <AvatarUploadField
        label="Author Profile Picture"
        avatarUrl={content.avatarUrl}
        name={content.displayName || 'Author'}
        onChange={(url) => onUpdate({ avatarUrl: url })}
      />
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
          <Alert variant="destructive" className="mt-2 py-2 px-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">{imageError}</AlertDescription>
          </Alert>
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

      <AvatarUploadField
        label="Profile Picture"
        avatarUrl={content.avatarUrl}
        name={content.displayName || 'Profile'}
        size={50}
        onChange={(url) => onUpdate({ avatarUrl: url })}
      />
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

      <AvatarUploadField
        label="Story Creator Picture"
        avatarUrl={content.avatarUrl}
        name={content.displayName || 'Creator'}
        showStoryRingToggle
        hasStoryRing={content.hasStoryRing ?? true}
        onStoryRingToggle={(ring) => onUpdate({ hasStoryRing: ring })}
        onChange={(url) => onUpdate({ avatarUrl: url })}
      />
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

      <AvatarUploadField
        label="Creator Profile Picture"
        avatarUrl={content.avatarUrl}
        name={content.creator || 'Creator'}
        onChange={(url) => onUpdate({ avatarUrl: url })}
      />
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
    <form className="ui-form" onSubmit={(e) => e.preventDefault()}>
      {warningMessage && (
        <Alert
          variant={isCritical ? 'destructive' : 'warning'}
          className="mb-2"
        >
          {isCritical ? <ShieldAlert className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <AlertTitle className="text-xs font-semibold">
            {isCritical ? 'Security Violation' : 'Deceptive Content Warning'}
          </AlertTitle>
          <AlertDescription className="text-xs font-medium">{warningMessage}</AlertDescription>
        </Alert>
      )}

      {/* Mockup Title Header */}
      <div className="space-y-1.5">
        <Label htmlFor="mockup-title-input" className="text-xs font-medium text-slate-400">
          Mockup Title
        </Label>
        <Input
          id="mockup-title-input"
          type="text"
          value={project.title}
          onChange={handleTitleChange}
          placeholder="e.g. Sample Generic Chat"
          className="bg-slate-900 border-slate-800 text-sm h-9"
        />
      </div>

      {/* shadcn Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
        <TabsList className="grid grid-cols-4 w-full bg-slate-900/90 border border-slate-800 p-1 rounded-lg">
          <TabsTrigger value="content" className="text-xs font-semibold">
            <MessageSquare size={13} className="mr-1.5" /> Content
          </TabsTrigger>
          <TabsTrigger value="style" className="text-xs font-semibold">
            <Sparkles size={13} className="mr-1.5" /> Style
          </TabsTrigger>
          <TabsTrigger value="phone" className="text-xs font-semibold">
            <Smartphone size={13} className="mr-1.5" /> Phone Bar
          </TabsTrigger>
          <TabsTrigger value="watermark" className="text-xs font-semibold">
            <ShieldCheck size={13} className="mr-1.5" /> Watermark
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* TAB 1: CONTENT */}
      {activeTab === 'content' && (
        <section role="tabpanel" aria-label="Mockup Content" className="ui-form">
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
        </section>
      )}

      {/* TAB 2: STYLE */}
      {activeTab === 'style' && (
        <fieldset className="ui-fieldset">
          <legend className="ui-legend">
            <Sparkles size={12} color="#a5b4fc" /> Platform Style
          </legend>
          <div className="ui-cards-grid" style={{ marginTop: 8 }}>
            {[
              { id: 'default', label: 'Modern Clean', icon: '✨' },
              { id: 'whatsapp-style', label: 'WhatsApp', icon: '💬' },
              { id: 'facebook-style', label: 'Facebook', icon: '👍' },
              { id: 'twitter-style', label: 'X / Twitter', icon: '𝕏' },
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
                  className={`ui-card-btn ${isSelected ? 'active' : ''}`}
                  aria-pressed={isSelected}
                  style={{ justifyContent: 'space-between', padding: '10px 12px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{p.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: 12 }}>{p.label}</span>
                  </div>
                  {isSelected && <Check size={14} color="#a5b4fc" />}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* TAB 3: PHONE BAR */}
      {activeTab === 'phone' && (
        <div className="ui-form">
          {/* Status Bar */}
          <fieldset className="ui-fieldset">
            <legend className="ui-legend">
              <Smartphone size={12} color="#94a3b8" /> Phone Status Bar
            </legend>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                Enable Status Bar
              </label>

              {(project.statusBar?.enabled ?? true) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                  <div className="ui-field-row">
                    <div className="ui-field">
                      <label>Time</label>
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
                      />
                    </div>

                    <div className="ui-field">
                      <label>Network</label>
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
                      >
                        <option value="5G">5G</option>
                        <option value="LTE">LTE</option>
                        <option value="4G">4G</option>
                        <option value="Wi-Fi">Wi-Fi</option>
                      </select>
                    </div>
                  </div>

                  <div className="ui-field-row">
                    <div className="ui-field">
                      <label>Signal ({project.statusBar?.signalBars ?? 4}/4)</label>
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
                      />
                    </div>

                    <div className="ui-field">
                      <label>Battery ({project.statusBar?.batteryLevel ?? 94}%)</label>
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
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
                    <label style={{ fontSize: 11.5, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
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
                      Charging ⚡
                    </label>
                    <label style={{ fontSize: 11.5, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
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
          </fieldset>

          {/* Pop-up Notification */}
          <fieldset className="ui-fieldset">
            <legend className="ui-legend">
              <MessageSquare size={12} color="#94a3b8" /> Pop-up Notification
            </legend>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                Show Notification
              </label>

              {(project.notificationBanner?.enabled ?? false) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                  <div className="ui-field-row">
                    <div className="ui-field">
                      <label>App Name</label>
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
                      />
                    </div>
                    <div className="ui-field">
                      <label>Time Ago</label>
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
                      />
                    </div>
                  </div>

                  <div className="ui-field-row">
                    <div className="ui-field" style={{ maxWidth: 64 }}>
                      <label>Icon</label>
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
                        style={{ textAlign: 'center' }}
                      />
                    </div>
                    <div className="ui-field">
                      <label>Sender / Title</label>
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
                      />
                    </div>
                  </div>

                  <AvatarUploadField
                    label="Sender Profile Photo (Optional)"
                    avatarUrl={project.notificationBanner?.avatarUrl}
                    name={project.notificationBanner?.title || 'Notification'}
                    size={36}
                    onChange={(url) => {
                      onChange({
                        ...project,
                        notificationBanner: {
                          ...(project.notificationBanner || { enabled: true }),
                          enabled: true,
                          avatarUrl: url,
                        },
                      });
                    }}
                  />

                  <div className="ui-field">
                    <label>Message Preview</label>
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
                    />
                  </div>
                </div>
              )}
            </div>
          </fieldset>
        </div>
      )}

      {/* TAB 4: WATERMARK */}
      {activeTab === 'watermark' && (
        <fieldset className="ui-fieldset">
          <legend className="ui-legend">
            <ShieldCheck size={12} color="#fbbf24" /> Watermark Corner
          </legend>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="ui-cards-grid">
              {[
                { pos: 'top-left', label: 'Top Left' },
                { pos: 'top-right', label: 'Top Right' },
                { pos: 'bottom-left', label: 'Bottom Left' },
                { pos: 'bottom-right', label: 'Bottom Right' },
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
                    className={`ui-card-btn ${isSelected ? 'active' : ''}`}
                    aria-pressed={isSelected}
                    style={{ justifyContent: 'center' }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{c.label}</span>
                  </button>
                );
              })}
            </div>

            <Alert variant="warning" className="py-2.5 px-3">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle className="text-xs font-semibold">Mandatory Fictional Marker</AlertTitle>
              <AlertDescription className="text-[11px] leading-relaxed">
                The <strong className="text-amber-200">FICTIONAL MOCKUP</strong> watermark protects prototypes from being misused as real evidence.
              </AlertDescription>
            </Alert>
          </div>
        </fieldset>
      )}
    </form>
  );
};

