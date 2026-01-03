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
  // Internal state for split time inputs
  const [durationHours, setDurationHours] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');

  const [formData, setFormData] = useState<Omit<StreamFormData, 'duration'>>({
    platform: 'Twitch',
    viewers: '',
    note: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StreamFormData | 'durationMinutes', string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        platform: initialData.platform,
        viewers: initialData.viewers.toString(),
        note: initialData.note
      });

      // Convert decimal hours back to hours and minutes for editing
      const totalHours = initialData.duration;
      const h = Math.floor(totalHours);
      const m = Math.round((totalHours - h) * 60);
      
      setDurationHours(h.toString());
      setDurationMinutes(m.toString());
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: any = {};
    let isValid = true;

    if (!formData.viewers || parseFloat(formData.viewers) < 0) {
      newErrors.viewers = "Espectadores debe ser un número positivo";
      isValid = false;
    }

    const h = parseFloat(durationHours || '0');
    const m = parseFloat(durationMinutes || '0');

    if (h === 0 && m === 0) {
      newErrors.duration = "La duración debe ser mayor a 0";
      isValid = false;
    }

    if (h < 0 || m < 0) {
      newErrors.duration = "El tiempo no puede ser negativo";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Convert hours and minutes to decimal hours for storage
      const h = parseFloat(durationHours || '0');
      const m = parseFloat(durationMinutes || '0');
      const decimalDuration = h + (m / 60);

      onSubmit({
        ...formData,
        duration: decimalDuration.toString()
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Fecha</label>
        <div className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-400 cursor-not-allowed">
          {new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div>
        <label htmlFor="platform" className="block text-sm font-medium text-slate-300 mb-1">Plataforma</label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="viewers" className="block text-sm font-medium text-slate-300 mb-1">Media de Viewers</label>
          <input
            type="number"
            id="viewers"
            step="0.1"
            value={formData.viewers}
            onChange={(e) => setFormData({ ...formData, viewers: e.target.value })}
            className={`w-full px-3 py-2 bg-slate-900 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.viewers ? 'border-red-500' : 'border-slate-700'}`}
            placeholder="ej. 25"
          />
          {errors.viewers && <p className="text-red-500 text-xs mt-1">{errors.viewers}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Duración</label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="number"
                min="0"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                className={`w-full px-3 py-2 bg-slate-900 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.duration ? 'border-red-500' : 'border-slate-700'}`}
                placeholder="Horas"
              />
            </div>
            <span className="self-center text-slate-400">:</span>
            <div className="flex-1">
              <input
                type="number"
                min="0"
                max="59"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className={`w-full px-3 py-2 bg-slate-900 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.duration ? 'border-red-500' : 'border-slate-700'}`}
                placeholder="Min"
              />
            </div>
          </div>
          {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-slate-300 mb-1">Nota (Opcional)</label>
        <textarea
          id="note"
          rows={3}
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="¿Qué salió bien? ¿Qué falló?"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {initialData ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};