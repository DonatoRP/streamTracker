import React, { useState } from 'react';
import { Stream, StreamFormData } from '../types';
import { X, Plus } from 'lucide-react';
import { StreamList } from './StreamList';
import { StreamForm } from './StreamForm';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  streams: Stream[];
  onAddStream: (data: StreamFormData) => void;
  onEditStream: (id: string, data: StreamFormData) => void;
  onDeleteStream: (id: string) => void;
}

type Mode = 'list' | 'add' | 'edit';

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  date,
  streams,
  onAddStream,
  onEditStream,
  onDeleteStream
}) => {
  const [mode, setMode] = useState<Mode>('list');
  const [editingStream, setEditingStream] = useState<Stream | undefined>(undefined);

  if (!isOpen) return null;

  const handleEditClick = (stream: Stream) => {
    setEditingStream(stream);
    setMode('edit');
  };

  const handleDeleteClick = (id: string) => {
    // Explicitly use window.confirm
    if (window.confirm('Are you sure you want to delete this stream record?')) {
      onDeleteStream(id);
    }
  };

  const handleFormSubmit = (data: StreamFormData) => {
    if (mode === 'edit' && editingStream) {
      onEditStream(editingStream.id, data);
    } else {
      onAddStream(data);
    }
    setMode('list');
    setEditingStream(undefined);
  };

  const reset = () => {
    setMode('list');
    setEditingStream(undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/50">
          <h2 className="text-lg font-bold text-white">
            {mode === 'list' && new Date(date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            {mode === 'add' && 'Add Stream'}
            {mode === 'edit' && 'Edit Stream'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {mode === 'list' && (
            <>
              <div className="mb-4 flex justify-between items-center">
                <span className="text-sm text-slate-400">{streams.length} stream(s)</span>
                <button
                  onClick={() => setMode('add')}
                  className="flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-md transition-colors"
                >
                  <Plus size={14} className="mr-1" />
                  Add
                </button>
              </div>
              <StreamList 
                streams={streams} 
                onEdit={handleEditClick} 
                onDelete={handleDeleteClick} 
              />
            </>
          )}

          {(mode === 'add' || mode === 'edit') && (
            <StreamForm 
              selectedDate={date}
              initialData={editingStream}
              onSubmit={handleFormSubmit}
              onCancel={reset}
            />
          )}
        </div>
      </div>
    </div>
  );
};