import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, RoleRoute } from './components/PrivateRoute';
import Navbar from './components/Navbar';

import Login               from './pages/Login';
import Register            from './pages/Register';
import StudentDashboard    from './pages/StudentDashboard';
import ScholarshipList     from './pages/ScholarshipList';
import ScholarshipDetail   from './pages/ScholarshipDetail';
import MyApplications      from './pages/MyApplications';
import ApplicationDetail   from './pages/ApplicationDetail';
import AdminDashboard      from './pages/AdminDashboard';
import AdminScholarships   from './pages/AdminScholarships';
import AdminApplications   from './pages/AdminApplications';
import AdminApplicationReview from './pages/AdminApplicationReview';

import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student routes */}
          <Route path="/dashboard" element={
            <RoleRoute role="student"><StudentDashboard /></RoleRoute>
          } />
          <Route path="/scholarships" element={
            <PrivateRoute><ScholarshipList /></PrivateRoute>
          } />
          <Route path="/scholarships/:id" element={
            <PrivateRoute><ScholarshipDetail /></PrivateRoute>
          } />
          <Route path="/my-applications" element={
            <RoleRoute role="student"><MyApplications /></RoleRoute>
          } />
          <Route path="/applications/:id" element={
            <PrivateRoute><ApplicationDetail /></PrivateRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <RoleRoute role="admin"><AdminDashboard /></RoleRoute>
          } />
          <Route path="/admin/scholarships" element={
            <RoleRoute role="admin"><AdminScholarships /></RoleRoute>
          } />
          <Route path="/admin/applications" element={
            <RoleRoute role="admin"><AdminApplications /></RoleRoute>
          } />
          <Route path="/admin/applications/:id" element={
            <RoleRoute role="admin"><AdminApplicationReview /></RoleRoute>
          } />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
