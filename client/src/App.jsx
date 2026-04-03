import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/shared/ProtectedRoute';

import AdminDashboard from './pages/admin/AdminDashboard';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import SubmitLog from './pages/student/SubmitLog';
import MyBadges from './pages/student/MyBadges';
import MentorDashboard from './pages/mentor/MentorDashboard';

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>

        {/* Faculty Routes */}
        <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
          <Route path="/faculty/*" element={<FacultyDashboard />} />
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/log/new" element={<SubmitLog />} />
          <Route path="/student/badges" element={<MyBadges />} />
        </Route>

        {/* Mentor Routes */}
        <Route element={<ProtectedRoute allowedRoles={['mentor']} />}>
          <Route path="/mentor/*" element={<MentorDashboard />} />
        </Route>

        {/* Unauthorized Route */}
        <Route 
          path="/unauthorized" 
          element={
            <div className="flex h-screen items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900">403</h1>
                <p className="mt-2 text-lg text-gray-600">Access Denied</p>
                <button 
                  onClick={() => window.history.back()}
                  className="mt-6 text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Go Back
                </button>
              </div>
            </div>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;
