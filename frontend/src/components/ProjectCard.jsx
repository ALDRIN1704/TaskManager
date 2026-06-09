import React from 'react';
import { Calendar, Layers, Clock, AlertCircle, Edit2, Trash2, ArrowRight } from 'lucide-react';
import { calculateDuration } from '../utils/dateUtils';

export default function ProjectCard({ project, taskCount = 0, overdueCount = 0, onEdit, onDelete, onClick }) {
  const duration = calculateDuration(project.startDate, project.endDate);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-650">
              <Layers className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 
                onClick={onClick}
                className="text-sm font-extrabold text-slate-800 hover:text-indigo-600 cursor-pointer transition-colors line-clamp-1"
              >
                {project.name}
              </h3>
              <span className="text-[10px] font-bold text-slate-400">
                Duration: {duration} {duration === 1 ? 'day' : 'days'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(project); }}
              className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-indigo-650 rounded-lg transition-colors"
              title="Edit Project"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
              className="p-1.5 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-colors"
              title="Delete Project"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {project.description || 'No description provided.'}
        </p>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
          <div className="flex items-center space-x-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Tasks: <strong className="text-slate-800">{taskCount}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <AlertCircle className={`h-3.5 w-3.5 ${overdueCount > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
            <span>Overdue: <strong className={overdueCount > 0 ? 'text-rose-600' : 'text-slate-855'}>{overdueCount}</strong></span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
        <span className="text-[10px] font-bold text-slate-400">
          {formatDate(project.startDate)} - {formatDate(project.endDate)}
        </span>
        <button
          onClick={onClick}
          className="flex items-center space-x-1 text-indigo-650 hover:text-indigo-700 transition-colors"
        >
          <span>Details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
