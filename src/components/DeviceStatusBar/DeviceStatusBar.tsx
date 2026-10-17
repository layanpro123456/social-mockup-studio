import React from 'react';
import { DeviceStatusBarConfig } from '../../models/types';
import { Wifi, Zap } from 'lucide-react';

interface DeviceStatusBarProps {
  config?: DeviceStatusBarConfig;
  theme?: 'light' | 'dark';
  customTextColor?: string;
  style?: React.CSSProperties;
}

export const DeviceStatusBar: React.FC<DeviceStatusBarProps> = ({
  config,
  theme = 'light',
  customTextColor,
  style,
}) => {
  if (config && config.enabled === false) {
    return null;
  }

  const time = config?.time || '9:41';
  const signalBars = config?.signalBars ?? 4;
  const networkType = config?.networkType || '5G';
  const batteryLevel = Math.max(1, Math.min(100, config?.batteryLevel ?? 94));
  const isCharging = config?.isCharging ?? false;
  const showDynamicIsland = config?.showDynamicIsland ?? true;

  const textColor = customTextColor || (theme === 'dark' ? '#f8fafc' : '#111827');
  const batteryFillColor = isCharging
    ? '#10b981'
    : batteryLevel <= 20
    ? '#ef4444'
    : textColor;

  return (
    <div
      data-testid="device-status-bar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 14px 4px',
        height: 32,
        fontSize: 12,
        fontWeight: 600,
        color: textColor,
        userSelect: 'none',
        position: 'relative',
        zIndex: 10,
        ...style,
      }}
    >
      {/* Left: Time & Network Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 60 }}>
        <span style={{ letterSpacing: -0.2, fontWeight: 700 }}>{time}</span>
        <span style={{ fontSize: 9, fontWeight: 700, opacity: 0.75, letterSpacing: -0.2 }}>
          {networkType}
        </span>
      </div>

      {/* Center: Dynamic Island / Camera Island */}
      {showDynamicIsland && (
        <div
          data-testid="dynamic-island"
          style={{
            width: 74,
            height: 18,
            backgroundColor: '#000000',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 6px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        >
          {/* Subtle camera lens reflection */}
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: '#0b1120',
              border: '1px solid #1e293b',
            }}
          />
          {/* Subtle sensor pill */}
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: '#0f172a',
            }}
          />
        </div>
      )}

      {/* Right: Cellular Signal + WiFi + Battery */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 60, justifyContent: 'flex-end' }}>
        {/* 4-Bar Signal Indicator SVG */}
        <svg
          data-testid="status-signal-bars"
          width="16"
          height="11"
          viewBox="0 0 16 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0.5" y="8" width="2.5" height="3" rx="0.75" fill={signalBars >= 1 ? textColor : textColor} opacity={signalBars >= 1 ? 1 : 0.25} />
          <rect x="4.5" y="5.5" width="2.5" height="5.5" rx="0.75" fill={signalBars >= 2 ? textColor : textColor} opacity={signalBars >= 2 ? 1 : 0.25} />
          <rect x="8.5" y="3" width="2.5" height="8" rx="0.75" fill={signalBars >= 3 ? textColor : textColor} opacity={signalBars >= 3 ? 1 : 0.25} />
          <rect x="12.5" y="0.5" width="2.5" height="10.5" rx="0.75" fill={signalBars >= 4 ? textColor : textColor} opacity={signalBars >= 4 ? 1 : 0.25} />
        </svg>

        {/* WiFi Icon */}
        <Wifi size={13} strokeWidth={2.5} style={{ opacity: 0.9 }} />

        {/* Battery Indicator with Fill & Percentage */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: -0.2 }}>{batteryLevel}%</span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 20,
                height: 10,
                borderRadius: 3,
                border: `1.5px solid ${textColor}`,
                padding: '1px',
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box',
                position: 'relative',
              }}
            >
              <div
                data-testid="status-battery-fill"
                style={{
                  width: `${batteryLevel}%`,
                  height: '100%',
                  backgroundColor: batteryFillColor,
                  borderRadius: 1,
                  transition: 'width 0.2s ease',
                }}
              />
              {isCharging && (
                <Zap
                  data-testid="status-battery-charging"
                  size={8}
                  fill={textColor}
                  color={textColor}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              )}
            </div>
            {/* Battery Positive Terminal Pip */}
            <div
              style={{
                width: 1.5,
                height: 4,
                backgroundColor: textColor,
                borderRadius: '0 1px 1px 0',
                marginLeft: 0.5,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
