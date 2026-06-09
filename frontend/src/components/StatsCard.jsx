import React from 'react';

export default function StatsCard({ title, value, icon: Icon, colorClass }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black text-slate-900 mt-2">{value}</p>
      </div>
      <div className={`p-4 rounded-xl ${colorClass}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
