import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MockupAvatar, getInitials } from '../components/common/MockupAvatar';
import { PreviewCanvas } from '../components/PreviewCanvas/PreviewCanvas';
import { createDefaultProject } from '../features/templates/templateDefaults';
import { validateImageFile } from '../features/safety/AssetSanitizer';

describe('Profile Picture Customization Suite', () => {
  describe('MockupAvatar Component', () => {
    it('computes clean initials without brackets or sample suffixes', () => {
      expect(getInitials('Alex Parker')).toBe('AP');
      expect(getInitials('Jordan')).toBe('JO');
      expect(getInitials('Sam Storyboarder (Sample)')).toBe('SS');
      expect(getInitials('')).toBe('?');
    });

    it('renders image element when a valid URL is provided', () => {
      render(
        <MockupAvatar
          src="https://example.com/avatar.jpg"
          name="Alex Parker"
          size={44}
        />
      );

      const img = screen.getByTestId('mockup-avatar-img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
      expect(img).toHaveAttribute('alt', 'Alex Parker');
    });

    it('renders fallback initials when no image URL is provided', () => {
      render(<MockupAvatar name="Morgan Reed" size={40} />);

      const initials = screen.getByTestId('mockup-avatar-initials');
      expect(initials).toBeInTheDocument();
      expect(initials).toHaveTextContent('MR');
    });

    it('falls back to initials if image load triggers an error', () => {
      render(
        <MockupAvatar
          src="https://invalid-broken-domain.example/avatar.jpg"
          name="Taylor Swift"
          size={40}
        />
      );

      const img = screen.getByTestId('mockup-avatar-img');
      fireEvent.error(img);

      expect(screen.getByTestId('mockup-avatar-initials')).toHaveTextContent('TS');
    });

    it('renders green online status indicator dot when showOnlineDot is enabled', () => {
      render(
        <MockupAvatar
          name="Alex Parker"
          showOnlineDot={true}
        />
      );

      const dot = screen.getByTestId('mockup-avatar-online-dot');
      expect(dot).toBeInTheDocument();
      expect(dot).toHaveAttribute('title', 'Online');
    });

    it('renders gradient story ring wrapper when storyRing is enabled', () => {
      render(
        <MockupAvatar
          name="Creator Story"
          storyRing={true}
        />
      );

      const ring = screen.getByTestId('mockup-avatar-story-ring');
      expect(ring).toBeInTheDocument();
    });
  });

  describe('Security & Asset Validation for Avatars', () => {
    it('rejects SVG files to prevent script injection in avatars', () => {
      const svgFile = new File(['<svg onload="alert(1)"></svg>'], 'avatar.svg', {
        type: 'image/svg+xml',
      });
      const validation = validateImageFile(svgFile);
      expect(validation.isValid).toBe(false);
      expect(validation.error).toMatch(/SVG image uploads are disallowed/i);
    });

    it('accepts valid PNG and JPEG avatar files within size limit', () => {
      const pngFile = new File([new Uint8Array(500)], 'avatar.png', {
        type: 'image/png',
      });
      const validation = validateImageFile(pngFile);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('PreviewCanvas Integration across Templates', () => {
    it('renders MockupAvatar in Chat template header with contact photo or initials', () => {
      const project = createDefaultProject('chat');
      project.content = {
        ...project.content,
        contactAvatarUrl: 'https://example.com/alex.jpg',
        conversationTitle: 'Alex Parker',
        contactIsOnline: true,
      };

      render(<PreviewCanvas project={project} />);

      const avatar = screen.getByTestId('mockup-avatar');
      expect(avatar).toBeInTheDocument();
      const dot = screen.getByTestId('mockup-avatar-online-dot');
      expect(dot).toBeInTheDocument();
    });

    it('renders MockupAvatar in Feed Post template header', () => {
      const project = createDefaultProject('feed-post');
      project.content = {
        ...project.content,
        displayName: 'Jordan Creative',
        avatarUrl: 'https://example.com/jordan.png',
      };

      render(<PreviewCanvas project={project} />);

      const avatarImg = screen.getByTestId('mockup-avatar-img');
      expect(avatarImg).toHaveAttribute('src', 'https://example.com/jordan.png');
    });

    it('renders large MockupAvatar in Profile Card template', () => {
      const project = createDefaultProject('profile-card');
      project.content = {
        ...project.content,
        displayName: 'Sam Storyboarder',
        avatarUrl: '',
      };

      render(<PreviewCanvas project={project} />);

      const initials = screen.getByTestId('mockup-avatar-initials');
      expect(initials).toHaveTextContent('SS');
    });

    it('renders MockupAvatar with story ring in Story Frame template', () => {
      const project = createDefaultProject('story');
      project.content = {
        ...project.content,
        displayName: 'Demo Creator',
        hasStoryRing: true,
      };

      render(<PreviewCanvas project={project} />);

      const ring = screen.getByTestId('mockup-avatar-story-ring');
      expect(ring).toBeInTheDocument();
    });

    it('renders MockupAvatar for creator in Short Video template', () => {
      const project = createDefaultProject('short-video');
      project.content = {
        ...project.content,
        creator: 'Fictional Filmmaker',
        avatarUrl: 'https://example.com/filmmaker.jpg',
      };

      render(<PreviewCanvas project={project} />);

      const avatarImg = screen.getByTestId('mockup-avatar-img');
      expect(avatarImg).toHaveAttribute('src', 'https://example.com/filmmaker.jpg');
    });
  });
});
