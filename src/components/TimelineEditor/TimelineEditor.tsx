import React from 'react';
import { ShortVideoFrame } from '../../models/types';
import { Play, Pause, Plus, Trash2, Film, Clock } from 'lucide-react';

interface TimelineEditorProps {
  frames: ShortVideoFrame[];
  activeFrameIndex: number;
  isPlaying: boolean;
  onSelectFrame: (index: number) => void;
  onTogglePlay: () => void;
  onUpdateFrames: (frames: ShortVideoFrame[]) => void;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({
  frames,
  activeFrameIndex,
  isPlaying,
  onSelectFrame,
  onTogglePlay,
  onUpdateFrames,
}) => {
  const totalDurationMs = frames.reduce((acc, f) => acc + (f.durationMs || 3000), 0);
  const totalSeconds = (totalDurationMs / 1000).toFixed(1);

  const handleAddFrame = () => {
    if (frames.length >= 10) return; // Limit frames for performance
    const newFrame: ShortVideoFrame = {
      id: `frame_${Date.now()}`,
      durationMs: 3000,
      transition: 'fade',
      content: { text: `Frame ${frames.length + 1}: Synthetic Scene` },
    };
    onUpdateFrames([...frames, newFrame]);
    onSelectFrame(frames.length);
  };

  const handleDeleteFrame = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (frames.length <= 1) return; // Must have at least 1 frame
    const nextFrames = frames.filter((_, i) => i !== index);
    onUpdateFrames(nextFrames);
    if (activeFrameIndex >= nextFrames.length) {
      onSelectFrame(nextFrames.length - 1);
    }
  };

  const handleDurationChange = (index: number, durationMs: number) => {
    const updated = frames.map((f, i) => (i === index ? { ...f, durationMs } : f));
    onUpdateFrames(updated);
  };

  const handleTransitionChange = (index: number, transition: 'cut' | 'fade' | 'slide') => {
    const updated = frames.map((f, i) => (i === index ? { ...f, transition } : f));
    onUpdateFrames(updated);
  };

  const handleFrameTextChange = (index: number, text: string) => {
    const updated = frames.map((f, i) =>
      i === index ? { ...f, content: { ...f.content, text } } : f
    );
    onUpdateFrames(updated);
  };

  const activeFrame = frames[activeFrameIndex] || frames[0];

  return (
    <div
      style={{
        backgroundColor: '#111827',
        borderTop: '1px solid #2e3c54',
        padding: '14px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Timeline Header & Transport Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={onTogglePlay}
            className="btn-primary"
            style={{ padding: '6px 14px', fontSize: 13 }}
            title={isPlaying ? 'Pause Timeline' : 'Play Timeline Preview'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' }}>
            <Clock size={14} />
            <span>
              Total: <strong>{totalSeconds}s</strong> / 30.0s max
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddFrame}
          disabled={frames.length >= 10 || isPlaying}
          className="btn-secondary"
          style={{ fontSize: 12, padding: '6px 12px' }}
        >
          <Plus size={14} /> Add Frame
        </button>
      </div>

      {/* Frame Sequence Track */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          overflowX: 'auto',
          paddingBottom: 6,
        }}
      >
        {frames.map((frame, index) => {
          const isSelected = activeFrameIndex === index;
          return (
            <div
              key={frame.id}
              onClick={() => onSelectFrame(index)}
              style={{
                minWidth: 140,
                backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: isSelected ? '1px solid #6366f1' : '1px solid #374151',
                borderRadius: 8,
                padding: '8px 10px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: isSelected ? '#a5b4fc' : '#9ca3af' }}>
                  Frame {index + 1}
                </span>
                {frames.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteFrame(index, e)}
                    style={{ color: '#ef4444', padding: 2 }}
                    title="Delete Frame"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: '#e2e8f0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {String(frame.content?.text || 'Untitled Scene')}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8' }}>
                <span>{(frame.durationMs / 1000).toFixed(1)}s</span>
                <span style={{ textTransform: 'capitalize' }}>{frame.transition}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Frame Quick-Settings */}
      {activeFrame && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            padding: '8px 14px',
            borderRadius: 6,
            fontSize: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
            <span style={{ color: '#94a3b8' }}>Scene Text:</span>
            <input
              type="text"
              value={String(activeFrame.content?.text || '')}
              onChange={(e) => handleFrameTextChange(activeFrameIndex, e.target.value)}
              style={{ flex: 1, padding: '4px 8px', fontSize: 12 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#94a3b8' }}>Duration:</span>
            <select
              value={activeFrame.durationMs}
              onChange={(e) => handleDurationChange(activeFrameIndex, parseInt(e.target.value, 10))}
              style={{ padding: '4px 8px', fontSize: 12 }}
            >
              <option value={1500}>1.5s</option>
              <option value={2000}>2.0s</option>
              <option value={3000}>3.0s</option>
              <option value={4000}>4.0s</option>
              <option value={5000}>5.0s</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#94a3b8' }}>Transition:</span>
            <select
              value={activeFrame.transition}
              onChange={(e) =>
                handleTransitionChange(activeFrameIndex, e.target.value as 'cut' | 'fade' | 'slide')
              }
              style={{ padding: '4px 8px', fontSize: 12 }}
            >
              <option value="cut">Cut</option>
              <option value="fade">Fade</option>
              <option value="slide">Slide</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
