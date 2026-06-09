import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeById } from '../data/employees';
import { taskService } from '../services/taskService';
import { subTaskService } from '../services/subTaskService';
import Navbar from '../components/Navbar';
import KanbanBoard from '../components/KanbanBoard';
import DueBadge from '../components/DueBadge';
import { ArrowLeft, Mail, Phone, User, Calendar, X, GitCommit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmployeeBoard() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Task/Subtask detail modal state
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const emp = getEmployeeById(employeeId);
    if (!emp) {
      toast.error('Employee not found');
      navigate('/');
      return;
    }
    setEmployee(emp);
    fetchBoardData(emp.id);
  }, [employeeId, navigate]);

  const fetchBoardData = async (empId) => {
    setIsLoading(true);
    try {
      const [tasksData, subtasksData] = await Promise.all([
        taskService.getTasksByEmployee(empId),
        subTaskService.getSubTasksByEmployee(empId)
      ]);
      setTasks(tasksData || []);
      setSubTasks(subtasksData || []);
    } catch (err) {
      toast.error('Failed to load board tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskStatusChange = async (itemId, newStatus, isSubTask) => {
    const oldTasks = [...tasks];
    const oldSubtasks = [...subTasks];

    // Optimistically update state
    if (isSubTask) {
      setSubTasks(prev => prev.map(t => t.id === itemId ? { ...t, status: newStatus } : t));
    } else {
      setTasks(prev => prev.map(t => t.id === itemId ? { ...t, status: newStatus } : t));
    }
    
    try {
      if (isSubTask) {
        await subTaskService.updateSubTaskStatus(itemId, newStatus, employee.name);
      } else {
        await taskService.updateTaskStatus(itemId, newStatus, employee.name);
      }
      toast.success('Status updated successfully');
    } catch (err) {
      // Revert states
      setTasks(oldTasks);
      setSubTasks(oldSubtasks);
      toast.error('Failed to update status on server');
    }
  };

  if (!employee) return null;

  // Combine tasks and subtasks for Kanban board rendering
  const combinedItems = [
    ...tasks,
    ...subTasks
  ];

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
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{employee.id}</span>
                <h1 className="text-2xl font-black text-slate-900 leading-tight">{employee.name}</h1>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-slate-600 md:border-l md:border-slate-100 md:pl-8 font-semibold">
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
              tasks={combinedItems}
              onTaskStatusChange={handleTaskStatusChange}
              onOpenDetailsTask={setSelectedItem}
              isAdmin={false}
            />
          )}
        </div>
      </main>

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {selectedItem.parentTaskId ? 'Subtask Details' : 'Task Details'}
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="py-4 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Project</span>
                <p className="text-sm font-bold text-slate-750">{selectedItem.projectName}</p>
              </div>

              {selectedItem.parentTaskId && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Parent Task</span>
                  <p className="text-sm font-bold text-purple-700 flex items-center gap-1 mt-0.5">
                    <GitCommit className="h-4 w-4 text-purple-400 inline" />
                    {selectedItem.parentTaskTitle}
                  </p>
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Title</span>
                <p className="text-base font-extrabold text-slate-900 mt-0.5">{selectedItem.title}</p>
              </div>

              {!selectedItem.parentTaskId && selectedItem.type && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Task Type</span>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-755 text-xs font-bold uppercase border border-indigo-100 mt-1">
                    {selectedItem.type}
                  </span>
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</span>
                <p className="text-sm text-slate-600 leading-relaxed mt-0.5">
                  {selectedItem.description || 'No description provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Priority</span>
                  <div className="mt-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      selectedItem.priority === 'HIGH' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      selectedItem.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {selectedItem.priority}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Due Date</span>
                  <div className="flex items-center space-x-1.5 mt-1 text-sm font-semibold text-slate-755">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{new Date(selectedItem.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                    <DueBadge dueDate={selectedItem.dueDate} status={selectedItem.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Start Date</span>
                  <span className="text-xs font-semibold text-slate-700 mt-1 block">
                    {selectedItem.startDate ? new Date(selectedItem.startDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Duration</span>
                  <span className="text-xs font-semibold text-slate-700 mt-1 block">
                    {calculateDuration(selectedItem.startDate, selectedItem.dueDate)} days
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
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
