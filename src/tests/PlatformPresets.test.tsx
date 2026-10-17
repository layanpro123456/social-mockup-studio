import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { applyPresetToProject, PLATFORM_PRESETS } from '../features/templates/platformPresets';
import { createDefaultProject } from '../features/templates/templateDefaults';
import { PreviewCanvas } from '../components/PreviewCanvas/PreviewCanvas';

describe('Platform-Inspired Presets & Archetypes', () => {
  it('correctly configures all defined platform presets metadata', () => {
    expect(PLATFORM_PRESETS.length).toBeGreaterThanOrEqual(4);
    const ids = PLATFORM_PRESETS.map((p) => p.id);
    expect(ids).toContain('whatsapp-style');
    expect(ids).toContain('facebook-style');
    expect(ids).toContain('twitter-style');
    expect(ids).toContain('instagram-style');
  });

  describe('WhatsApp-Inspired Emerald Messaging Preset', () => {
    it('applies emerald header and injects synthetic voice note data', () => {
      const baseChat = createDefaultProject('chat');
      const waProject = applyPresetToProject(baseChat, 'whatsapp-style');

      expect(waProject.presetStyle).toBe('whatsapp-style');
      expect(waProject.theme.accent).toBe('#00a884');
      expect(waProject.theme.cardBackground).toBe('#efeae2');
      expect(waProject.fictionalLabel.text).toBe('FICTIONAL MOCKUP');

      const messages = (waProject.content as any).messages;
      const hasAudio = messages.some((m: any) => !!m.audioNote);
      expect(hasAudio).toBe(true);
    });

    it('renders emerald chat layout with encryption disclaimer and watermark', () => {
      const baseChat = createDefaultProject('chat');
      const waProject = applyPresetToProject(baseChat, 'whatsapp-style');

      render(<PreviewCanvas project={waProject} />);

      expect(screen.getByText(/Messages and media are fictional for prototyping purposes/i)).toBeInTheDocument();
      expect(screen.getByText(/Today \(Sample\)/i)).toBeInTheDocument();
      expect(screen.getByText(/^0:14$/)).toBeInTheDocument();

      const watermark = screen.getByTestId('fictional-mockup-watermark');
      expect(watermark).toBeInTheDocument();
      expect(watermark).toHaveTextContent('FICTIONAL MOCKUP');
    });
  });

  describe('Facebook-Inspired Community Feed Preset', () => {
    it('applies classic blue theme and stacked reaction counts', () => {
      const baseFeed = createDefaultProject('feed-post');
      const fbProject = applyPresetToProject(baseFeed, 'facebook-style');

      expect(fbProject.presetStyle).toBe('facebook-style');
      expect(fbProject.theme.accent).toBe('#1877f2');
      expect(fbProject.theme.cardBackground).toBe('#ffffff');

      const reactions = (fbProject.content as any).reactions;
      expect(reactions.like).toBeGreaterThan(0);
      expect(reactions.love).toBeGreaterThan(0);
    });

    it('renders stacked reaction emojis, audience icon, and action buttons', () => {
      const baseFeed = createDefaultProject('feed-post');
      const fbProject = applyPresetToProject(baseFeed, 'facebook-style');

      render(<PreviewCanvas project={fbProject} />);

      expect(screen.getByRole('button', { name: /Like/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Comment/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Share/i })).toBeInTheDocument();

      const watermark = screen.getByTestId('fictional-mockup-watermark');
      expect(watermark).toBeInTheDocument();
    });
  });

  describe('X / Twitter-Inspired Microblog Preset', () => {
    it('applies dark theme and repost/view impression metrics', () => {
      const baseFeed = createDefaultProject('feed-post');
      const xProject = applyPresetToProject(baseFeed, 'twitter-style');

      expect(xProject.presetStyle).toBe('twitter-style');
      expect(xProject.theme.background).toBe('#000000');
      expect(xProject.theme.accent).toBe('#1d9bf0');

      const content = xProject.content as any;
      expect(content.repostsCount).toBeGreaterThan(0);
      expect(content.viewsCount).toBeGreaterThan(0);
    });

    it('renders microblog post layout with views and repost metrics', () => {
      const baseFeed = createDefaultProject('feed-post');
      const xProject = applyPresetToProject(baseFeed, 'twitter-style');

      render(<PreviewCanvas project={xProject} />);

      expect(screen.getByText(/Views/i)).toBeInTheDocument();
      const watermark = screen.getByTestId('fictional-mockup-watermark');
      expect(watermark).toBeInTheDocument();
    });
  });
});
