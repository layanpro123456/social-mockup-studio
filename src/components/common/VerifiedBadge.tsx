import React from 'react';
import { VerifiedBadgeType } from '../../models/types';

interface VerifiedBadgeProps {
  type?: VerifiedBadgeType;
  className?: string;
  size?: number;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  type = 'none',
  className = 'inline-block ml-1 align-middle',
  size = 16,
}) => {
  if (!type || type === 'none') return null;

  let fillColor = '#1d9bf0'; // default blue
  let checkColor = '#ffffff';

  if (type === 'gold') {
    fillColor = '#e2b714';
    checkColor = '#000000';
  } else if (type === 'gray') {
    fillColor = '#829aab';
    checkColor = '#ffffff';
  }

  return (
    <span
      className={className}
      title={`Verified badge (${type})`}
      data-testid={`verified-badge-${type}`}
      style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {type === 'gold' ? (
          // Rounded square for gold org badges
          <rect x="2" y="2" width="20" height="20" rx="5" fill={fillColor} />
        ) : (
          // Scalloped circular badge for blue/gray
          <path
            d="M9 1.5l1.6 2.1 2.6-.7.9 2.5 2.6.4.2 2.6 2.3 1.3-.6 2.6 1.8 1.9-1.3 2.3.9 2.5-2.1 1.6.2 2.6-2.5.9-.7 2.6-2.6-.2-1.3 2.3-2.3-1.3-1.9 1.8-1.6-2.1-2.6.7-.9-2.5-2.6-.4-.2-2.6-2.3-1.3.6-2.6-1.8-1.9 1.3-2.3-.9-2.5 2.1-1.6-.2-2.6 2.5-.9.7-2.6 2.6.2 1.3-2.3 2.3 1.3 1.9-1.8z"
            fill={fillColor}
            transform="scale(0.85) translate(2, 2)"
          />
        )}
        {/* Checkmark */}
        <path
          d="M7 12.5L10.2 15.5L17 8.5"
          stroke={checkColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};
