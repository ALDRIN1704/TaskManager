import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { employees } from '../data/employees';

export default function TaskForm({ isOpen, onClose, onSubmit, task = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '',
    assignedTo: '',
    assignedToName: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'TODO',
        priority: task.priority || 'MEDIUM',
        dueDate: task.dueDate || '',
        assignedTo: task.assignedTo || '',
        assignedToName: task.assignedToName || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: '',
        assignedTo: '',
        assignedToName: ''
      });
    }
    setErrors({});
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'assignedTo') {
      const emp = employees.find(emp => emp.id === value);
      setFormData(prev => ({
        ...prev,
        assignedTo: value,
        assignedToName: emp ? emp.name : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.assignedTo) newErrors.assignedTo = 'Assigned employee is required';
    if (!formData.priority) newErrors.priority = 'Priority is required';
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(formData.dueDate);
      selected.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200/80 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">{task ? 'Edit Task' : 'Create Task'}</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-4 overflow-y-auto flex-1 pr-1">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.title ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:ring-indigo-500'} focus:border-transparent focus:ring-2 rounded-xl text-slate-800 text-sm outline-none transition-all`}
            />
            {errors.title && <span className="text-xs text-rose-500 mt-1 block">{errors.title}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:ring-indigo-500 focus:border-transparent focus:ring-2 rounded-xl text-slate-800 text-sm outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Priority <span className="text-rose-500">*</span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:ring-indigo-500 focus:border-transparent focus:ring-2 rounded-xl text-slate-800 text-sm outline-none transition-all"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Due Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.dueDate ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:ring-indigo-500'} focus:border-transparent focus:ring-2 rounded-xl text-slate-800 text-sm outline-none transition-all`}
              />
              {errors.dueDate && <span className="text-xs text-rose-500 mt-1 block">{errors.dueDate}</span>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Assign To <span className="text-rose-500">*</span>
            </label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.assignedTo ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:ring-indigo-500'} focus:border-transparent focus:ring-2 rounded-xl text-slate-800 text-sm outline-none transition-all`}
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.id})
                </option>
              ))}
            </select>
            {errors.assignedTo && <span className="text-xs text-rose-500 mt-1 block">{errors.assignedTo}</span>}
          </div>

          {task && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:ring-indigo-500 focus:border-transparent focus:ring-2 rounded-xl text-slate-800 text-sm outline-none transition-all"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
