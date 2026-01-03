import React, { useState } from 'react';
import { Stream } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  streams: Stream[];
  onDayClick: (date: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ streams, onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month); // 0 = Sunday

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Helper to get today's date string in local time (not UTC)
  const getLocalTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const todayStr = getLocalTodayString();

  const days = [];
  // Empty slots for days before start of month
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 md:h-32 bg-slate-900/30 border border-slate-800/50"></div>);
  }

  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayStreams = streams.filter(s => s.date === dateStr);
    const hasStreams = dayStreams.length > 0;
    const totalViewers = dayStreams.reduce((acc, s) => acc + s.viewers, 0);

    const isToday = dateStr === todayStr;

    days.push(
      <div 
        key={dateStr}
        onClick={() => onDayClick(dateStr)}
        className={`h-24 md:h-32 border border-slate-800 p-2 cursor-pointer transition-colors relative group
          ${hasStreams ? 'bg-slate-800/40 hover:bg-slate-800/60' : 'bg-transparent hover:bg-slate-800/20'}
          ${isToday ? 'ring-1 ring-indigo-500 inset-0' : ''}
        `}
      >
        <div className="flex justify-between items-start">
          <span className={`text-sm font-medium ${isToday ? 'text-indigo-400' : 'text-slate-400'}`}>{d}</span>
          {hasStreams && (
             <span className="flex items-center justify-center w-5 h-5 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-sm">
               {dayStreams.length}
             </span>
          )}
        </div>
        
        {hasStreams && (
          <div className="mt-2 space-y-1">
             {dayStreams.slice(0, 2).map(s => (
               <div key={s.id} className="flex items-center text-xs text-slate-300 truncate">
                 <span className={`w-1.5 h-1.5 rounded-full mr-1.5 bg-indigo-400`}></span>
                 <span className="truncate">{s.platform}</span>
               </div>
             ))}
             {dayStreams.length > 2 && (
               <div className="text-xs text-slate-500 pl-3">+{dayStreams.length - 2} more</div>
             )}
             <div className="absolute bottom-2 right-2 text-xs font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {Math.round(totalViewers / dayStreams.length)} avg
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden animate-in fade-in duration-500">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
        <h2 className="text-xl font-bold text-white">
          {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-2">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleNextMonth} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 border-b border-slate-700 bg-slate-800/50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2 text-center text-sm font-semibold text-slate-500">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 bg-slate-950">
        {days}
      </div>
    </div>
  );
};