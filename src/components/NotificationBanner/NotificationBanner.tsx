import React from 'react';
import { NotificationBannerConfig } from '../../models/types';

interface NotificationBannerProps {
  config?: NotificationBannerConfig;
  style?: React.CSSProperties;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  config,
  style,
}) => {
  if (!config || !config.enabled) {
    return null;
  }

  const appName = config.appName || 'Messages';
  const timeAgo = config.timeAgo || 'now';
  const title = config.title || 'Notification';
  const message = config.message || 'You have a new sample message.';
  const emoji = config.avatarEmoji || '💬';

  return (
    <div
      data-testid="notification-banner"
      style={{
        margin: '6px 12px 10px',
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 14,
        padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22), 0 2px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        color: '#0f172a',
        position: 'relative',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Top App Identity Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 5,
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              color: '#ffffff',
            }}
          >
            {emoji}
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              color: '#475569',
            }}
          >
            {appName}
          </span>
        </div>
        <span style={{ fontSize: 10, color: '#64748b', fontWeight: 500 }}>{timeAgo}</span>
      </div>

      {/* Title & Message Preview */}
      <div style={{ fontWeight: 700, fontSize: 12.5, color: '#0f172a', marginTop: 2 }}>{title}</div>
      <div style={{ fontSize: 11.5, color: '#334155', lineHeight: 1.35, wordBreak: 'break-word' }}>
        {message}
      </div>

      {/* Subtle swipe pill handle */}
      <div
        style={{
          width: 32,
          height: 3,
          backgroundColor: '#cbd5e1',
          borderRadius: 2,
          margin: '5px auto 0',
        }}
      />
    </div>
  );
};
