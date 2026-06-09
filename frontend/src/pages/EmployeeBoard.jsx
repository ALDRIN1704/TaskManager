import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeById } from '../data/employees';
import { taskService } from '../services/taskService';
import Navbar from '../components/Navbar';
import KanbanBoard from '../components/KanbanBoard';
import { ArrowLeft, Mail, Phone, User, Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmployeeBoard() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Task detail modal state
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const emp = getEmployeeById(employeeId);
    if (!emp) {
      toast.error('Employee not found');
      navigate('/');
      return;
    }
    setEmployee(emp);
    fetchTasks(emp.id);
  }, [employeeId, navigate]);

  const fetchTasks = async (id) => {
    setIsLoading(true);
    try {
      const data = await taskService.getTasksByEmployee(id);
      setTasks(data || []);
    } catch (err) {
      toast.error('Failed to load tasks from API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    // Update local UI immediately for responsiveness
    const oldTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      toast.success('Task status updated successfully');
    } catch (err) {
      // Revert if API fails
      setTasks(oldTasks);
      toast.error('Failed to update status on server');
    }
  };

  if (!employee) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Back Link and Profile Details */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Employee List</span>
          </button>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <User className="h-7 w-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">{employee.id}</span>
                <h1 className="text-2xl font-black text-slate-900 leading-tight">{employee.name}</h1>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-slate-600 md:border-l md:border-slate-100 md:pl-8">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{employee.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board Container */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Your Task Board</h2>
          
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              <span className="text-sm font-semibold text-slate-500">Loading your board...</span>
            </div>
          ) : (
            <KanbanBoard
              tasks={tasks}
              onTaskStatusChange={handleTaskStatusChange}
              onOpenDetailsTask={setSelectedTask}
              isAdmin={false}
            />
          )}
        </div>
      </main>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Task Details</h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="py-4 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Title</span>
                <p className="text-base font-extrabold text-slate-900 mt-0.5">{selectedTask.title}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</span>
                <p className="text-sm text-slate-600 leading-relaxed mt-0.5">
                  {selectedTask.description || 'No description provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Priority</span>
                  <div className="mt-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      selectedTask.priority === 'HIGH' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      selectedTask.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {selectedTask.priority}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Due Date</span>
                  <div className="flex items-center space-x-1.5 mt-1 text-sm font-semibold text-slate-700">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{new Date(selectedTask.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
