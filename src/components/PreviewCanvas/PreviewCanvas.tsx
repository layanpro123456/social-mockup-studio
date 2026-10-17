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
  Globe,
  ThumbsUp,
  Repeat,
  Play,
  Mic,
  Paperclip,
  Smile,
  MoreHorizontal,
  ArrowLeft,
  Lock,
  Phone,
  Video,
  Bell,
  Mail,
  Search,
} from 'lucide-react';
import { DeviceStatusBar } from '../DeviceStatusBar/DeviceStatusBar';
import { NotificationBanner } from '../NotificationBanner/NotificationBanner';
import { MockupAvatar } from '../common/MockupAvatar';

interface PreviewCanvasProps {
  project: MockupProject;
  activeFrameIndex?: number;
}

export const PreviewCanvas = forwardRef<HTMLDivElement, PreviewCanvasProps>(
  ({ project, activeFrameIndex = 0 }, ref) => {
    const { template, presetStyle, fictionalLabel, theme } = project;

    const renderWatermark = () => (
      <div
        className={`watermark-badge watermark-${fictionalLabel.position}`}
        data-testid="fictional-mockup-watermark"
      >
        <ShieldAlert size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
        {fictionalLabel.text}
      </div>
    );

    /* -------------------------------------------------------------
     * CHAT RENDERING (Generic vs. WhatsApp-Inspired Emerald Style)
     * ------------------------------------------------------------- */
    const renderChat = (content: ChatContent) => {
      const isWhatsApp = presetStyle === 'whatsapp-style';

      if (isWhatsApp) {
        return (
          <div
            style={{
              width: 380,
              minHeight: 590,
              backgroundColor: '#efeae2',
              backgroundImage:
                'radial-gradient(#d1d7db 1px, transparent 1px), radial-gradient(#d1d7db 1px, #efeae2 1px)',
              backgroundSize: '20px 20px',
              color: '#111b21',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            {/* Emerald Device Status Bar */}
            <DeviceStatusBar
              config={project.statusBar}
              theme="dark"
              style={{ backgroundColor: '#008069' }}
            />

            {/* Emerald Header */}
            <div
              style={{
                padding: '8px 14px 10px',
                backgroundColor: '#008069',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
                <ArrowLeft size={18} />
                <span
                  style={{
                    backgroundColor: '#25d366',
                    color: '#111b21',
                    borderRadius: 10,
                    padding: '0 5px',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  3
                </span>
              </div>
              <MockupAvatar
                src={content.contactAvatarUrl}
                name={content.conversationTitle || 'Fictional Chat'}
                size={36}
                accentColor="#075e54"
                showOnlineDot={content.contactIsOnline ?? true}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {content.conversationTitle || 'Fictional Chat'}
                </div>
                <div style={{ fontSize: 11, color: '#e0f2fe' }}>online (fictional prototype)</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Video size={17} style={{ cursor: 'pointer', opacity: 0.95 }} />
                <Phone size={16} style={{ cursor: 'pointer', opacity: 0.95 }} />
                <MoreHorizontal size={18} style={{ cursor: 'pointer' }} />
              </div>
            </div>

            {/* Notification Banner Overlay if enabled */}
            <NotificationBanner config={project.notificationBanner} />

            {/* Encrypted Notice Banner */}
            <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  backgroundColor: '#ffeecd',
                  borderRadius: 6,
                  padding: '5px 10px',
                  fontSize: 10,
                  color: '#54656f',
                  textAlign: 'center',
                  maxWidth: '92%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                }}
              >
                <Lock size={10} />
                <span>Messages and media are fictional for prototyping purposes.</span>
              </div>
            </div>

            {/* Date Pill */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
              <span
                style={{
                  backgroundColor: '#ffffff',
                  padding: '3px 10px',
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 600,
                  color: '#54656f',
                  boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                  textTransform: 'uppercase',
                }}
              >
                Today (Sample)
              </span>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {content.messages?.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: msg.isSelf ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.isSelf ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: msg.isSelf ? '#d9fdd3' : '#ffffff',
                      color: '#111b21',
                      padding: '8px 12px',
                      borderRadius: msg.isSelf ? '8px 8px 2px 8px' : '8px 8px 8px 2px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.13)',
                      fontSize: 13,
                      lineHeight: 1.4,
                      wordBreak: 'break-word',
                    }}
                  >
                    {!msg.isSelf && (
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#128c7e', marginBottom: 2 }}>
                        {msg.senderName}
                      </div>
                    )}

                    {/* Audio Note Rendering if present */}
                    {msg.audioNote ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: '#00a884',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                          }}
                        >
                          <Play size={14} style={{ marginLeft: 2 }} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                          {/* Synthetic Waveform Bars */}
                          {[12, 18, 8, 22, 14, 26, 18, 10, 16, 24, 12, 20].map((h, idx) => (
                            <div
                              key={idx}
                              style={{
                                width: 3,
                                height: h,
                                backgroundColor: idx < 6 ? '#00a884' : '#8696a0',
                                borderRadius: 1.5,
                              }}
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: 10, color: '#667781' }}>0:{msg.audioNote.durationSec || 14}</span>
                      </div>
                    ) : (
                      <span>{msg.text}</span>
                    )}

                    <div
                      style={{
                        fontSize: 10,
                        color: '#667781',
                        marginTop: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 3,
                      }}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.isSelf && (
                        <span>
                          <CheckCheck size={13} color="#53bdeb" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp Mock Input Bar */}
            <div
              style={{
                padding: '8px 10px',
                backgroundColor: '#f0f2f5',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  padding: '7px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  color: '#8696a0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Smile size={16} color="#8696a0" />
                <span style={{ flex: 1 }}>Message</span>
                <Paperclip size={16} color="#8696a0" />
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: '#00a884',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Mic size={16} />
              </div>
            </div>

            {renderWatermark()}
          </div>
        );
      }

      // Generic Chat Layout
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
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          {/* Top Device Status Bar */}
          <DeviceStatusBar
            config={project.statusBar}
            theme="dark"
            style={{ backgroundColor: theme.background || '#0f172a' }}
          />

          {/* Chat Header */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: theme.background || '#0f172a',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <MockupAvatar
              src={content.contactAvatarUrl}
              name={content.conversationTitle || 'Fictional Conversation'}
              size={38}
              accentColor={theme.accent || '#3b82f6'}
              showOnlineDot={content.contactIsOnline ?? true}
            />
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

          {/* Notification Banner Overlay if enabled */}
          <NotificationBanner config={project.notificationBanner} />

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

    /* -------------------------------------------------------------
     * FEED POST RENDERING (Generic vs Facebook vs Twitter/X)
     * ------------------------------------------------------------- */
    const renderFeedPost = (content: FeedPostContent) => {
      const isFacebook = presetStyle === 'facebook-style';
      const isTwitter = presetStyle === 'twitter-style';

      // 1. Facebook-Inspired Community Feed Archetype
      if (isFacebook) {
        return (
          <div
            style={{
              width: 440,
              backgroundColor: '#ffffff',
              color: '#050505',
              borderRadius: 14,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              border: '1px solid #ced0d4',
            }}
          >
            {/* Top Device Status Bar */}
            <DeviceStatusBar
              config={project.statusBar}
              theme="light"
              style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f0f2f5' }}
            />

            {/* Facebook App Navigation Bar */}
            <div
              style={{
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #f0f2f5',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 18, color: '#1877f2', letterSpacing: -0.5 }}>
                community
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: '#f0f2f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Search size={16} color="#050505" />
                </div>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: '#f0f2f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  <Bell size={16} color="#050505" />
                  <span
                    style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      backgroundColor: '#e41e3f',
                      color: '#ffffff',
                      borderRadius: 10,
                      padding: '0 4px',
                      fontSize: 9,
                      fontWeight: 700,
                    }}
                  >
                    3
                  </span>
                </div>
              </div>
            </div>

            {/* Notification Banner Overlay if enabled */}
            <NotificationBanner config={project.notificationBanner} />

            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <MockupAvatar
                  src={content.avatarUrl}
                  name={content.displayName || 'Facebook User'}
                  size={40}
                  accentColor="#1877f2"
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{content.displayName}</div>
                  <div style={{ fontSize: 12, color: '#65676b', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>{content.timestamp || '2h'}</span>
                    <span>•</span>
                    <Globe size={12} />
                  </div>
                </div>
              </div>
              <MoreHorizontal size={18} color="#65676b" />
            </div>

            {/* Post Caption */}
            <div style={{ fontSize: 14, lineHeight: 1.45, wordBreak: 'break-word', color: '#050505' }}>
              {content.caption}
            </div>

            {/* Media */}
            {content.imageUrl ? (
              <img
                src={content.imageUrl}
                alt="Fictional post media"
                style={{ width: '100%', borderRadius: 6, maxHeight: 320, objectFit: 'cover' }}
              />
            ) : null}

            {/* Stacked Reaction Summary Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: '1px solid #ced0d4',
                fontSize: 13,
                color: '#65676b',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', marginLeft: 4 }}>
                  <span style={{ fontSize: 14 }}>👍</span>
                  <span style={{ fontSize: 14, marginLeft: -4 }}>❤️</span>
                  <span style={{ fontSize: 14, marginLeft: -4 }}>😂</span>
                </div>
                <span style={{ fontWeight: 600 }}>{content.likesCount || 342}</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <span>{content.commentsCount || 18} comments</span>
                <span>{content.sharesCount || 5} shares</span>
              </div>
            </div>

            {/* Action Row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '4px 0',
                borderBottom: '1px solid #ced0d4',
                color: '#65676b',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <button
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#65676b',
                  padding: '6px 12px',
                  borderRadius: 4,
                }}
              >
                <ThumbsUp size={16} /> Like
              </button>
              <button
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#65676b',
                  padding: '6px 12px',
                  borderRadius: 4,
                }}
              >
                <MessageCircle size={16} /> Comment
              </button>
              <button
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#65676b',
                  padding: '6px 12px',
                  borderRadius: 4,
                }}
              >
                <Share2 size={16} /> Share
              </button>
            </div>

            {/* Sample Nested Comment */}
            {content.comments && content.comments.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: '#1877f2',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  C
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      backgroundColor: '#f0f2f5',
                      padding: '8px 12px',
                      borderRadius: 14,
                      display: 'inline-block',
                      maxWidth: '90%',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{content.comments[0].displayName}</div>
                    <div style={{ fontSize: 13, color: '#050505', marginTop: 2 }}>{content.comments[0].text}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#65676b', marginTop: 3, display: 'flex', gap: 10 }}>
                    <span style={{ fontWeight: 600 }}>Like</span>
                    <span style={{ fontWeight: 600 }}>Reply</span>
                  </div>
                </div>
              </div>
            )}
            </div>

            {renderWatermark()}
          </div>
        );
      }

      // 2. Twitter / X-Inspired Microblog Post Archetype
      if (isTwitter) {
        return (
          <div
            style={{
              width: 440,
              backgroundColor: '#000000',
              color: '#e7e9ea',
              borderRadius: 16,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              border: '1px solid #2f3336',
            }}
          >
            {/* Top Device Status Bar */}
            <DeviceStatusBar
              config={project.statusBar}
              theme="dark"
              style={{ backgroundColor: '#000000' }}
            />

            {/* Notification Banner Overlay if enabled */}
            <NotificationBanner config={project.notificationBanner} />

            <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Author Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <MockupAvatar
                  src={content.avatarUrl}
                  name={content.displayName || 'X User'}
                  size={40}
                  accentColor="#1d9bf0"
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#f7f9f9' }}>{content.displayName}</div>
                  <div style={{ fontSize: 13, color: '#71767b' }}>
                    {content.handle || '@sample_prototype'}
                  </div>
                </div>
              </div>
              <MoreHorizontal size={18} color="#71767b" />
            </div>

            {/* Post Content */}
            <div style={{ fontSize: 15, lineHeight: 1.5, wordBreak: 'break-word', color: '#e7e9ea' }}>
              {content.caption}
            </div>

            {/* Media */}
            {content.imageUrl ? (
              <img
                src={content.imageUrl}
                alt="Fictional post media"
                style={{ width: '100%', borderRadius: 12, maxHeight: 320, objectFit: 'cover' }}
              />
            ) : null}

            {/* Date & Views Row */}
            <div
              style={{
                fontSize: 13,
                color: '#71767b',
                padding: '8px 0',
                borderBottom: '1px solid #2f3336',
                display: 'flex',
                gap: 8,
              }}
            >
              <span>10:24 AM · Oct 17, 2026</span>
              <span>·</span>
              <span>
                <strong style={{ color: '#e7e9ea' }}>{content.viewsCount || '14.2K'}</strong> Views
              </span>
            </div>

            {/* Action Metrics Row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#71767b',
                paddingTop: 4,
                fontSize: 13,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MessageCircle size={17} /> <span>{content.commentsCount || 18}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Repeat size={17} /> <span>{content.repostsCount || 84}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Heart size={17} /> <span>{content.likesCount || 342}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Bookmark size={17} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Share2 size={17} />
              </div>
            </div>
            </div>

            {/* Microblog Bottom Navigation Dock with Notification Indicator */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '10px 0 8px',
                borderTop: '1px solid #2f3336',
                color: '#71767b',
              }}
            >
              <div style={{ cursor: 'pointer', color: '#1d9bf0' }}>
                <span style={{ fontSize: 16 }}>🏠</span>
              </div>
              <div style={{ cursor: 'pointer' }}>
                <Search size={18} />
              </div>
              <div style={{ position: 'relative', cursor: 'pointer' }}>
                <Bell size={18} />
                <span
                  style={{
                    position: 'absolute',
                    top: -1,
                    right: -1,
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: '#1d9bf0',
                  }}
                />
              </div>
              <div style={{ position: 'relative', cursor: 'pointer' }}>
                <Mail size={18} />
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -6,
                    backgroundColor: '#1d9bf0',
                    color: '#ffffff',
                    borderRadius: 10,
                    padding: '0 4px',
                    fontSize: 8,
                    fontWeight: 700,
                  }}
                >
                  2
                </span>
              </div>
            </div>

            {renderWatermark()}
          </div>
        );
      }

      // 3. Generic Feed Post Layout
      return (
        <div
          style={{
            width: 440,
            backgroundColor: theme.cardBackground || '#1e293b',
            color: theme.textColor || '#f8fafc',
            borderRadius: 14,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Top Device Status Bar */}
          <DeviceStatusBar
            config={project.statusBar}
            theme="dark"
            style={{ backgroundColor: theme.background || '#0f172a' }}
          />

          {/* Notification Banner Overlay if enabled */}
          <NotificationBanner config={project.notificationBanner} />

          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Post Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <MockupAvatar
              src={content.avatarUrl}
              name={content.displayName || 'Feed User'}
              size={44}
              accentColor={theme.accent || '#3b82f6'}
            />
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
          </div>

          {renderWatermark()}
        </div>
      );
    };

    /* -------------------------------------------------------------
     * PROFILE CARD RENDERING
     * ------------------------------------------------------------- */
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
          {/* Top Device Status Bar */}
          <DeviceStatusBar
            config={project.statusBar}
            theme="dark"
            style={{ backgroundColor: theme.accent || '#3b82f6' }}
          />

          {/* Notification Banner Overlay if enabled */}
          <NotificationBanner config={project.notificationBanner} />

          <div style={{ height: 80, backgroundColor: theme.accent || '#3b82f6', opacity: 0.8 }} />
          <div style={{ padding: '0 20px 24px 20px', marginTop: -40 }}>
            <MockupAvatar
              src={content.avatarUrl}
              name={content.displayName || 'Profile User'}
              size={76}
              accentColor="#0f172a"
              style={{ border: '3px solid #1e293b' }}
            />

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

    /* -------------------------------------------------------------
     * STORY RENDERING
     * ------------------------------------------------------------- */
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
          {/* Top Device Status Bar */}
          <DeviceStatusBar
            config={project.statusBar}
            theme="dark"
            style={{ margin: '-10px -10px 4px' }}
          />

          {/* Notification Banner Overlay if enabled */}
          <NotificationBanner config={project.notificationBanner} style={{ margin: '0 0 10px' }} />

          {/* Top Progress Dash Bars */}
          <div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: '#ffffff' }} />
              <div style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.35)' }} />
              <div style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.35)' }} />
            </div>

            {/* Author Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MockupAvatar
                src={content.avatarUrl}
                name={content.displayName || 'Story Creator'}
                size={36}
                storyRing={content.hasStoryRing ?? true}
              />
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

    /* -------------------------------------------------------------
     * SHORT VIDEO RENDERING
     * ------------------------------------------------------------- */
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

          {/* Top Device Status Bar */}
          <DeviceStatusBar
            config={project.statusBar}
            theme="dark"
            style={{ position: 'relative', zIndex: 12, backgroundColor: 'rgba(0,0,0,0.35)' }}
          />

          {/* Notification Banner Overlay if enabled */}
          <NotificationBanner config={project.notificationBanner} style={{ position: 'relative', zIndex: 12 }} />

          {/* Top Frame Counter Badge */}
          <div style={{ position: 'relative', zIndex: 10, padding: '8px 16px' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <MockupAvatar
                  src={content.avatarUrl}
                  name={content.creator || 'Fictional Creator'}
                  size={36}
                  accentColor="#6366f1"
                  style={{ border: '2px solid rgba(255,255,255,0.8)' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {content.creator || 'Fictional Creator'}
                  </div>
                  <div style={{ fontSize: 11, color: '#38bdf8' }}>
                    {content.handle || '@mock_reel'}
                  </div>
                </div>
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
