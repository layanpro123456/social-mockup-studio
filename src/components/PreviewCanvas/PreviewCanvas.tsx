import React, { forwardRef } from 'react';
import {
  MockupProject,
  ChatContent,
  FeedPostContent,
  ProfileCardContent,
  StoryContent,
  ShortVideoContent,
} from '../../models/types';
import {
  Check,
  CheckCheck,
  Heart,
  MessageCircle,
  Share2,
  ShieldAlert,
  Music,
  Bookmark,
} from 'lucide-react';

interface PreviewCanvasProps {
  project: MockupProject;
  activeFrameIndex?: number;
}

export const PreviewCanvas = forwardRef<HTMLDivElement, PreviewCanvasProps>(
  ({ project, activeFrameIndex = 0 }, ref) => {
    const { template, fictionalLabel, theme } = project;

    const renderWatermark = () => (
      <div
        className={`watermark-badge watermark-${fictionalLabel.position}`}
        data-testid="fictional-mockup-watermark"
      >
        <ShieldAlert size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
        {fictionalLabel.text}
      </div>
    );

    const renderChat = (content: ChatContent) => {
      return (
        <div
          style={{
            width: 380,
            minHeight: 580,
            backgroundColor: theme.cardBackground || '#1e293b',
            color: theme.textColor || '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: theme.background || '#0f172a',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: theme.accent || '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              💬
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {content.conversationTitle || 'Fictional Conversation'}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                {content.participants?.length || 2} participants (Synthetic sample)
              </div>
            </div>
          </div>

          {/* Message Thread */}
          <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {content.messages?.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.isSelf ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.isSelf ? 'flex-end' : 'flex-start',
                }}
              >
                {!msg.isSelf && (
                  <span style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>{msg.senderName}</span>
                )}
                <div
                  style={{
                    backgroundColor: msg.isSelf ? theme.accent || '#3b82f6' : '#334155',
                    color: '#ffffff',
                    padding: '9px 13px',
                    borderRadius: msg.isSelf ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    fontSize: 13,
                    lineHeight: 1.4,
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.text}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: '#64748b',
                    marginTop: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span>{msg.timestamp}</span>
                  {msg.isSelf && (
                    <span>
                      {msg.status === 'read' ? (
                        <CheckCheck size={12} color="#38bdf8" />
                      ) : (
                        <Check size={12} />
                      )}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Generic Mock Input Bar */}
          <div
            style={{
              padding: 12,
              backgroundColor: theme.background || '#0f172a',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                flex: 1,
                backgroundColor: '#1e293b',
                padding: '8px 12px',
                borderRadius: 20,
                fontSize: 12,
                color: '#64748b',
              }}
            >
              Fictional preview only...
            </div>
          </div>

          {renderWatermark()}
        </div>
      );
    };

    const renderFeedPost = (content: FeedPostContent) => {
      return (
        <div
          style={{
            width: 440,
            backgroundColor: theme.cardBackground || '#1e293b',
            color: theme.textColor || '#f8fafc',
            borderRadius: 12,
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            position: 'relative',
          }}
        >
          {/* Post Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: theme.accent || '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {content.displayName ? content.displayName.charAt(0) : 'F'}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{content.displayName}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                {content.handle} • {content.timestamp}
              </div>
            </div>
          </div>

          {/* Caption */}
          <div style={{ fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word' }}>
            {content.caption}
          </div>

          {/* Optional Media */}
          {content.imageUrl ? (
            <img
              src={content.imageUrl}
              alt="Fictional post media"
              style={{ width: '100%', borderRadius: 8, maxHeight: 320, objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                height: 180,
                borderRadius: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px dashed rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                fontSize: 13,
              }}
            >
              [ Fictional Media Placeholder ]
            </div>
          )}

          {/* Metrics Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              paddingTop: 8,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#94a3b8',
              fontSize: 13,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Heart size={16} /> <span>{content.likesCount ?? 0}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MessageCircle size={16} /> <span>{content.commentsCount ?? 0}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Share2 size={16} /> <span>{content.sharesCount ?? 0}</span>
            </div>
          </div>

          {/* Comments */}
          {content.comments && content.comments.length > 0 && (
            <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {content.comments.map((c) => (
                <div
                  key={c.id}
                  style={{
                    fontSize: 12,
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    padding: '6px 10px',
                    borderRadius: 6,
                  }}
                >
                  <span style={{ fontWeight: 600, marginRight: 6 }}>{c.displayName}:</span>
                  <span style={{ color: '#cbd5e1' }}>{c.text}</span>
                </div>
              ))}
            </div>
          )}

          {renderWatermark()}
        </div>
      );
    };

    const renderProfileCard = (content: ProfileCardContent) => {
      return (
        <div
          style={{
            width: 380,
            backgroundColor: theme.cardBackground || '#1e293b',
            color: theme.textColor || '#f8fafc',
            borderRadius: 14,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div style={{ height: 80, backgroundColor: theme.accent || '#3b82f6', opacity: 0.8 }} />
          <div style={{ padding: '0 20px 24px 20px', marginTop: -40 }}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                backgroundColor: '#0f172a',
                border: '3px solid #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 24,
                color: '#38bdf8',
              }}
            >
              {content.displayName ? content.displayName.charAt(0) : 'P'}
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{content.displayName}</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>{content.handle}</div>
              <p style={{ marginTop: 10, fontSize: 13, color: '#cbd5e1', lineHeight: 1.4 }}>
                {content.bio}
              </p>
            </div>

            {/* Metrics */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 18,
                padding: '12px 16px',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                borderRadius: 8,
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{content.postsCount ?? 0}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Posts (Sample)</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{content.followersCount ?? 0}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Followers (Mock)</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{content.followingCount ?? 0}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Following (Mock)</div>
              </div>
            </div>
          </div>

          {renderWatermark()}
        </div>
      );
    };

    const renderStory = (content: StoryContent) => {
      return (
        <div
          style={{
            width: 360,
            height: 620,
            background: content.gradientFrom
              ? `linear-gradient(135deg, ${content.gradientFrom}, ${content.gradientTo || '#312e81'})`
              : 'linear-gradient(135deg, #312e81, #1e1b4b, #0f172a)',
            color: '#ffffff',
            borderRadius: 18,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 18,
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
          }}
        >
          {/* Top Progress Dash Bars */}
          <div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: '#ffffff' }} />
              <div style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.35)' }} />
              <div style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.35)' }} />
            </div>

            {/* Author Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #f59e0b, #ec4899, #8b5cf6)',
                  padding: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: '#1e1b4b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {content.displayName ? content.displayName.charAt(0) : 'S'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{content.displayName}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                  {content.handle} • {content.timestamp || 'Just now'}
                </div>
              </div>
            </div>
          </div>

          {/* Central Story Caption Sticker */}
          <div
            style={{
              alignSelf: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              padding: '16px 20px',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.15)',
              maxWidth: '85%',
              textAlign: 'center',
              fontSize: 15,
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            {content.caption || 'Fictional story moment ✨'}
          </div>

          {/* Bottom Interaction Bar */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 24,
                  padding: '10px 16px',
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.75)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                Reply to {content.displayName}...
              </div>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Heart size={18} />
              </div>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Share2 size={18} />
              </div>
            </div>
          </div>

          {renderWatermark()}
        </div>
      );
    };

    const renderShortVideo = (content: ShortVideoContent) => {
      const frames = project.frames || [];
      const currentFrame = frames[activeFrameIndex] || frames[0] || {
        id: 'default',
        durationMs: 3000,
        transition: 'cut',
        content: { text: 'Fictional Scene' },
      };

      return (
        <div
          style={{
            width: 360,
            height: 640,
            backgroundColor: '#000000',
            color: '#ffffff',
            borderRadius: 18,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
          }}
        >
          {/* Frame Stage Background & Animated Content */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 50% 35%, #1e3a8a 0%, #030712 100%)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: '#38bdf8',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Frame {activeFrameIndex + 1} of {Math.max(frames.length, 1)} ({currentFrame.transition} • {currentFrame.durationMs}ms)
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#f8fafc',
                maxWidth: '85%',
                lineHeight: 1.4,
              }}
            >
              {String(currentFrame.content?.text || 'Synthetic Video Scene')}
            </div>
          </div>

          {/* Top Frame Counter Badge */}
          <div style={{ position: 'relative', zIndex: 10, padding: 16 }}>
            <span
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(6px)',
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 11,
                color: '#94a3b8',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              ▶ Timeline Clip Preview
            </span>
          </div>

          {/* Bottom Overlay & Controls */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
            }}
          >
            {/* Creator & Audio Info */}
            <div style={{ flex: 1, paddingRight: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                {content.creator || 'Fictional Creator'}
              </div>
              <div style={{ fontSize: 12, color: '#38bdf8', marginBottom: 6 }}>
                {content.handle || '@mock_reel'}
              </div>
              <div style={{ fontSize: 13, color: '#e2e8f0', marginBottom: 8, lineHeight: 1.4 }}>
                {content.caption}
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  color: '#94a3b8',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '3px 8px',
                  borderRadius: 12,
                }}
              >
                <Music size={12} />
                <span>{content.audioTrack || 'Original Mock Sound'}</span>
              </div>
            </div>

            {/* Right Action Icons Column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Heart size={20} />
                </div>
                <span style={{ fontSize: 11, color: '#e2e8f0' }}>24.5k</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MessageCircle size={20} />
                </div>
                <span style={{ fontSize: 11, color: '#e2e8f0' }}>318</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bookmark size={20} />
                </div>
                <span style={{ fontSize: 11, color: '#e2e8f0' }}>1.2k</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Share2 size={20} />
                </div>
                <span style={{ fontSize: 11, color: '#e2e8f0' }}>Share</span>
              </div>
            </div>
          </div>

          {renderWatermark()}
        </div>
      );
    };

    const renderGenericOrFallback = () => {
      return (
        <div
          style={{
            width: 380,
            minHeight: 480,
            backgroundColor: theme.cardBackground || '#1e293b',
            color: theme.textColor || '#f8fafc',
            borderRadius: 12,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{project.title}</h3>
          <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 280 }}>
            Template: <strong>{template}</strong> (Fictional Prototype Mode)
          </p>
          {renderWatermark()}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        id="mockup-export-target"
        className="preview-wrapper"
        style={{
          fontFamily: theme.fontFamily || 'sans-serif',
        }}
      >
        {template === 'chat' && renderChat(project.content as unknown as ChatContent)}
        {template === 'feed-post' && renderFeedPost(project.content as unknown as FeedPostContent)}
        {template === 'profile-card' && renderProfileCard(project.content as unknown as ProfileCardContent)}
        {template === 'story' && renderStory(project.content as unknown as StoryContent)}
        {template === 'short-video' && renderShortVideo(project.content as unknown as ShortVideoContent)}
        {template !== 'chat' &&
          template !== 'feed-post' &&
          template !== 'profile-card' &&
          template !== 'story' &&
          template !== 'short-video' &&
          renderGenericOrFallback()}
      </div>
    );
  }
);
