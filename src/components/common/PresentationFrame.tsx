import React from 'react';
import { PresentationConfig } from '../../models/types';

interface PresentationFrameProps {
  config?: PresentationConfig;
  children: React.ReactNode;
}

export const PresentationFrame: React.FC<PresentationFrameProps> = ({ config, children }) => {
  if (!config) {
    return <>{children}</>;
  }

  const {
    deviceFrame = 'none',
    backdrop = 'transparent',
    aspectRatio = 'auto',
    cardElevation = true,
  } = config;

  // Backdrop Classes
  let backdropClasses = '';
  switch (backdrop) {
    case 'gradient-purple':
      backdropClasses = 'bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 p-6 sm:p-10';
      break;
    case 'gradient-sunset':
      backdropClasses = 'bg-gradient-to-tr from-amber-700 via-rose-700 to-purple-950 p-6 sm:p-10';
      break;
    case 'gradient-ocean':
      backdropClasses = 'bg-gradient-to-br from-cyan-950 via-blue-950 to-indigo-950 p-6 sm:p-10';
      break;
    case 'mesh-dark':
      backdropClasses = 'bg-[#0b0f17] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.35),rgba(255,255,255,0))] p-6 sm:p-10';
      break;
    case 'slate':
      backdropClasses = 'bg-slate-900 p-6 sm:p-10';
      break;
    case 'transparent':
    default:
      backdropClasses = 'bg-transparent';
      break;
  }

  // Aspect Ratio Classes
  let aspectClasses = '';
  switch (aspectRatio) {
    case '1:1':
      aspectClasses = 'aspect-square flex items-center justify-center';
      break;
    case '16:9':
      aspectClasses = 'aspect-video flex items-center justify-center';
      break;
    case '9:16':
      aspectClasses = 'aspect-[9/16] flex items-center justify-center';
      break;
    case '4:5':
      aspectClasses = 'aspect-[4/5] flex items-center justify-center';
      break;
    case 'auto':
    default:
      aspectClasses = 'w-full flex items-center justify-center';
      break;
  }

  // Render Frame Variations
  const renderFramedContent = () => {
    const elevationStyle = cardElevation
      ? 'shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
      : 'shadow-md';

    switch (deviceFrame) {
      case 'iphone':
        return (
          <div
            data-testid="presentation-frame-iphone"
            className={`relative max-w-sm w-full rounded-[48px] p-[10px] bg-neutral-900 border-[3px] border-neutral-700/80 ring-1 ring-white/10 ${elevationStyle}`}
          >
            {/* Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-20 flex items-center justify-end pr-2.5 space-x-1.5 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-neutral-800 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-blue-900/40"></span>
              </span>
            </div>

            {/* Inner Display */}
            <div className="rounded-[38px] overflow-hidden relative">
              {children}
            </div>

            {/* Home Indicator */}
            <div className="w-28 h-1 bg-white/30 rounded-full mx-auto mt-2 mb-0.5"></div>
          </div>
        );

      case 'browser':
        return (
          <div
            data-testid="presentation-frame-browser"
            className={`max-w-xl w-full rounded-2xl overflow-hidden border border-white/10 bg-slate-900 ${elevationStyle}`}
          >
            {/* Window Header */}
            <div className="bg-slate-800/90 px-4 py-2.5 border-b border-white/5 flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
              <div className="flex-1 text-center">
                <span className="text-[11px] text-slate-400 font-mono bg-slate-900/60 px-3 py-0.5 rounded-md inline-block">
                  🔒 social.mockup
                </span>
              </div>
            </div>
            {children}
          </div>
        );

      case 'card':
        return (
          <div
            data-testid="presentation-frame-card"
            className={`max-w-xl w-full rounded-2xl overflow-hidden border border-white/10 ${elevationStyle}`}
          >
            {children}
          </div>
        );

      case 'none':
      default:
        return <div className="w-full flex justify-center">{children}</div>;
    }
  };

  // If both backdrop is transparent and frame is none, and ratio is auto, return children without extra wrappers
  if (backdrop === 'transparent' && deviceFrame === 'none' && aspectRatio === 'auto') {
    return <>{children}</>;
  }

  return (
    <div
      data-testid="presentation-container"
      className={`relative w-full rounded-2xl overflow-hidden transition-all duration-300 ${backdropClasses} ${aspectClasses}`}
    >
      {renderFramedContent()}
    </div>
  );
};
