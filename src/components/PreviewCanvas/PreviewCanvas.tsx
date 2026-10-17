import React, { forwardRef } from 'react';
import { MockupProject, ChatContent, FeedPostContent, ProfileCardContent } from '../../models/types';
import { Check, CheckCheck, Heart, MessageCircle, Share2, ShieldAlert } from 'lucide-react';

interface PreviewCanvasProps {
  project: MockupProject;
}

export const PreviewCanvas = forwardRef<HTMLDivElement, PreviewCanvasProps>(({ project }, ref) => {
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
            <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
              <div style={{ fontSize: 10, color: '#64748b', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
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
              <div key={c.id} style={{ fontSize: 12, backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '6px 10px', borderRadius: 6 }}>
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
      {template !== 'chat' && template !== 'feed-post' && template !== 'profile-card' && renderGenericOrFallback()}
    </div>
  );
});
