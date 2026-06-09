import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import EmployeeBoard from './pages/EmployeeBoard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/projects" element={<Projects />} />
        <Route path="/admin/projects/:projectId" element={<ProjectDetails />} />
        <Route path="/employee/:employeeId" element={<EmployeeBoard />} />
      </Routes>
      <Toaster position="bottom-right" reverseOrder={false} />
    </BrowserRouter>
  );
}
