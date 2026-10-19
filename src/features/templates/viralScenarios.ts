import { MockupProject } from '../../models/types';

export interface ViralScenario {
  id: string;
  title: string;
  category: 'Drama & Comedy' | 'B2B & Startup' | 'Dating & Relatable' | 'Support & Tech' | 'Leaks & Hype';
  description: string;
  emoji: string;
  createProject: () => MockupProject;
}

export const VIRAL_SCENARIOS: ViralScenario[] = [
  {
    id: 'wrong-group-chat',
    title: 'The Wrong Group Chat',
    category: 'Drama & Comedy',
    description: 'Accidental confession sent directly to mom & dad instead of friends.',
    emoji: '😱',
    createProject: () => ({
      schemaVersion: 1,
      mockup: true,
      id: `proj_scenario_wrong_chat_${Date.now()}`,
      title: 'Wrong Group Chat (iMessage)',
      template: 'chat',
      presetStyle: 'imessage-style',
      theme: {
        background: '#ffffff',
        accent: '#007aff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
        textColor: '#000000',
        cardBackground: '#f2f2f7',
      },
      fictionalLabel: {
        text: 'FICTIONAL MOCKUP',
        enabled: true,
        position: 'bottom-right',
      },
      presentation: {
        deviceFrame: 'iphone',
        backdrop: 'gradient-sunset',
        aspectRatio: '9:16',
        cardElevation: true,
      },
      content: {
        conversationTitle: 'Mom & Dad ❤️',
        contactIsOnline: true,
        typingIndicator: true,
        verifiedBadge: 'none',
        isSMSMode: false,
        participants: [
          { id: 'user_mom', name: 'Mom & Dad', handle: 'parents' },
          { id: 'user_me', name: 'Me', handle: 'me' },
        ],
        messages: [
          {
            id: 'm1',
            senderId: 'user_mom',
            senderName: 'Mom & Dad',
            text: 'Are you coming home for dinner tonight honey? We made your favorite lasagna! 🍝',
            timestamp: '6:45 PM',
            isSelf: false,
            status: 'read',
          },
          {
            id: 'm2',
            senderId: 'user_me',
            senderName: 'Me',
            text: 'Yeah! Bringing the fake IDs and the tequila for later tonight too 🎉',
            timestamp: '6:46 PM',
            isSelf: true,
            status: 'delivered',
          },
          {
            id: 'm3',
            senderId: 'user_me',
            senderName: 'Me',
            text: 'WAIT WRONG CHAT PLEASE DONT READ THAT 😭💀',
            timestamp: '6:46 PM',
            isSelf: true,
            status: 'delivered',
          },
        ],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  },
  {
    id: 'linkedin-thought-leader',
    title: 'LinkedIn Thought Leader Satire',
    category: 'B2B & Startup',
    description: 'Ultra-cringe grindset post with 3 AM wakeups, cold showers, and B2B SaaS synergy.',
    emoji: '💼',
    createProject: () => ({
      schemaVersion: 1,
      mockup: true,
      id: `proj_scenario_linkedin_${Date.now()}`,
      title: 'LinkedIn Thought Leader Post',
      template: 'feed-post',
      presetStyle: 'linkedin-style',
      theme: {
        background: '#f3f2ef',
        accent: '#0a66c2',
        fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        textColor: '#181818',
        cardBackground: '#ffffff',
      },
      fictionalLabel: {
        text: 'FICTIONAL MOCKUP',
        enabled: true,
        position: 'bottom-right',
      },
      presentation: {
        deviceFrame: 'browser',
        backdrop: 'gradient-purple',
        aspectRatio: '4:5',
        cardElevation: true,
      },
      content: {
        displayName: 'Brad Chadderton',
        handle: 'brad-disruptor',
        authorTitle: 'Ex-BigTech Intern | 10x Solopreneur | I stare at cold showers at 3:15 AM | Forbes 30u30 Watchlist',
        verifiedBadge: 'blue',
        timestamp: '2h • 🌐',
        caption: `Today I fired my entire engineering department and replaced them with a single shell script.

Here is what it taught me about B2B SaaS synergy and executive leadership:

1. Humility is everything.
2. When you sleep 2 hours a night, you don't dream, you execute.
3. Culture isn't ping-pong tables. It's weeping in your Tesla together after an all-hands.

What are your thoughts on ruthlessly replacing humans with bash loops? Agree? 👇

#leadership #grindset #hustle #synergy #ai #culture`,
        likesCount: 14200,
        commentsCount: 890,
        sharesCount: 1420,
        reactions: {
          like: 8400,
          celebrate: 3200,
          insight: 1900,
          love: 650,
          haha: 50,
        },
        comments: [
          {
            id: 'c1',
            displayName: 'Sarah Jenkins',
            handle: 'sarah-growth',
            text: 'Incredible vulnerability Brad. The bash loop is truly changing how leaders lead. 👏',
            timestamp: '1h ago',
            likesCount: 230,
          },
        ],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  },
  {
    id: 'founder-day-3',
    title: 'Tech Founder Milestone',
    category: 'B2B & Startup',
    description: 'Honest reality of modern tech startups shipping at midnight.',
    emoji: '🚀',
    createProject: () => ({
      schemaVersion: 1,
      mockup: true,
      id: `proj_scenario_founder_${Date.now()}`,
      title: 'Founder Day 3 Update (X)',
      template: 'feed-post',
      presetStyle: 'twitter-style',
      theme: {
        background: '#000000',
        accent: '#1d9bf0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        textColor: '#e7e9ea',
        cardBackground: '#000000',
      },
      fictionalLabel: {
        text: 'FICTIONAL MOCKUP',
        enabled: true,
        position: 'bottom-right',
      },
      presentation: {
        deviceFrame: 'card',
        backdrop: 'mesh-dark',
        aspectRatio: '1:1',
        cardElevation: true,
      },
      content: {
        displayName: 'Siddharth (shipping 🚢)',
        handle: 'siddharth_builds',
        verifiedBadge: 'gold',
        timestamp: '3:42 PM · Oct 18, 2026',
        caption: `Day 3 of our AI startup:

• $0 MRR
• 4 cease & desist letters from copyright holders
• 3 production database meltdowns
• 1 investor asking if we can pivot to quantum agentic blockchains

Just crossed 100k waitlist signups though. Never stop building. 🚀`,
        likesCount: 45200,
        commentsCount: 3410,
        sharesCount: 6800,
        repostsCount: 6800,
        viewsCount: 1250000,
        comments: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  },
  {
    id: 'ghosted-on-read',
    title: 'Ghosted at 2:14 AM',
    category: 'Dating & Relatable',
    description: 'The agonizing suspense of left on read with active typing dots.',
    emoji: '👻',
    createProject: () => ({
      schemaVersion: 1,
      mockup: true,
      id: `proj_scenario_ghosted_${Date.now()}`,
      title: 'Left on Read at 2:14 AM',
      template: 'chat',
      presetStyle: 'imessage-style',
      theme: {
        background: '#ffffff',
        accent: '#007aff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
        textColor: '#000000',
        cardBackground: '#f2f2f7',
      },
      fictionalLabel: {
        text: 'FICTIONAL MOCKUP',
        enabled: true,
        position: 'bottom-right',
      },
      presentation: {
        deviceFrame: 'iphone',
        backdrop: 'gradient-ocean',
        aspectRatio: '9:16',
        cardElevation: true,
      },
      content: {
        conversationTitle: 'Sarah (Hinge) 🥂',
        contactIsOnline: true,
        typingIndicator: true,
        verifiedBadge: 'none',
        isSMSMode: false,
        participants: [
          { id: 'user_sarah', name: 'Sarah', handle: 'sarah' },
          { id: 'user_me', name: 'Me', handle: 'me' },
        ],
        messages: [
          {
            id: 'g1',
            senderId: 'user_sarah',
            senderName: 'Sarah',
            text: 'Haha you are so funny, we should definitely hang out again sometime!',
            timestamp: 'Yesterday 11:20 PM',
            isSelf: false,
            status: 'read',
          },
          {
            id: 'g2',
            senderId: 'user_me',
            senderName: 'Me',
            text: 'I had an amazing time too! Are you free this Friday for sushi?',
            timestamp: 'Yesterday 11:25 PM',
            isSelf: true,
            status: 'read',
          },
          {
            id: 'g3',
            senderId: 'user_me',
            senderName: 'Me',
            text: 'Hey! Just checking in :))',
            timestamp: 'Today 2:14 AM',
            isSelf: true,
            status: 'delivered',
          },
        ],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  },
  {
    id: 'support-hero',
    title: 'Customer Support Hero',
    category: 'Support & Tech',
    description: 'Hilariously unhelpful AI or airline customer service chat.',
    emoji: '✈️',
    createProject: () => ({
      schemaVersion: 1,
      mockup: true,
      id: `proj_scenario_support_${Date.now()}`,
      title: 'Customer Support Chat (WhatsApp)',
      template: 'chat',
      presetStyle: 'whatsapp-style',
      theme: {
        background: '#0b141a',
        accent: '#00a884',
        fontFamily: 'Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, sans-serif',
        textColor: '#111b21',
        cardBackground: '#efeae2',
      },
      fictionalLabel: {
        text: 'FICTIONAL MOCKUP',
        enabled: true,
        position: 'bottom-right',
      },
      presentation: {
        deviceFrame: 'iphone',
        backdrop: 'slate',
        aspectRatio: '9:16',
        cardElevation: true,
      },
      content: {
        conversationTitle: 'SkyHop Airline Support ✈️',
        contactIsOnline: true,
        typingIndicator: false,
        verifiedBadge: 'gold',
        participants: [
          { id: 'agent_sky', name: 'SkyHop Support Bot', handle: 'support' },
          { id: 'passenger_me', name: 'Alex', handle: 'alex' },
        ],
        messages: [
          {
            id: 's1',
            senderId: 'passenger_me',
            senderName: 'Alex',
            text: 'You lost my checked bag with my wedding tuxedo and the wedding ceremony is in 2 hours!',
            timestamp: '8:01 AM',
            isSelf: true,
            status: 'read',
          },
          {
            id: 's2',
            senderId: 'agent_sky',
            senderName: 'SkyHop Support Bot',
            text: 'We truly understand your frustration! Have you tried turning the airport off and on again?',
            timestamp: '8:02 AM',
            isSelf: false,
            status: 'read',
          },
          {
            id: 's3',
            senderId: 'agent_sky',
            senderName: 'SkyHop Support Bot',
            text: 'Voice note (0:08)',
            timestamp: '8:03 AM',
            isSelf: false,
            status: 'read',
            audioNote: {
              durationSec: 8,
              playedSec: 3,
            },
          },
        ],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  },
  {
    id: 'accidental-leak',
    title: 'Accidental Prototype Leak',
    category: 'Leaks & Hype',
    description: 'Sensational social story leak of next-generation unreleased hardware.',
    emoji: '📱',
    createProject: () => ({
      schemaVersion: 1,
      mockup: true,
      id: `proj_scenario_leak_${Date.now()}`,
      title: 'Accidental Tech Leak (Story)',
      template: 'story',
      presetStyle: 'instagram-style',
      theme: {
        background: '#000000',
        accent: '#e1306c',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        textColor: '#ffffff',
        cardBackground: '#121212',
      },
      fictionalLabel: {
        text: 'FICTIONAL MOCKUP',
        enabled: true,
        position: 'bottom-right',
      },
      presentation: {
        deviceFrame: 'iphone',
        backdrop: 'gradient-purple',
        aspectRatio: '9:16',
        cardElevation: true,
      },
      content: {
        displayName: 'TechInsider Leaks 🤫',
        handle: 'techinsider',
        hasStoryRing: true,
        timestamp: '14m ago',
        caption: 'Oops... an engineer just left the unreleased prototype smartphone at an SF craft brewery again 🤦‍♂️ Full teardown in bio link!',
        gradientFrom: '#833ab4',
        gradientTo: '#fd1d1d',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  },
];
