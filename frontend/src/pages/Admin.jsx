import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import FilterBar from '../components/FilterBar';
import ActivityTimeline from '../components/ActivityTimeline';
import ConfirmDialog from '../components/ConfirmDialog';
import TaskForm from '../components/TaskForm';
import DueBadge from '../components/DueBadge';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { activityService } from '../services/activityService';
import { getDueAlertBadge } from '../utils/dateUtils';
import { filterItems } from '../utils/filterUtils';
import { Plus, FolderKanban, ClipboardList, Clock, CheckCircle2, AlertCircle, Eye, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Admin() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [filters, setFilters] = useState({
    projectId: '',
    status: '',
    priority: '',
    type: '',
    assignedTo: '',
    dueAlert: '',
    search: ''
  });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Delete dialog states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [projData, taskData, actData] = await Promise.all([
        projectService.getAllProjects(),
        taskService.getAllTasks(),
        activityService.getAllActivities()
      ]);
      setProjects(projData || []);
      setTasks(taskData || []);
      setActivities(actData || []);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingTask) {
        const updated = await taskService.updateTask(editingTask.id, formData);
        setTasks(prev => prev.map(t => t.id === editingTask.id ? updated : t));
        toast.success('Task updated successfully');
      } else {
        const created = await taskService.createTask(formData);
        setTasks(prev => [...prev, created]);
        toast.success('Task created successfully');
      }
      setIsFormOpen(false);
      setEditingTask(null);
      
      // Reload activity logs
      const actData = await activityService.getAllActivities();
      setActivities(actData || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save task';
      toast.error(message);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await taskService.deleteTask(deletingId);
      setTasks(prev => prev.filter(t => t.id !== deletingId));
      toast.success('Task deleted successfully');

      // Reload activity logs
      const actData = await activityService.getAllActivities();
      setActivities(actData || []);
    } catch (err) {
      toast.error('Failed to delete task');
    } finally {
      setIsDeleteOpen(false);
      setDeletingId(null);
    }
  };

  // Stats calculations
  const totalProjectsCount = projects.length;
  const totalTasksCount = tasks.length;
  const todoCount = tasks.filter(t => t.status === 'TODO').length;
  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const overdueCount = tasks.filter(t => getDueAlertBadge(t.dueDate, t.status) === 'Overdue').length;

  // Filter tasks in memory
  const filteredTasks = filterItems(tasks, filters);

  const getPriorityColor = (p) => {
    switch (p) {
      case 'HIGH': return 'bg-rose-50 text-rose-700 border-rose-250';
      case 'MEDIUM': return 'bg-amber-50 text-amber-700 border-amber-250';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-250';
    }
  };

  const getStatusColor = (s) => {
    switch (s) {
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Track projects status and manage employee assignments.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/admin/projects')}
              className="flex items-center justify-center space-x-2 rounded-xl border border-indigo-200 bg-white hover:bg-slate-50 px-5 py-3 text-sm font-bold text-indigo-650 shadow-sm hover:shadow transition-all"
            >
              <FolderKanban className="h-4 w-4" />
              <span>Projects Directory</span>
            </button>
            <button
              onClick={() => {
                setEditingTask(null);
                setIsFormOpen(true);
              }}
              className="flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-xl transition-all active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <StatsCard
            title="Total Projects"
            value={totalProjectsCount}
            icon={FolderKanban}
            colorClass="bg-indigo-50 text-indigo-600"
          />
          <StatsCard
            title="Total Tasks"
            value={totalTasksCount}
            icon={ClipboardList}
            colorClass="bg-indigo-50 text-indigo-600"
          />
          <StatsCard
            title="To Do"
            value={todoCount}
            icon={AlertCircle}
            colorClass="bg-slate-100 text-slate-600"
          />
          <StatsCard
            title="In Progress"
            value={inProgressCount}
            icon={Clock}
            colorClass="bg-blue-50 text-blue-600"
          />
          <StatsCard
            title="Completed"
            value={completedCount}
            icon={CheckCircle2}
            colorClass="bg-emerald-50 text-emerald-600"
          />
          <StatsCard
            title="Overdue"
            value={overdueCount}
            icon={AlertCircle}
            colorClass={`${overdueCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}
          />
        </div>

        {/* Filters */}
        <FilterBar filters={filters} setFilters={setFilters} projects={projects} />

        {/* Tasks and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Recent Tasks List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Tasks</h2>
            
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 rounded-3xl">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                <span className="text-sm font-semibold text-slate-500">Loading tasks...</span>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
                <ClipboardList className="h-12 w-12 text-slate-355 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900">No tasks match selected filters</h3>
                <p className="text-xs text-slate-500">Try adjusting your filters or click the button to create a new task.</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">Title</th>
                      <th className="py-3.5 px-4">Project</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Priority</th>
                      <th className="py-3.5 px-4">Due Date</th>
                      <th className="py-3.5 px-4">Assignee</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredTasks.slice(0, 15).map((task) => {
                      const overdue = getDueAlertBadge(task.dueDate, task.status) === 'Overdue' && task.status !== 'COMPLETED';
                      return (
                        <tr 
                          key={task.id} 
                          className={`hover:bg-slate-50/40 transition-colors ${overdue ? 'bg-rose-50/10' : ''}`}
                        >
                          <td className="py-3.5 px-4 font-bold text-slate-800 max-w-[150px] truncate" title={task.title}>
                            {task.title}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-semibold max-w-[120px] truncate" title={task.projectName}>
                            {task.projectName}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[9px] font-bold uppercase">
                              {task.type || 'TASK'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              <span className="font-medium text-slate-600">{new Date(task.dueDate).toLocaleDateString()}</span>
                              <DueBadge dueDate={task.dueDate} status={task.status} />
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-semibold">{task.assignedToName || 'Unassigned'}</td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                onClick={() => navigate(`/admin/projects/${task.projectId}`)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-650"
                                title="Go to Project"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleEditClick(task)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-650"
                                title="Edit Task"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(task.id)}
                                className="p-1 hover:bg-rose-50 rounded text-slate-500 hover:text-rose-600"
                                title="Delete Task"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Activity Timeline summary */}
          <div className="space-y-4">
            <ActivityTimeline activities={activities} limit={8} />
          </div>
        </div>
      </main>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdate}
        task={editingTask}
        projects={projects}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          setDeletingId(null);
        }}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="text-white font-bold text-sm">Task Manager</span>
          <p className="text-slate-500">Simple Full-Stack Task Board Application</p>
        </div>
      </footer>
    </div>
  );
}
