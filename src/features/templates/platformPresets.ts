import { MockupProject, PresetStyle, ChatContent, FeedPostContent } from '../../models/types';

export interface PresetInfo {
  id: PresetStyle;
  name: string;
  tagline: string;
  compatibleTemplates: Array<'chat' | 'feed-post' | 'story' | 'profile-card' | 'short-video'>;
}

export const PLATFORM_PRESETS: PresetInfo[] = [
  {
    id: 'default',
    name: 'Modern Generic',
    tagline: 'Clean neutral dark-mode layout for general prototyping.',
    compatibleTemplates: ['chat', 'feed-post', 'profile-card', 'story', 'short-video'],
  },
  {
    id: 'whatsapp-style',
    name: 'Emerald Messaging (WhatsApp-Inspired)',
    tagline: 'Teal/emerald chat header, wallpaper pattern, bubble tails, and synthetic audio note.',
    compatibleTemplates: ['chat'],
  },
  {
    id: 'facebook-style',
    name: 'Community Feed (Facebook-Inspired)',
    tagline: 'Classic social network card with stacked reaction emojis and public audience badge.',
    compatibleTemplates: ['feed-post'],
  },
  {
    id: 'twitter-style',
    name: 'Microblog Post (X-Inspired)',
    tagline: 'Monochrome microblog with repost counters and metric impressions.',
    compatibleTemplates: ['feed-post'],
  },
  {
    id: 'instagram-style',
    name: 'Visual Story (Instagram-Inspired)',
    tagline: 'Vibrant gradient story rings, segmented progress ticks, and sticker prompts.',
    compatibleTemplates: ['story', 'feed-post'],
  },
  {
    id: 'imessage-style',
    name: 'iOS iMessage (Apple-Inspired)',
    tagline: 'Authentic blue/green bubbles, incoming gray bubbles, typing indicator, and iOS header.',
    compatibleTemplates: ['chat'],
  },
  {
    id: 'linkedin-style',
    name: 'B2B Creator Post (LinkedIn-Inspired)',
    tagline: 'Professional post with author headline, connection degree, and celebrate reactions.',
    compatibleTemplates: ['feed-post'],
  },
];

export function applyPresetToProject(project: MockupProject, preset: PresetStyle): MockupProject {
  const updated: MockupProject = {
    ...project,
    presetStyle: preset,
    updatedAt: new Date().toISOString(),
  };

  switch (preset) {
    case 'whatsapp-style':
      updated.theme = {
        background: '#0b141a',
        accent: '#00a884',
        fontFamily: 'Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, sans-serif',
        textColor: '#111b21',
        cardBackground: '#efeae2',
      };
      if (project.template === 'chat') {
        const chat = project.content as unknown as ChatContent;
        // Inject a synthetic sample voice note if not present
        const hasAudio = chat.messages?.some((m) => !!m.audioNote);
        if (!hasAudio) {
          const sampleAudioMessage = {
            id: `msg_audio_${Date.now()}`,
            senderId: 'user_other',
            senderName: 'Morgan Reed (Sample)',
            text: 'Voice note (0:14)',
            timestamp: '10:19 AM',
            isSelf: false,
            status: 'read' as const,
            audioNote: {
              durationSec: 14,
              playedSec: 6,
            },
          };
          updated.content = {
            ...chat,
            conversationTitle: chat.conversationTitle || 'Fictional Team Chat',
            messages: [...(chat.messages || []), sampleAudioMessage],
          };
        }
      }
      break;

    case 'facebook-style':
      updated.theme = {
        background: '#f0f2f5',
        accent: '#1877f2',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        textColor: '#050505',
        cardBackground: '#ffffff',
      };
      if (project.template === 'feed-post') {
        const feed = project.content as unknown as FeedPostContent;
        updated.content = {
          ...feed,
          reactions: feed.reactions || {
            like: 342,
            love: 128,
            haha: 45,
            wow: 12,
          },
        };
      }
      break;

    case 'twitter-style':
      updated.theme = {
        background: '#000000',
        accent: '#1d9bf0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        textColor: '#e7e9ea',
        cardBackground: '#000000',
      };
      if (project.template === 'feed-post') {
        const feed = project.content as unknown as FeedPostContent;
        updated.content = {
          ...feed,
          repostsCount: feed.repostsCount ?? 84,
          viewsCount: feed.viewsCount ?? 14200,
        };
      }
      break;

    case 'instagram-style':
      updated.theme = {
        background: '#000000',
        accent: '#e1306c',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        textColor: '#ffffff',
        cardBackground: '#121212',
      };
      break;

    case 'imessage-style':
      updated.theme = {
        background: '#ffffff',
        accent: '#007aff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
        textColor: '#000000',
        cardBackground: '#f2f2f7',
      };
      if (project.template === 'chat') {
        const chat = project.content as unknown as ChatContent;
        updated.content = {
          ...chat,
          conversationTitle: chat.conversationTitle || 'Alex Morgan',
          typingIndicator: chat.typingIndicator ?? true,
          verifiedBadge: chat.verifiedBadge ?? 'blue',
          isSMSMode: chat.isSMSMode ?? false,
        };
      }
      break;

    case 'linkedin-style':
      updated.theme = {
        background: '#f3f2ef',
        accent: '#0a66c2',
        fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        textColor: '#181818',
        cardBackground: '#ffffff',
      };
      if (project.template === 'feed-post') {
        const feed = project.content as unknown as FeedPostContent;
        updated.content = {
          ...feed,
          authorTitle: feed.authorTitle || 'Founder & CEO @ Stealth Startup | Building the future of AI | Forbes 30u30',
          verifiedBadge: feed.verifiedBadge ?? 'blue',
          reactions: feed.reactions || {
            like: 1243,
            love: 512,
            haha: 45,
            celebrate: 320,
            insight: 189,
          },
        };
      }
      break;

    default:
      updated.presetStyle = 'default';
      break;
  }

  return updated;
}
