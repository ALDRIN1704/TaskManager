import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { getDueAlertBadge } from '../utils/dateUtils';
import { Plus, FolderKanban } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Delete dialog states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [projData, taskData] = await Promise.all([
        projectService.getAllProjects(),
        taskService.getAllTasks()
      ]);
      setProjects(projData || []);
      setTasks(taskData || []);
    } catch (err) {
      toast.error('Failed to load project details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingProject) {
        const updated = await projectService.updateProject(editingProject.id, formData);
        setProjects(prev => prev.map(p => p.id === editingProject.id ? updated : p));
        toast.success('Project updated successfully');
      } else {
        const created = await projectService.createProject(formData);
        setProjects(prev => [...prev, created]);
        toast.success('Project created successfully');
      }
      setIsFormOpen(false);
      setEditingProject(null);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save project';
      toast.error(message);
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await projectService.deleteProject(deletingId);
      setProjects(prev => prev.filter(p => p.id !== deletingId));
      toast.success('Project deleted successfully');
    } catch (err) {
      toast.error('Failed to delete project');
    } finally {
      setIsDeleteOpen(false);
      setDeletingId(null);
    }
  };

  // Get task stats per project
  const getProjectStats = (projId) => {
    const projectTasks = tasks.filter(t => t.projectId === projId);
    const count = projectTasks.length;
    const overdue = projectTasks.filter(t => getDueAlertBadge(t.dueDate, t.status) === 'Overdue').length;
    return { count, overdue };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Projects Directory</h1>
            <p className="text-slate-500 text-sm mt-1">Create, update, and manage your team's projects.</p>
          </div>
          <button
            onClick={() => {
              setEditingProject(null);
              setIsFormOpen(true);
            }}
            className="flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-xl transition-all active:scale-[0.98] self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Create Project</span>
          </button>
        </div>

        {/* Project List */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <span className="text-sm font-semibold text-slate-500">Loading projects...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <FolderKanban className="h-12 w-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No projects found</h3>
            <p className="text-sm text-slate-500">Get started by creating your first project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const { count, overdue } = getProjectStats(project.id);
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  taskCount={count}
                  overdueCount={overdue}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onClick={() => navigate(`/admin/projects/${project.id}`)}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Project Form Modal */}
      <ProjectForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleCreateOrUpdate}
        project={editingProject}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Project"
        message="Are you sure you want to permanently delete this project? This will also delete all associated tasks, subtasks, and logs. This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          setDeletingId(null);
        }}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-405 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="text-white font-bold text-sm">Task Manager</span>
          <p className="text-slate-500">Simple Full-Stack Task Board Application</p>
        </div>
      </footer>
    </div>
  );
}
