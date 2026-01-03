import { Platform } from './types';

export const PLATFORMS: Platform[] = [
  'Twitch',
  'YouTube',
  'Kick',
  'TikTok',
  'Facebook Gaming',
];

export const PLATFORM_COLORS: Record<Platform, string> = {
  Twitch: '#9146FF',
  YouTube: '#FF0000',
  Kick: '#53FC18',
  TikTok: '#00F2EA',
  'Facebook Gaming': '#1877F2',
};

export const MOCK_INITIAL_DATA_KEY = 'stream-tracker-db-v1';