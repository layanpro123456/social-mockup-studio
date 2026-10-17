import React, { useState } from 'react';

export interface MockupAvatarProps {
  src?: string;
  name?: string;
  size?: number;
  shape?: 'circle' | 'rounded';
  showOnlineDot?: boolean;
  storyRing?: boolean;
  accentColor?: string;
  fontSize?: number;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

export function getInitials(name?: string): string {
  if (!name || !name.trim()) return '?';
  const clean = name.replace(/\([^)]*\)/g, '').trim(); // Remove suffixes like (Sample)
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return name.charAt(0).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export const MockupAvatar: React.FC<MockupAvatarProps> = ({
  src,
  name = 'User',
  size = 40,
  shape = 'circle',
  showOnlineDot = false,
  storyRing = false,
  accentColor,
  fontSize,
  className = '',
  style,
  alt,
}) => {
  const [hasError, setHasError] = useState(false);

  const borderRadius = shape === 'circle' ? '50%' : '10px';
  const calculatedFontSize = fontSize || Math.max(Math.round(size * 0.38), 11);
  const dotSize = Math.max(Math.round(size * 0.28), 9);

  // Background fallback color selection based on name hash if not provided
  const getFallbackBg = () => {
    if (accentColor) return accentColor;
    const colors = [
      '#6366f1', // Indigo
      '#0ea5e9', // Sky
      '#10b981', // Emerald
      '#f59e0b', // Amber
      '#ec4899', // Pink
      '#8b5cf6', // Violet
      '#14b8a6', // Teal
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = (name.charCodeAt(i) + ((hash << 5) - hash)) | 0;
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarContent = (
    <div
      data-testid="mockup-avatar"
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        userSelect: 'none',
        ...style,
      }}
      className={className}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt || name}
          data-testid="mockup-avatar-img"
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            borderRadius,
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <div
          data-testid="mockup-avatar-initials"
          style={{
            width: '100%',
            height: '100%',
            borderRadius,
            backgroundColor: getFallbackBg(),
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: calculatedFontSize,
            letterSpacing: -0.5,
          }}
        >
          {getInitials(name)}
        </div>
      )}

      {showOnlineDot && (
        <span
          data-testid="mockup-avatar-online-dot"
          style={{
            position: 'absolute',
            bottom: shape === 'circle' ? 1 : -2,
            right: shape === 'circle' ? 1 : -2,
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            border: '2px solid #0f172a',
            boxShadow: '0 0 4px rgba(34, 197, 94, 0.6)',
          }}
          title="Online"
        />
      )}
    </div>
  );

  if (storyRing) {
    const ringPadding = Math.max(Math.round(size * 0.06), 2.5);
    return (
      <div
        data-testid="mockup-avatar-story-ring"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          padding: ringPadding,
          background: 'linear-gradient(45deg, #f59e0b, #ec4899, #8b5cf6)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            padding: 1.5,
            backgroundColor: '#0f172a',
          }}
        >
          {avatarContent}
        </div>
      </div>
    );
  }

  return avatarContent;
};
