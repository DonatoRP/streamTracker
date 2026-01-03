import { Stream, GlobalStats, Platform } from '../types';
import { MOCK_INITIAL_DATA_KEY } from '../constants';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Helper for local date string YYYY-MM-DD
const getLocalDateString = (dateOffset: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dateOffset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Initialize DB if empty
const initDB = () => {
  const existing = localStorage.getItem(MOCK_INITIAL_DATA_KEY);
  if (!existing) {
    const initialData: Stream[] = [
      { id: '1', date: getLocalDateString(0), platform: 'Twitch', viewers: 45, duration: 3.5, note: 'Great raid!' },
      { id: '2', date: getLocalDateString(-2), platform: 'YouTube', viewers: 120, duration: 2, note: 'Tech issues at start.' },
    ];
    localStorage.setItem(MOCK_INITIAL_DATA_KEY, JSON.stringify(initialData));
  }
};

export const getStreams = async (): Promise<Stream[]> => {
  initDB();
  const data = localStorage.getItem(MOCK_INITIAL_DATA_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveStream = async (stream: Omit<Stream, 'id'> | Stream): Promise<Stream> => {
  const streams = await getStreams();
  let newStream: Stream;

  if ('id' in stream) {
    // Update
    const index = streams.findIndex(s => s.id === stream.id);
    if (index !== -1) {
      streams[index] = stream as Stream;
      newStream = streams[index];
    } else {
      throw new Error('Stream not found');
    }
  } else {
    // Create
    newStream = { ...stream, id: generateId() };
    streams.push(newStream);
  }

  localStorage.setItem(MOCK_INITIAL_DATA_KEY, JSON.stringify(streams));
  return newStream;
};

export const deleteStream = async (id: string): Promise<void> => {
  const streams = await getStreams();
  const filtered = streams.filter(s => s.id !== id);
  localStorage.setItem(MOCK_INITIAL_DATA_KEY, JSON.stringify(filtered));
};

export const calculateStats = (streams: Stream[]): GlobalStats => {
  const uniqueDays = new Set(streams.map(s => s.date)).size;
  const totalHours = streams.reduce((acc, curr) => acc + curr.duration, 0);
  const totalStreams = streams.length;

  const platformDistribution: Record<Platform, number> = {
    'Twitch': 0, 'YouTube': 0, 'Kick': 0, 'TikTok': 0, 'Facebook Gaming': 0
  };

  streams.forEach(s => {
    if (platformDistribution[s.platform] !== undefined) {
      platformDistribution[s.platform]++;
    }
  });

  // Calculate daily viewers for the chart (last 30 days)
  const dailyViewersMap = new Map<string, number>();
  
  // Sort streams by date
  const sortedStreams = [...streams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  sortedStreams.forEach(s => {
    const current = dailyViewersMap.get(s.date) || 0;
    dailyViewersMap.set(s.date, current + s.viewers);
  });

  const dailyViewers = Array.from(dailyViewersMap.entries()).map(([date, viewers]) => ({
    date,
    viewers
  })).slice(-30); // Last 30 entries usually, but logic here just takes last 30 distinct days with data

  return {
    totalUniqueDays: uniqueDays,
    totalHours: parseFloat(totalHours.toFixed(2)),
    totalStreams,
    platformDistribution,
    dailyViewers
  };
};