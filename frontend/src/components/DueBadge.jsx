import React from 'react';
import { getDueAlertBadge } from '../utils/dateUtils';

export default function DueBadge({ dueDate, status }) {
  const badge = getDueAlertBadge(dueDate, status);

  const getStyle = (type) => {
    switch (type) {
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Due Today':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Due Soon':
        return 'bg-yellow-50 text-yellow-750 border-yellow-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStyle(badge)}`}>
      {badge}
    </span>
  );
}
