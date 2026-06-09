import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ProjectForm({ isOpen, onClose, onSubmit, project = null }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        startDate: project.startDate || '',
        endDate: project.endDate || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: ''
      });
    }
    setErrors({});
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date';
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
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200/80 animate-in fade-in zoom-in duration-205 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">{project ? 'Edit Project' : 'Create Project'}</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-655 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-4 overflow-y-auto flex-1 pr-1">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter project name"
              className={`w-full px-4 py-2.5 bg-slate-55 border ${errors.name ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:ring-indigo-500'} focus:border-transparent focus:ring-2 rounded-xl text-slate-800 text-sm outline-none transition-all`}
            />
            {errors.name && <span className="text-xs text-rose-500 mt-1 block">{errors.name}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-55 border border-slate-200 focus:ring-indigo-500 focus:border-transparent focus:ring-2 rounded-xl text-slate-800 text-sm outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-slate-55 border ${errors.startDate ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:ring-indigo-500'} focus:border-transparent focus:ring-2 rounded-xl text-slate-800 text-sm outline-none transition-all`}
              />
              {errors.startDate && <span className="text-xs text-rose-500 mt-1 block">{errors.startDate}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                End Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-slate-55 border ${errors.endDate ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:ring-indigo-500'} focus:border-transparent focus:ring-2 rounded-xl text-slate-800 text-sm outline-none transition-all`}
              />
              {errors.endDate && <span className="text-xs text-rose-500 mt-1 block">{errors.endDate}</span>}
            </div>
          </div>

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
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-650 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all"
            >
              {project ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
