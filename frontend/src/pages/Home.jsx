import React from 'react';
import { useNavigate } from 'react-router-dom';
import { employees } from '../data/employees';
import { ShieldAlert, ArrowRight, User, FolderKanban } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-4 text-center bg-white border-b border-slate-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-indigo-400 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-pink-400 blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Task <span className="text-indigo-600">Manager</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Assign, track, and manage employee tasks and projects efficiently in a simple, responsive workspace.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300 transition-all active:scale-[0.98]"
            >
              <ShieldAlert className="h-5 w-5" />
              <span>Go To Admin Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/admin/projects')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl border border-indigo-200 bg-white hover:bg-slate-55 px-6 py-3.5 text-base font-bold text-indigo-650 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <FolderKanban className="h-5 w-5" />
              <span>View Projects</span>
            </button>
          </div>
        </div>
      </section>

      {/* Employee Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 space-y-8 w-full">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Employee Boards</h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm">Select an employee card below to open their personal Kanban task board.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => navigate(`/employee/${emp.id}`)}
              className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-indigo-200 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-55 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {emp.id}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-800 group-hover:text-indigo-650 transition-colors">
                      {emp.name}
                    </h4>
                  </div>
                </div>
                
                <div className="pt-2 space-y-1 text-xs text-slate-505">
                  <p><strong className="text-slate-700 font-semibold">Email:</strong> {emp.email}</p>
                  <p><strong className="text-slate-700 font-semibold">Phone:</strong> {emp.phone}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end text-xs font-bold text-slate-400 group-hover:text-indigo-650 transition-colors">
                <span className="flex items-center space-x-1">
                  <span>Open Board</span>
                  <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

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
