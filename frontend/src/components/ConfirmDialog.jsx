import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center space-x-3 text-amber-600">
          <AlertTriangle className="h-6 w-6" />
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>
        <p className="mt-3 text-sm text-slate-500 leading-relaxed">{message}</p>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-100 transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
