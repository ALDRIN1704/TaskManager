import React from 'react';
import { Calendar, User, Edit2, Trash2, Eye, GitCommit } from 'lucide-react';
import DueBadge from './DueBadge';
import { calculateDuration, getDueAlertBadge } from '../utils/dateUtils';

export default function TaskCard({ task, onEdit, onDelete, onViewDetails, isAdmin = false }) {
  const isSubTask = !!task.parentTaskId;
  const duration = calculateDuration(task.startDate, task.dueDate);
  const dueAlert = getDueAlertBadge(task.dueDate, task.status);
  const isOverdue = dueAlert === 'Overdue';

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

  const formattedDueDate = new Date(task.dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 ${
      isOverdue ? 'border-rose-300 ring-1 ring-rose-350' : 'border-slate-200'
    }`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isSubTask ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'
            }`}>
              {isSubTask ? 'Subtask' : 'Task'}
            </span>
            {!isSubTask && task.type && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                {task.type}
              </span>
            )}
          </div>
          <DueBadge dueDate={task.dueDate} status={task.status} />
        </div>

        <div>
          <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">
            {task.projectName}
          </span>
          <h4 className="text-sm font-extrabold text-slate-800 line-clamp-1 mt-0.5">
            {task.title}
          </h4>
          {isSubTask && task.parentTaskTitle && (
            <span className="text-[10px] text-slate-400 font-semibold flex items-center space-x-0.5 mt-0.5">
              <GitCommit className="h-3 w-3 inline text-purple-400" />
              <span>Parent: {task.parentTaskTitle}</span>
            </span>
          )}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1.5">
            {task.description || 'No description provided.'}
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">{task.assignedToName || 'Unassigned'}</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">
            Duration: {duration} {duration === 1 ? 'day' : 'days'}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px]">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>Due: {formattedDueDate}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <div>
          {isAdmin && (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {isAdmin ? (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                className="p-1.5 hover:bg-slate-50 text-slate-650 hover:text-indigo-600 rounded-lg transition-colors"
                title="Edit Details"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                className="p-1.5 hover:bg-rose-50 text-slate-650 hover:text-rose-600 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onViewDetails(task); }}
              className="flex items-center space-x-1 px-2 py-1 text-slate-500 hover:text-indigo-650 hover:bg-indigo-50 rounded-lg transition-all text-xs font-semibold"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
              <span>Details</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
