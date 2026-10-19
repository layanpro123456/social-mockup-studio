import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PLATFORM_PRESETS, applyPresetToProject } from '../features/templates/platformPresets';
import { VIRAL_SCENARIOS } from '../features/templates/viralScenarios';
import { VerifiedBadge } from '../components/common/VerifiedBadge';
import { PresentationFrame } from '../components/common/PresentationFrame';
import { PreviewCanvas } from '../components/PreviewCanvas/PreviewCanvas';
import { MockupProject } from '../models/types';

describe('Viral Enhancements Suite', () => {
  describe('Preset Registrations & Presets Engine', () => {
    it('registers imessage-style and linkedin-style in PLATFORM_PRESETS', () => {
      const imessage = PLATFORM_PRESETS.find((p) => p.id === 'imessage-style');
      const linkedin = PLATFORM_PRESETS.find((p) => p.id === 'linkedin-style');

      expect(imessage).toBeDefined();
      expect(imessage?.name).toContain('iMessage');
      expect(linkedin).toBeDefined();
      expect(linkedin?.name).toContain('LinkedIn');
    });

    it('applies imessage-style preset to chat project', () => {
      const baseProject: MockupProject = {
        schemaVersion: 1,
        mockup: true,
        id: 'p1',
        title: 'Test Chat',
        template: 'chat',
        presetStyle: 'default',
        theme: { background: '#000', accent: '#fff', fontFamily: 'sans-serif' },
        fictionalLabel: { text: 'FICTIONAL MOCKUP', enabled: true, position: 'bottom-right' },
        content: {
          conversationTitle: '',
          participants: [],
          messages: [],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = applyPresetToProject(baseProject, 'imessage-style');
      expect(updated.presetStyle).toBe('imessage-style');
      expect(updated.theme.accent).toBe('#007aff');
      const content = updated.content as any;
      expect(content.typingIndicator).toBe(true);
      expect(content.verifiedBadge).toBe('blue');
    });

    it('applies linkedin-style preset to feed post project', () => {
      const baseProject: MockupProject = {
        schemaVersion: 1,
        mockup: true,
        id: 'p2',
        title: 'Test Post',
        template: 'feed-post',
        presetStyle: 'default',
        theme: { background: '#000', accent: '#fff', fontFamily: 'sans-serif' },
        fictionalLabel: { text: 'FICTIONAL MOCKUP', enabled: true, position: 'bottom-right' },
        content: {
          displayName: 'Test User',
          handle: 'testuser',
          timestamp: '1h',
          caption: 'Hello world',
          likesCount: 10,
          commentsCount: 2,
          sharesCount: 1,
          comments: [],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = applyPresetToProject(baseProject, 'linkedin-style');
      expect(updated.presetStyle).toBe('linkedin-style');
      expect(updated.theme.accent).toBe('#0a66c2');
      const content = updated.content as any;
      expect(content.authorTitle).toBeDefined();
      expect(content.reactions?.celebrate).toBeDefined();
      expect(content.reactions?.insight).toBeDefined();
    });
  });

  describe('Viral Scenario Packs', () => {
    it('contains 6 curated viral scenarios', () => {
      expect(VIRAL_SCENARIOS.length).toBe(6);
      const ids = VIRAL_SCENARIOS.map((s) => s.id);
      expect(ids).toContain('wrong-group-chat');
      expect(ids).toContain('linkedin-thought-leader');
      expect(ids).toContain('founder-day-3');
      expect(ids).toContain('ghosted-on-read');
      expect(ids).toContain('support-hero');
      expect(ids).toContain('accidental-leak');
    });

    it('generates projects with mandatory watermark intact', () => {
      VIRAL_SCENARIOS.forEach((scenario) => {
        const proj = scenario.createProject();
        expect(proj.fictionalLabel.enabled).toBe(true);
        expect(proj.fictionalLabel.text).toBe('FICTIONAL MOCKUP');
        expect(proj.presentation).toBeDefined();
      });
    });
  });

  describe('VerifiedBadge Component', () => {
    it('renders blue verified badge', () => {
      render(<VerifiedBadge type="blue" />);
      expect(screen.getByTestId('verified-badge-blue')).toBeInTheDocument();
    });

    it('renders gold verified badge', () => {
      render(<VerifiedBadge type="gold" />);
      expect(screen.getByTestId('verified-badge-gold')).toBeInTheDocument();
    });

    it('renders gray verified badge', () => {
      render(<VerifiedBadge type="gray" />);
      expect(screen.getByTestId('verified-badge-gray')).toBeInTheDocument();
    });

    it('renders nothing when type is none', () => {
      const { container } = render(<VerifiedBadge type="none" />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('PresentationFrame Component', () => {
    it('renders iphone frame when configured', () => {
      render(
        <PresentationFrame config={{ deviceFrame: 'iphone', backdrop: 'gradient-sunset', aspectRatio: '9:16' }}>
          <div>Inner Content</div>
        </PresentationFrame>
      );

      expect(screen.getByTestId('presentation-frame-iphone')).toBeInTheDocument();
      expect(screen.getByText('Inner Content')).toBeInTheDocument();
    });

    it('renders browser window frame with dots', () => {
      render(
        <PresentationFrame config={{ deviceFrame: 'browser', backdrop: 'mesh-dark', aspectRatio: '4:5' }}>
          <div>Browser Page</div>
        </PresentationFrame>
      );

      expect(screen.getByTestId('presentation-frame-browser')).toBeInTheDocument();
      expect(screen.getByText('🔒 social.mockup')).toBeInTheDocument();
    });

    it('renders 3D elevated card frame', () => {
      render(
        <PresentationFrame config={{ deviceFrame: 'card', backdrop: 'slate', aspectRatio: '1:1' }}>
          <div>Card Content</div>
        </PresentationFrame>
      );

      expect(screen.getByTestId('presentation-frame-card')).toBeInTheDocument();
    });
  });

  describe('PreviewCanvas Integration', () => {
    it('renders iMessage mockup with typing dots and bubble styling', () => {
      const wrongChatScenario = VIRAL_SCENARIOS.find((s) => s.id === 'wrong-group-chat')!;
      const project = wrongChatScenario.createProject();

      render(<PreviewCanvas project={project} />);

      expect(screen.getByTestId('imessage-chat-mockup')).toBeInTheDocument();
      expect(screen.getByTestId('imessage-typing-indicator')).toBeInTheDocument();
      expect(screen.getByText('Mom & Dad ❤️')).toBeInTheDocument();
      expect(screen.getByText('FICTIONAL MOCKUP')).toBeInTheDocument();
    });

    it('renders LinkedIn post mockup with reactions and headline', () => {
      const linkedinScenario = VIRAL_SCENARIOS.find((s) => s.id === 'linkedin-thought-leader')!;
      const project = linkedinScenario.createProject();

      render(<PreviewCanvas project={project} />);

      expect(screen.getByTestId('linkedin-post-mockup')).toBeInTheDocument();
      expect(screen.getByText('Brad Chadderton')).toBeInTheDocument();
      expect(screen.getByText(/Ex-BigTech Intern/)).toBeInTheDocument();
      expect(screen.getByText('FICTIONAL MOCKUP')).toBeInTheDocument();
    });
  });
});
