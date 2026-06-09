import React from 'react';
import { Search, X } from 'lucide-react';
import { employees } from '../data/employees';

export default function FilterBar({ filters, setFilters, projects = [] }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClear = () => {
    setFilters({
      projectId: '',
      status: '',
      priority: '',
      type: '',
      assignedTo: '',
      dueAlert: '',
      search: ''
    });
  };

  const isFiltered = Object.values(filters).some(val => val !== '');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search by title or description..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent rounded-xl text-slate-800 text-sm outline-none transition-all"
          />
        </div>

        {/* Clear filters button */}
        {isFiltered && (
          <button
            onClick={handleClear}
            className="flex items-center justify-center space-x-1.5 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all"
          >
            <X className="h-3.5 w-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2 border-t border-slate-100">
        {/* Project Dropdown (only visible if projects list is supplied) */}
        {projects.length > 0 && (
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Project</label>
            <select
              name="projectId"
              value={filters.projectId}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent rounded-xl text-slate-800 text-xs outline-none transition-all"
            >
              <option value="">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Status Dropdown */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent rounded-xl text-slate-800 text-xs outline-none transition-all"
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Priority Dropdown */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Priority</label>
          <select
            name="priority"
            value={filters.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent rounded-xl text-slate-800 text-xs outline-none transition-all"
          >
            <option value="">All Priorities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>

        {/* Type Dropdown */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent rounded-xl text-slate-800 text-xs outline-none transition-all"
          >
            <option value="">All Types</option>
            <option value="TASK">TASK</option>
            <option value="BUG">BUG</option>
            <option value="FEATURE">FEATURE</option>
            <option value="STORY">STORY</option>
          </select>
        </div>

        {/* Assignee Dropdown */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Assignee</label>
          <select
            name="assignedTo"
            value={filters.assignedTo}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent rounded-xl text-slate-800 text-xs outline-none transition-all"
          >
            <option value="">All Employees</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>

        {/* Due Date Alert Dropdown */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Alerts</label>
          <select
            name="dueAlert"
            value={filters.dueAlert}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent rounded-xl text-slate-800 text-xs outline-none transition-all"
          >
            <option value="">All Alerts</option>
            <option value="Overdue">Overdue</option>
            <option value="Due Today">Due Today</option>
            <option value="Due Soon">Due Soon</option>
            <option value="On Track">On Track</option>
          </select>
        </div>
      </div>
    </div>
  );
}
