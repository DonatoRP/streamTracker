import React, { useState, useEffect, useCallback } from 'react';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { CalendarModal } from './components/CalendarModal';
import { Stream, GlobalStats, StreamFormData } from './types';
import * as streamService from './services/streamService';
import { LayoutDashboard, Calendar as CalendarIcon, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar'>('dashboard');
  const [streams, setStreams] = useState<Stream[]>([]);
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshData = useCallback(async () => {
    try {
      const data = await streamService.getStreams();
      setStreams(data);
      const calculatedStats = streamService.calculateStats(data);
      setStats(calculatedStats);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  // CRUD Operations Wrapper
  const handleAddStream = async (formData: StreamFormData) => {
    if (!selectedDate) return;
    const newStream = {
      date: selectedDate,
      platform: formData.platform,
      viewers: parseFloat(formData.viewers),
      duration: parseFloat(formData.duration),
      note: formData.note
    };
    await streamService.saveStream(newStream);
    await refreshData();
  };

  const handleEditStream = async (id: string, formData: StreamFormData) => {
    if (!selectedDate) return;
    const updatedStream = {
      id,
      date: selectedDate,
      platform: formData.platform,
      viewers: parseFloat(formData.viewers),
      duration: parseFloat(formData.duration),
      note: formData.note
    };
    await streamService.saveStream(updatedStream);
    await refreshData();
  };

  const handleDeleteStream = async (id: string) => {
    await streamService.deleteStream(id);
    await refreshData();
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-indigo-500">Cargando Tracker...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Activity size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                Stream Tracker
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'dashboard' 
                    ? 'bg-slate-800 text-indigo-400' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard size={18} className="mr-2" />
                Panel
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'calendar' 
                    ? 'bg-slate-800 text-indigo-400' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <CalendarIcon size={18} className="mr-2" />
                Calendario
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && stats && (
          <Dashboard stats={stats} />
        )}

        {activeTab === 'calendar' && (
          <CalendarView 
            streams={streams} 
            onDayClick={handleDayClick} 
          />
        )}
      </main>

      {/* Modal for Day Details */}
      {selectedDate && (
        <CalendarModal
          isOpen={isModalOpen}
          onClose={closeModal}
          date={selectedDate}
          streams={streams.filter(s => s.date === selectedDate)}
          onAddStream={handleAddStream}
          onEditStream={handleEditStream}
          onDeleteStream={handleDeleteStream}
        />
      )}
    </div>
  );
};

export default App;