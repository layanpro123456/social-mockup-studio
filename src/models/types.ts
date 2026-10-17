export type TemplateKind =
  | 'chat'
  | 'feed-post'
  | 'profile-card'
  | 'story'
  | 'short-video';

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

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
  status?: 'sent' | 'delivered' | 'read';
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

export interface MockupProject {
  schemaVersion: 1;
  id: string;
  title: string;
  template: TemplateKind;
  mockup: true;
  createdAt: string;
  updatedAt: string;
  theme: MockupTheme;
  fictionalLabel: FictionalLabel;
  content: Record<string, unknown>;
  frames?: ShortVideoFrame[];
}
