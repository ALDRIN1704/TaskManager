import React from 'react';
import { History, Activity as ActIcon } from 'lucide-react';

export default function ActivityTimeline({ activities = [], limit = null }) {
  const displayedActivities = limit ? activities.slice(0, limit) : activities;

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
        <History className="h-5 w-5 text-indigo-600" />
        <h3 className="text-base font-extrabold text-slate-900">Activity History</h3>
      </div>

      {displayedActivities.length === 0 ? (
        <div className="py-8 text-center text-xs font-semibold text-slate-400">
          No activity recorded yet.
        </div>
      ) : (
        <div className="flow-root">
          <ul className="-mb-8">
            {displayedActivities.map((activity, idx) => (
              <li key={activity.id || idx}>
                <div className="relative pb-8">
                  {idx !== displayedActivities.length - 1 && (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center ring-8 ring-white text-slate-500 border border-slate-200">
                        <ActIcon className="h-4 w-4 text-indigo-650" />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {activity.action}{' '}
                          <span className="font-normal text-slate-500">by</span>{' '}
                          <span className="font-bold text-indigo-600">{activity.actorName || 'Admin'}</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{activity.details}</p>
                        {activity.projectName && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 mt-1">
                            Project: {activity.projectName}
                          </span>
                        )}
                      </div>
                      <div className="text-right text-[10px] font-bold text-slate-400 whitespace-nowrap">
                        <time>{formatTime(activity.createdAt)}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
