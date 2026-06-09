import React from 'react';
import { Calendar, User, Edit2, Trash2, Eye } from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete, onViewDetails, isAdmin = false }) {
  const getPriorityColor = (p) => {
    switch (p) {
      case 'HIGH': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'MEDIUM': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const getStatusColor = (s) => {
    switch (s) {
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const formattedDate = new Date(task.dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          {isAdmin && (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
          )}
        </div>
        <h4 className="text-base font-extrabold text-slate-800 line-clamp-1">{task.title}</h4>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{task.description || 'No description provided.'}</p>
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <User className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-semibold">{task.assignedToName || 'Unassigned'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>Due: {formattedDate}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
        {isAdmin ? (
          <>
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 hover:bg-slate-50 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"
              title="Edit Task"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition-colors"
              title="Delete Task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            onClick={() => onViewDetails(task)}
            className="flex items-center space-x-1 px-2.5 py-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
            <span>Details</span>
          </button>
        )}
      </div>
    </div>
  );
}
