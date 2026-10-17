export type TemplateKind =
  | 'chat'
  | 'feed-post'
  | 'profile-card'
  | 'story'
  | 'short-video';

export type PresetStyle =
  | 'default'
  | 'whatsapp-style' // Emerald Messaging
  | 'facebook-style' // Community Feed
  | 'twitter-style'  // Microblog
  | 'instagram-style'; // Visual Story

export type WatermarkPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface MockupTheme {
  background: string;
  accent: string;
  fontFamily: string;
  textColor?: string;
  cardBackground?: string;
}

export interface FictionalLabel {
  text: 'FICTIONAL MOCKUP';
  enabled: true;
  position: WatermarkPosition;
}

export interface AudioNoteData {
  durationSec: number;
  playedSec?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
  status?: 'sent' | 'delivered' | 'read';
  audioNote?: AudioNoteData;
}

export interface ChatContent {
  conversationTitle: string;
  participants: Array<{
    id: string;
    name: string;
    handle: string;
    avatarUrl?: string;
  }>;
  messages: ChatMessage[];
}

export interface FeedComment {
  id: string;
  displayName: string;
  handle: string;
  text: string;
  timestamp: string;
  likesCount?: number;
}

export interface ReactionCounts {
  like: number;
  love: number;
  haha: number;
  wow?: number;
  sad?: number;
  angry?: number;
}

export interface FeedPostContent {
  displayName: string;
  handle: string;
  avatarUrl?: string;
  timestamp: string;
  caption: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  reactions?: ReactionCounts;
  viewsCount?: number;
  repostsCount?: number;
  comments: FeedComment[];
}

export interface ProfileCardContent {
  displayName: string;
  handle: string;
  avatarUrl?: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isSampleMetric: boolean;
}

export interface StoryContent {
  displayName: string;
  handle: string;
  timestamp: string;
  caption: string;
  backgroundColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export interface ShortVideoContent {
  creator: string;
  handle: string;
  caption: string;
  audioTrack?: string;
}

export interface ShortVideoFrame {
  id: string;
  durationMs: number;
  transition: 'cut' | 'fade' | 'slide';
  content: Record<string, unknown>;
}

export interface DeviceStatusBarConfig {
  enabled: boolean;
  time: string;
  networkType?: '5G' | 'LTE' | '4G' | 'Wi-Fi';
  signalBars?: 1 | 2 | 3 | 4;
  wifiBars?: 1 | 2 | 3;
  batteryLevel?: number;
  isCharging?: boolean;
  showDynamicIsland?: boolean;
}

export interface NotificationBannerConfig {
  enabled: boolean;
  appName: string;
  timeAgo: string;
  title: string;
  message: string;
  avatarEmoji?: string;
}

export interface MockupProject {
  schemaVersion: 1;
  id: string;
  title: string;
  template: TemplateKind;
  presetStyle?: PresetStyle;
  mockup: true;
  createdAt: string;
  updatedAt: string;
  theme: MockupTheme;
  fictionalLabel: FictionalLabel;
  statusBar?: DeviceStatusBarConfig;
  notificationBanner?: NotificationBannerConfig;
  content: Record<string, unknown>;
  frames?: ShortVideoFrame[];
}

