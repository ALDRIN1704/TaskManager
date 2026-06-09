import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { Plus, ClipboardList, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Admin() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Delete dialog states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data || []);
    } catch (err) {
      toast.error('Failed to load tasks from API');
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
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors && errors.length > 0) {
        errors.forEach(e => toast.error(e));
      } else {
        toast.error(err.response?.data?.message || 'Failed to save task');
      }
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
    } catch (err) {
      toast.error('Failed to delete task');
    } finally {
      setIsDeleteOpen(false);
      setDeletingId(null);
    }
  };

  // Stats calculations
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter(t => t.status === 'TODO').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Manage and assign tasks for your team members.</p>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setIsFormOpen(true);
            }}
            className="flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-xl transition-all active:scale-[0.98] self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Tasks"
            value={totalTasks}
            icon={ClipboardList}
            colorClass="bg-indigo-50 text-indigo-600"
          />
          <StatsCard
            title="To Do"
            value={todoTasks}
            icon={AlertCircle}
            colorClass="bg-slate-100 text-slate-600"
          />
          <StatsCard
            title="In Progress"
            value={inProgressTasks}
            icon={Clock}
            colorClass="bg-blue-50 text-blue-600"
          />
          <StatsCard
            title="Completed"
            value={completedTasks}
            icon={CheckCircle2}
            colorClass="bg-emerald-50 text-emerald-600"
          />
        </div>

        {/* Tasks Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Active Team Tasks</h2>
          
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              <span className="text-sm font-semibold text-slate-500">Loading tasks...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
              <ClipboardList className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No tasks created yet</h3>
              <p className="text-sm text-slate-500">Click the "Create Task" button to create and assign your first team task.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  isAdmin={true}
                />
              ))}
            </div>
          )}
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
