import React from 'react';
import { Layers, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center space-x-3 cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="font-sans text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Task <span className="text-indigo-600">Manager</span>
            </span>
          </div>
        </div>

        {/* Current Date Display */}
        <div className="flex items-center space-x-2 text-sm font-medium text-slate-500">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span>{currentDate}</span>
        </div>
      </div>
    </header>
  );
}
