import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DeviceStatusBar } from '../components/DeviceStatusBar/DeviceStatusBar';
import { NotificationBanner } from '../components/NotificationBanner/NotificationBanner';
import { PreviewCanvas } from '../components/PreviewCanvas/PreviewCanvas';
import { createDefaultProject } from '../features/templates/templateDefaults';
import { applyPresetToProject } from '../features/templates/platformPresets';

describe('Minute Device Details — Status Bar & Notifications', () => {
  describe('DeviceStatusBar Component', () => {
    it('renders time, signal, wifi, and battery percentage by default', () => {
      render(
        <DeviceStatusBar
          config={{
            enabled: true,
            time: '9:41',
            networkType: '5G',
            signalBars: 4,
            wifiBars: 3,
            batteryLevel: 94,
            isCharging: false,
            showDynamicIsland: true,
          }}
        />
      );

      expect(screen.getByText('9:41')).toBeInTheDocument();
      expect(screen.getByText('5G')).toBeInTheDocument();
      expect(screen.getByText('94%')).toBeInTheDocument();
      expect(screen.getByTestId('status-signal-bars')).toBeInTheDocument();
      expect(screen.getByTestId('dynamic-island')).toBeInTheDocument();
      expect(screen.queryByTestId('status-battery-charging')).not.toBeInTheDocument();
    });

    it('renders charging glyph when isCharging is enabled', () => {
      render(
        <DeviceStatusBar
          config={{
            enabled: true,
            time: '11:22',
            batteryLevel: 80,
            isCharging: true,
          }}
        />
      );

      expect(screen.getByText('11:22')).toBeInTheDocument();
      expect(screen.getByText('80%')).toBeInTheDocument();
      expect(screen.getByTestId('status-battery-charging')).toBeInTheDocument();
    });

    it('returns null when status bar is disabled', () => {
      const { container } = render(
        <DeviceStatusBar
          config={{
            enabled: false,
            time: '9:41',
          }}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('NotificationBanner Component', () => {
    it('renders push notification details when enabled', () => {
      render(
        <NotificationBanner
          config={{
            enabled: true,
            appName: 'Mockup Messages',
            timeAgo: 'now',
            title: 'Sarah Jenkins',
            message: 'Check out the new design prototype! 🚀',
            avatarEmoji: '💬',
          }}
        />
      );

      expect(screen.getByTestId('notification-banner')).toBeInTheDocument();
      expect(screen.getByText(/Mockup Messages/i)).toBeInTheDocument();
      expect(screen.getByText('Sarah Jenkins')).toBeInTheDocument();
      expect(screen.getByText('Check out the new design prototype! 🚀')).toBeInTheDocument();
      expect(screen.getByText('now')).toBeInTheDocument();
    });

    it('does not render when disabled', () => {
      const { container } = render(
        <NotificationBanner
          config={{
            enabled: false,
            appName: 'Messages',
            timeAgo: 'now',
            title: 'Test',
            message: 'Hidden',
          }}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('PreviewCanvas Integration & Minute Details', () => {
    it('renders status bar and notification badge on WhatsApp chat', () => {
      const baseChat = createDefaultProject('chat');
      const waProject = applyPresetToProject(baseChat, 'whatsapp-style');
      waProject.statusBar = {
        enabled: true,
        time: '9:41',
        signalBars: 4,
        batteryLevel: 98,
        networkType: '5G',
      };
      waProject.notificationBanner = {
        enabled: true,
        appName: 'Fictional Chat',
        timeAgo: '1m ago',
        title: 'Morgan Reed',
        message: 'Sent an audio note',
      };

      render(<PreviewCanvas project={waProject} />);

      expect(screen.getByTestId('device-status-bar')).toBeInTheDocument();
      expect(screen.getByText('9:41')).toBeInTheDocument();
      expect(screen.getByText('98%')).toBeInTheDocument();
      expect(screen.getByTestId('notification-banner')).toBeInTheDocument();
      expect(screen.getByText('Morgan Reed')).toBeInTheDocument();

      // Watermark must remain visible
      expect(screen.getByTestId('fictional-mockup-watermark')).toBeInTheDocument();
    });

    it('renders status bar, community notification bell, and feed reactions on Facebook archetype', () => {
      const baseFeed = createDefaultProject('feed-post');
      const fbProject = applyPresetToProject(baseFeed, 'facebook-style');

      render(<PreviewCanvas project={fbProject} />);

      expect(screen.getByTestId('device-status-bar')).toBeInTheDocument();
      expect(screen.getByText('community')).toBeInTheDocument();
      expect(screen.getByTestId('fictional-mockup-watermark')).toBeInTheDocument();
    });

    it('renders dark status bar and notification bell indicator on Twitter / X microblog', () => {
      const baseFeed = createDefaultProject('feed-post');
      const xProject = applyPresetToProject(baseFeed, 'twitter-style');

      render(<PreviewCanvas project={xProject} />);

      expect(screen.getByTestId('device-status-bar')).toBeInTheDocument();
      expect(screen.getByText(/Views/i)).toBeInTheDocument();
      expect(screen.getByTestId('fictional-mockup-watermark')).toBeInTheDocument();
    });
  });
});
