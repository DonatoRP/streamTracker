export type Platform = 'Twitch' | 'YouTube' | 'Kick' | 'TikTok' | 'Facebook Gaming';

export interface Stream {
  id: string;
  date: string; // ISO YYYY-MM-DD
  platform: Platform;
  viewers: number;
  duration: number; // in hours
  note: string;
}

export interface DayStats {
  date: string;
  totalStreams: number;
  totalDuration: number;
  totalViewers: number;
  streams: Stream[];
}

export interface GlobalStats {
  totalUniqueDays: number;
  totalHours: number;
  totalStreams: number;
  platformDistribution: Record<Platform, number>;
  dailyViewers: { date: string; viewers: number }[];
}

export interface StreamFormData {
  platform: Platform;
  viewers: string;
  duration: string;
  note: string;
}