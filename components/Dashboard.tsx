import React from 'react';
import { GlobalStats, Platform } from '../types';
import { Card } from './ui/Card';
import { StatBadge } from './ui/StatBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Calendar, Clock, Video, Trophy } from 'lucide-react';
import { PLATFORM_COLORS } from '../constants';

interface DashboardProps {
  stats: GlobalStats;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const sortedPlatforms = (Object.entries(stats.platformDistribution) as [string, number][])
    .sort(([, a], [, b]) => b - a)
    .filter(([, count]) => count > 0);

  // Helper to safely format date string YYYY-MM-DD to local display without timezone shift
  const formatChartDate = (dateStr: string) => {
    // Appending T00:00:00 forces local time parsing instead of UTC
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  const formatTooltipDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Format decimal hours to readable string for the big stat
  const formatTotalHours = (decimalHours: number) => {
    const h = Math.floor(decimalHours);
    const m = Math.round((decimalHours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBadge
          label="Total Streams"
          value={stats.totalStreams}
          icon={<Video size={20} />}
        />
        <StatBadge
          label="Tiempo Total"
          value={formatTotalHours(stats.totalHours)}
          icon={<Clock size={20} />}
        />
        <StatBadge
          label="Días Activos"
          value={stats.totalUniqueDays}
          icon={<Calendar size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card title="Tendencia de Viewers" subtitle="Total de espectadores por día (Últimos 30)" className="lg:col-span-2">
          <div className="h-[300px] w-full">
            {stats.dailyViewers.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.dailyViewers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickFormatter={formatChartDate}
                  />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }}
                    itemStyle={{ color: '#818cf8' }}
                    labelStyle={{ color: '#94a3b8' }}
                    labelFormatter={formatTooltipDate}
                    formatter={(value: number) => [value, 'Viewers']}
                  />
                  <Bar dataKey="viewers" fill="#818cf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">
                Aún no hay datos de streams.
              </div>
            )}
          </div>
        </Card>

        {/* Platform Ranking */}
        <Card title="Top Plataformas" subtitle="Por cantidad de streams">
          <div className="space-y-4">
            {sortedPlatforms.length > 0 ? (
              sortedPlatforms.map(([platform, count], index) => (
                <div key={platform} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-xs font-bold text-slate-400">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">{platform}</p>
                      <div 
                        className="h-1 mt-1 rounded-full" 
                        style={{ 
                          width: '40px', 
                          backgroundColor: PLATFORM_COLORS[platform as Platform] || '#cbd5e1' 
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-white">{count}</span>
                    <span className="text-xs text-slate-500 block">streams</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 py-8">
                <Trophy className="mx-auto mb-2 opacity-20" size={32} />
                Sin datos
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};