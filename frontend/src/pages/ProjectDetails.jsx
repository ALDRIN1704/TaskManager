import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import FilterBar from '../components/FilterBar';
import ActivityTimeline from '../components/ActivityTimeline';
import ConfirmDialog from '../components/ConfirmDialog';
import TaskForm from '../components/TaskForm';
import SubTaskForm from '../components/SubTaskForm';
import DueBadge from '../components/DueBadge';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { subTaskService } from '../services/subTaskService';
import { activityService } from '../services/activityService';
import { calculateDuration, getDueAlertBadge } from '../utils/dateUtils';
import { filterItems } from '../utils/filterUtils';
import { ArrowLeft, Calendar, Clock, Plus, Edit2, Trash2, Layers, ChevronDown, ChevronRight, GitCommit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Expanded task IDs state
  const [expandedTasks, setExpandedTasks] = useState({});

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    type: '',
    assignedTo: '',
    dueAlert: '',
    search: ''
  });

  // Task form modal states
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Subtask form modal states
  const [isSubTaskFormOpen, setIsSubTaskFormOpen] = useState(false);
  const [editingSubTask, setEditingSubTask] = useState(null);
  const [subTaskParent, setSubTaskParent] = useState(null); // { id, title }

  // Delete dialog states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(''); // 'task' or 'subtask'
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    setIsLoading(true);
    try {
      const [proj, tasksData, subtasksData, actData] = await Promise.all([
        projectService.getProjectById(projectId),
        taskService.getTasksByProject(projectId),
        subTaskService.getSubTasksByProject(projectId),
        activityService.getActivitiesByProject(projectId)
      ]);
      setProject(proj);
      setTasks(tasksData || []);
      setSubTasks(subtasksData || []);
      setActivities(actData || []);

      // Expand all tasks by default
      const expandMap = {};
      if (tasksData) {
        tasksData.forEach(t => { expandMap[t.id] = true; });
      }
      setExpandedTasks(expandMap);
    } catch (err) {
      toast.error('Failed to load project details');
      navigate('/admin/projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdateTask = async (formData) => {
    try {
      if (editingTask) {
        const updated = await taskService.updateTask(editingTask.id, formData);
        setTasks(prev => prev.map(t => t.id === editingTask.id ? updated : t));
        toast.success('Task updated successfully');
      } else {
        const created = await taskService.createTask({ ...formData, projectId });
        setTasks(prev => [...prev, created]);
        setExpandedTasks(prev => ({ ...prev, [created.id]: true }));
        toast.success('Task created successfully');
      }
      setIsTaskFormOpen(false);
      setEditingTask(null);
      // Reload activity logs
      const actData = await activityService.getActivitiesByProject(projectId);
      setActivities(actData || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save task';
      toast.error(message);
    }
  };

  const handleCreateOrUpdateSubTask = async (formData) => {
    try {
      if (editingSubTask) {
        const updated = await subTaskService.updateSubTask(editingSubTask.id, formData);
        setSubTasks(prev => prev.map(st => st.id === editingSubTask.id ? updated : st));
        toast.success('Subtask updated successfully');
      } else {
        const created = await subTaskService.createSubTask({
          ...formData,
          projectId,
          parentTaskId: subTaskParent.id
        });
        setSubTasks(prev => [...prev, created]);
        toast.success('Subtask created successfully');
      }
      setIsSubTaskFormOpen(false);
      setEditingSubTask(null);
      setSubTaskParent(null);
      // Reload activity logs
      const actData = await activityService.getActivitiesByProject(projectId);
      setActivities(actData || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save subtask';
      toast.error(message);
    }
  };

  const handleEditTaskClick = (task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleEditSubTaskClick = (subt) => {
    setEditingSubTask(subt);
    const parentTask = tasks.find(t => t.id === subt.parentTaskId);
    setSubTaskParent(parentTask || { id: subt.parentTaskId, title: subt.parentTaskTitle });
    setIsSubTaskFormOpen(true);
  };

  const handleDeleteClick = (id, type) => {
    setDeletingId(id);
    setDeleteType(type);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      if (deleteType === 'task') {
        await taskService.deleteTask(deletingId);
        setTasks(prev => prev.filter(t => t.id !== deletingId));
        setSubTasks(prev => prev.filter(st => st.parentTaskId !== deletingId));
        toast.success('Task deleted successfully');
      } else {
        await subTaskService.deleteSubTask(deletingId);
        setSubTasks(prev => prev.filter(st => st.id !== deletingId));
        toast.success('Subtask deleted successfully');
      }
      // Reload activity logs
      const actData = await activityService.getActivitiesByProject(projectId);
      setActivities(actData || []);
    } catch (err) {
      toast.error(`Failed to delete ${deleteType}`);
    } finally {
      setIsDeleteOpen(false);
      setDeletingId(null);
      setDeleteType('');
    }
  };

  const toggleTaskExpanded = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  if (isLoading || !project) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
        <Navbar />
        <div className="py-20 flex-1 flex flex-col items-center justify-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-650 border-t-transparent" />
          <span className="text-sm font-semibold text-slate-500">Loading project details...</span>
        </div>
      </div>
    );
  }

  // Calculate project duration
  const projectDuration = calculateDuration(project.startDate, project.endDate);

  // Group subtasks by parent task
  const subTasksByParent = subTasks.reduce((acc, st) => {
    if (!acc[st.parentTaskId]) acc[st.parentTaskId] = [];
    acc[st.parentTaskId].push(st);
    return acc;
  }, {});

  // Apply filters in memory
  const filteredTasks = filterItems(tasks, filters);
  const filteredSubTasks = filterItems(subTasks, filters);

  const filteredSubTasksByParent = filteredSubTasks.reduce((acc, st) => {
    if (!acc[st.parentTaskId]) acc[st.parentTaskId] = [];
    acc[st.parentTaskId].push(st);
    return acc;
  }, {});

  // Determine which tasks to show: either it matches tasks filters OR has subtasks that match filters
  const tasksToShow = tasks.filter(task => {
    const taskMatches = filteredTasks.some(t => t.id === task.id);
    const hasMatchingSubtask = filteredSubTasksByParent[task.id] && filteredSubTasksByParent[task.id].length > 0;
    return taskMatches || hasMatchingSubtask;
  });

  // Calculate stats
  const totalTasks = tasks.length;
  const todoCount = tasks.filter(t => t.status === 'TODO').length;
  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const overdueCount = tasks.filter(t => getDueAlertBadge(t.dueDate, t.status) === 'Overdue').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-850 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Navigation & Actions */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/admin/projects')}
            className="flex items-center space-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Projects List</span>
          </button>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Project ID: {project.id}</span>
                <h1 className="text-2xl font-black text-slate-900 leading-tight">{project.name}</h1>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">{project.description || 'No description provided.'}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-xs font-semibold text-slate-600 md:border-l md:border-slate-100 md:pl-8">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <div>
                  <span className="block text-[10px] uppercase text-slate-400">Timeline</span>
                  <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <div>
                  <span className="block text-[10px] uppercase text-slate-400">Duration</span>
                  <span>{projectDuration} {projectDuration === 1 ? 'Day' : 'Days'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Tasks</span>
            <span className="block text-2xl font-black text-slate-900 mt-1">{totalTasks}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="block text-[10px] font-bold text-slate-405 uppercase tracking-wider">To Do</span>
            <span className="block text-2xl font-black text-slate-600 mt-1">{todoCount}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="block text-[10px] font-bold text-slate-405 uppercase tracking-wider">In Progress</span>
            <span className="block text-2xl font-black text-blue-600 mt-1">{inProgressCount}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="block text-[10px] font-bold text-slate-405 uppercase tracking-wider">Completed</span>
            <span className="block text-2xl font-black text-emerald-600 mt-1">{completedCount}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center col-span-2 lg:col-span-1">
            <span className="block text-[10px] font-bold text-slate-405 uppercase tracking-wider">Overdue</span>
            <span className={`block text-2xl font-black mt-1 ${overdueCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{overdueCount}</span>
          </div>
        </div>

        {/* Filtering */}
        <FilterBar filters={filters} setFilters={setFilters} />

        {/* Task Board and Timeline columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Nested Tasks List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Project Backlog</h2>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setIsTaskFormOpen(true);
                }}
                className="flex items-center justify-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-sm transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            {tasksToShow.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 shadow-sm">
                No matching tasks or subtasks found in this project.
              </div>
            ) : (
              <div className="space-y-4">
                {tasksToShow.map(task => {
                  const isExpanded = !!expandedTasks[task.id];
                  const taskSubtasks = filteredSubTasksByParent[task.id] || [];
                  const totalSubtasksCount = subTasksByParent[task.id]?.length || 0;
                  const taskMatches = filteredTasks.some(t => t.id === task.id);
                  const isOverdue = getDueAlertBadge(task.dueDate, task.status) === 'Overdue' && task.status !== 'COMPLETED';

                  return (
                    <div 
                      key={task.id} 
                      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                        isOverdue ? 'border-rose-200' : 'border-slate-200'
                      }`}
                    >
                      {/* Parent Task Header Row */}
                      <div className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isOverdue ? 'bg-rose-50/20' : 'bg-slate-50/20'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleTaskExpanded(task.id)}
                            className="p-1 hover:bg-slate-100 rounded-md text-slate-500"
                          >
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[9px] font-bold uppercase">
                                {task.type || 'TASK'}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                                task.priority === 'HIGH' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                'bg-emerald-50 text-emerald-700 border-emerald-100'
                              }`}>
                                {task.priority}
                              </span>
                              <DueBadge dueDate={task.dueDate} status={task.status} />
                            </div>
                            
                            <h3 className={`text-sm font-extrabold text-slate-800 mt-1 line-clamp-1 ${!taskMatches ? 'opacity-50 line-through' : ''}`}>
                              {task.title}
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-semibold">
                              Assignee: {task.assignedToName || 'Unassigned'} • Duration: {calculateDuration(task.startDate, task.dueDate)} days
                            </p>
                          </div>
                        </div>

                        {/* Actions for Parent Task */}
                        <div className="flex items-center space-x-2 sm:self-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            task.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                            task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {task.status}
                          </span>
                          
                          <button
                            onClick={() => {
                              setSubTaskParent({ id: task.id, title: task.title });
                              setEditingSubTask(null);
                              setIsSubTaskFormOpen(true);
                            }}
                            className="text-[10px] font-bold text-indigo-650 hover:text-indigo-700 px-2 py-1 bg-indigo-50 rounded"
                          >
                            + Subtask
                          </button>
                          <button
                            onClick={() => handleEditTaskClick(task)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(task.id, 'task')}
                            className="p-1 hover:bg-rose-50 rounded text-slate-500 hover:text-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Subtasks Section */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50/30">
                          {totalSubtasksCount === 0 ? (
                            <div className="p-3 text-center text-slate-400 text-xs font-semibold">
                              No subtasks created for this task.
                            </div>
                          ) : taskSubtasks.length === 0 ? (
                            <div className="p-3 text-center text-slate-405 text-xs">
                              Subtasks hidden by filters.
                            </div>
                          ) : (
                            <div className="divide-y divide-slate-105/50">
                              {taskSubtasks.map(st => {
                                const isStOverdue = getDueAlertBadge(st.dueDate, st.status) === 'Overdue' && st.status !== 'COMPLETED';
                                return (
                                  <div 
                                    key={st.id} 
                                    className={`p-3 pl-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                                      isStOverdue ? 'bg-rose-50/10' : ''
                                    }`}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <GitCommit className="h-3.5 w-3.5 text-purple-400" />
                                      <div>
                                        <div className="flex items-center space-x-2">
                                          <span className="font-extrabold text-slate-700">{st.title}</span>
                                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                                            st.priority === 'HIGH' ? 'bg-rose-50/50 text-rose-700 border-rose-100' :
                                            st.priority === 'MEDIUM' ? 'bg-amber-50/50 text-amber-700 border-amber-100' :
                                            'bg-emerald-50/50 text-emerald-700 border-emerald-100'
                                          }`}>
                                            {st.priority}
                                          </span>
                                          <DueBadge dueDate={st.dueDate} status={st.status} />
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                          Assignee: {st.assignedToName || 'Unassigned'} • Duration: {calculateDuration(st.startDate, st.dueDate)} days
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center space-x-2 sm:self-center">
                                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                        st.status === 'COMPLETED' ? 'bg-emerald-55 text-emerald-800' :
                                        st.status === 'IN_PROGRESS' ? 'bg-blue-55 text-blue-805' :
                                        'bg-slate-100 text-slate-800'
                                      }`}>
                                        {st.status}
                                      </span>
                                      
                                      <button
                                        onClick={() => handleEditSubTaskClick(st)}
                                        className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-650"
                                      >
                                        <Edit2 className="h-3 w-3" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteClick(st.id, 'subtask')}
                                        className="p-1 hover:bg-rose-55 rounded text-slate-500 hover:text-rose-600"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Activity Timeline Column */}
          <div className="space-y-4">
            <ActivityTimeline activities={activities} />
          </div>
        </div>
      </main>

      {/* Task Creation/Editing Modal */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
        task={editingTask}
        preselectedProjectId={projectId}
      />

      {/* Subtask Creation/Editing Modal */}
      <SubTaskForm
        isOpen={isSubTaskFormOpen}
        onClose={() => {
          setIsSubTaskFormOpen(false);
          setEditingSubTask(null);
          setSubTaskParent(null);
        }}
        onSubmit={handleCreateOrUpdateSubTask}
        subTask={editingSubTask}
        projectId={projectId}
        parentTaskId={subTaskParent?.id}
        parentTaskTitle={subTaskParent?.title}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title={`Delete ${deleteType === 'task' ? 'Task' : 'Subtask'}`}
        message={`Are you sure you want to permanently delete this ${
          deleteType === 'task' ? 'task and all its subtasks' : 'subtask'
        }? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          setDeletingId(null);
          setDeleteType('');
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
