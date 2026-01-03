import React from 'react';

interface StatBadgeProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string; // e.g. "+5%"
}

export const StatBadge: React.FC<StatBadgeProps> = ({ label, value, icon, trend }) => {
  return (
    <div className="flex items-center space-x-4 bg-slate-700/50 p-4 rounded-lg">
      {icon && <div className="p-3 bg-indigo-500/20 rounded-full text-indigo-400">{icon}</div>}
      <div>
        <p className="text-sm text-slate-400 font-medium">{label}</p>
        <div className="flex items-end space-x-2">
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && <span className="text-xs text-emerald-400 mb-1">{trend}</span>}
        </div>
      </div>
    </div>
  );
};