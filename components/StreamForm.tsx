import React, { useState, useEffect } from 'react';
import { Platform, Stream, StreamFormData } from '../types';
import { PLATFORMS } from '../constants';

interface StreamFormProps {
  initialData?: Stream;
  selectedDate: string;
  onSubmit: (data: StreamFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const StreamForm: React.FC<StreamFormProps> = ({ 
  initialData, 
  selectedDate, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<StreamFormData>({
    platform: 'Twitch',
    viewers: '',
    duration: '',
    note: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StreamFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        platform: initialData.platform,
        viewers: initialData.viewers.toString(),
        duration: initialData.duration.toString(),
        note: initialData.note
      });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof StreamFormData, string>> = {};
    let isValid = true;

    if (!formData.viewers || parseFloat(formData.viewers) <= 0) {
      newErrors.viewers = "Viewers must be a positive number";
      isValid = false;
    }

    if (!formData.duration || parseFloat(formData.duration) <= 0) {
      newErrors.duration = "Duration must be positive (e.g. 1.5)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
        <div className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-400 cursor-not-allowed">
          {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div>
        <label htmlFor="platform" className="block text-sm font-medium text-slate-300 mb-1">Platform</label>
        <select
          id="platform"
          value={formData.platform}
          onChange={(e) => setFormData({ ...formData, platform: e.target.value as Platform })}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {PLATFORMS.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="viewers" className="block text-sm font-medium text-slate-300 mb-1">Avg. Viewers</label>
          <input
            type="number"
            id="viewers"
            step="0.1"
            value={formData.viewers}
            onChange={(e) => setFormData({ ...formData, viewers: e.target.value })}
            className={`w-full px-3 py-2 bg-slate-900 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.viewers ? 'border-red-500' : 'border-slate-700'}`}
            placeholder="e.g. 25"
          />
          {errors.viewers && <p className="text-red-500 text-xs mt-1">{errors.viewers}</p>}
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-slate-300 mb-1">Duration (Hours)</label>
          <input
            type="number"
            id="duration"
            step="0.1"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className={`w-full px-3 py-2 bg-slate-900 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.duration ? 'border-red-500' : 'border-slate-700'}`}
            placeholder="e.g. 2.5"
          />
          {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-slate-300 mb-1">Note (Optional)</label>
        <textarea
          id="note"
          rows={3}
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="What went well? What didn't?"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {initialData ? 'Update Stream' : 'Add Stream'}
        </button>
      </div>
    </form>
  );
};