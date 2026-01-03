import React from 'react';
import { Stream } from '../types';
import { Trash2, Edit2, Clock, Users } from 'lucide-react';
import { PLATFORM_COLORS } from '../constants';

interface StreamListProps {
  streams: Stream[];
  onEdit: (stream: Stream) => void;
  onDelete: (id: string) => void;
}

export const StreamList: React.FC<StreamListProps> = ({ streams, onEdit, onDelete }) => {
  if (streams.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p>No streams recorded for this day.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {streams.map((stream) => (
        <div key={stream.id} className="bg-slate-900 border border-slate-700 rounded-lg p-4 group hover:border-slate-600 transition-colors relative">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2 mb-2">
              <span 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: PLATFORM_COLORS[stream.platform] || '#fff' }}
              />
              <span className="font-semibold text-white">{stream.platform}</span>
            </div>
            
            <div className="flex space-x-2 z-10">
              <button 
                type="button"
                onClick={(e) => { 
                  e.preventDefault();
                  e.stopPropagation(); 
                  onEdit(stream); 
                }}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button 
                type="button"
                onClick={(e) => { 
                  e.preventDefault();
                  e.stopPropagation(); 
                  onDelete(stream.id); 
                }}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="flex items-center text-slate-400 text-sm">
              <Users size={14} className="mr-1.5" />
              <span>{stream.viewers} avg viewers</span>
            </div>
            <div className="flex items-center text-slate-400 text-sm">
              <Clock size={14} className="mr-1.5" />
              <span>{stream.duration} hrs</span>
            </div>
          </div>

          {stream.note && (
            <div className="text-xs text-slate-500 bg-slate-800/50 p-2 rounded mt-2 italic border border-slate-800">
              "{stream.note}"
            </div>
          )}
        </div>
      ))}
    </div>
  );
};