import { MockupProject, TemplateKind } from '../../models/types';
import { MANDATORY_WATERMARK_TEXT } from '../safety/SafetyGuard';

export const TEMPLATE_METADATA: Record<
  TemplateKind,
  { name: string; description: string; icon: string; defaultCanvas: string }
> = {
  chat: {
    name: 'Generic Chat',
    description: 'Fictional messaging conversation between two or more synthetic participants.',
    icon: 'MessageSquare',
    defaultCanvas: 'Phone portrait (375x667)',
  },
  'feed-post': {
    name: 'Feed Post',
    description: 'Generic social feed card with fictional author, media, caption, and reactions.',
    icon: 'Layout',
    defaultCanvas: 'Square card (500x500)',
  },
  'profile-card': {
    name: 'Profile Card',
    description: 'Fictional user profile card with sample follower metrics and bio.',
    icon: 'User',
    defaultCanvas: 'Portrait card (400x550)',
  },
  story: {
    name: 'Story Frame',
    description: 'Full-bleed ephemeral story frame with author banner and synthetic reactions.',
    icon: 'Smartphone',
    defaultCanvas: 'Mobile 9:16 (1080x1920)',
  },
  'short-video': {
    name: 'Short Video Frame',
    description: 'Multi-frame vertical video timeline for fictional short-form reels.',
    icon: 'Video',
    defaultCanvas: 'Vertical 9:16 (1080x1920)',
  },
};

export function createDefaultProject(template: TemplateKind): MockupProject {
  const timestamp = new Date().toISOString();
  const id = `mockup_${Date.now()}`;

  const baseProject: MockupProject = {
    schemaVersion: 1,
    id,
    title: `Sample ${TEMPLATE_METADATA[template].name}`,
    template,
    mockup: true,
    createdAt: timestamp,
    updatedAt: timestamp,
    theme: {
      background: '#090d16',
      accent: '#6366f1',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      textColor: '#f8fafc',
      cardBackground: '#131b2e',
    },
    fictionalLabel: {
      text: MANDATORY_WATERMARK_TEXT,
      enabled: true,
      position: 'bottom-right',
    },
    statusBar: {
      enabled: true,
      time: '9:41',
      networkType: '5G',
      signalBars: 4,
      wifiBars: 3,
      batteryLevel: 94,
      isCharging: false,
      showDynamicIsland: true,
    },
    notificationBanner: {
      enabled: false,
      appName: 'Messages',
      timeAgo: 'now',
      title: 'Alex Parker',
      message: 'Hey, have you checked the new design prototype?',
      avatarEmoji: '💬',
    },
    content: {},
  };

  switch (template) {
    case 'chat':
      baseProject.content = {
        conversationTitle: 'Fictional Project Chat',
        participants: [
          { id: 'user_1', name: 'Alex Parker (Sample)', handle: '@alex_fictional' },
          { id: 'user_2', name: 'Morgan Reed (Sample)', handle: '@morgan_demo' },
        ],
        messages: [
          {
            id: 'm1',
            senderId: 'user_2',
            senderName: 'Morgan Reed (Sample)',
            text: 'Hey Alex! Have you reviewed the new design mockups?',
            timestamp: '10:14 AM',
            isSelf: false,
            status: 'read',
          },
          {
            id: 'm2',
            senderId: 'user_1',
            senderName: 'Alex Parker (Sample)',
            text: 'Yes! The layout is clean and the fictional labels are clearly placed.',
            timestamp: '10:16 AM',
            isSelf: true,
            status: 'read',
          },
          {
            id: 'm3',
            senderId: 'user_2',
            senderName: 'Morgan Reed (Sample)',
            text: 'Awesome, let’s test the video export timeline next.',
            timestamp: '10:18 AM',
            isSelf: false,
            status: 'delivered',
          },
        ],
      };
      break;

    case 'feed-post':
      baseProject.content = {
        displayName: 'Jordan Creative (Sample)',
        handle: '@jordan_fictional',
        timestamp: '2h ago',
        caption: 'Prototyping synthetic interfaces for our educational case study. Everything here is fictional!',
        imageUrl: '',
        likesCount: 142,
        commentsCount: 18,
        sharesCount: 5,
        comments: [
          {
            id: 'c1',
            displayName: 'Taylor Prototyper',
            handle: '@taylor_test',
            text: 'Love the high-contrast watermark placement. Great clarity.',
            timestamp: '1h ago',
          },
        ],
      };
      break;

    case 'profile-card':
      baseProject.content = {
        displayName: 'Sam Storyboarder (Sample)',
        handle: '@sam_mockups',
        bio: 'Fictional educator & UI designer. Exploring sample datasets and storyboard sequences.',
        followersCount: 1250,
        followingCount: 340,
        postsCount: 48,
        isSampleMetric: true,
      };
      break;

    case 'story':
      baseProject.content = {
        displayName: 'Demo Creator',
        handle: '@demo_story',
        timestamp: '3h ago',
        caption: 'Behind the scenes in the prototyping studio ✨',
        backgroundColor: '#1e1b4b',
      };
      break;

    case 'short-video':
      baseProject.content = {
        creator: 'Fictional Filmmaker',
        handle: '@reel_demo',
        caption: 'Scene 01: Concept walkthrough (Fictional mock sequence)',
        audioTrack: 'Original Sound - Fictional Studio Audio',
      };
      baseProject.frames = [
        {
          id: 'frame_1',
          durationMs: 3000,
          transition: 'fade',
          content: { text: 'Frame 1: Prototype Intro' },
        },
        {
          id: 'frame_2',
          durationMs: 4000,
          transition: 'slide',
          content: { text: 'Frame 2: Interface Interaction' },
        },
      ];
      break;
  }

  return baseProject;
}
