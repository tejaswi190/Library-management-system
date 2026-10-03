import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'

// Student pages
import StudentDashboard from './pages/student/StudentDashboard'
import BrowseBooks from './pages/student/BrowseBooks'
import MyBooks from './pages/student/MyBooks'
import StudentNotifications from './pages/student/StudentNotifications'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageBooks from './pages/admin/ManageBooks'
import IssueReturn from './pages/admin/IssueReturn'
import AllRecords from './pages/admin/AllRecords'
import OverdueBooks from './pages/admin/OverdueBooks'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Student routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/browse" element={
            <ProtectedRoute role="STUDENT"><BrowseBooks /></ProtectedRoute>
          } />
          <Route path="/student/my-books" element={
            <ProtectedRoute role="STUDENT"><MyBooks /></ProtectedRoute>
          } />
          <Route path="/student/notifications" element={
            <ProtectedRoute role="STUDENT"><StudentNotifications /></ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/books" element={
            <ProtectedRoute role="ADMIN"><ManageBooks /></ProtectedRoute>
          } />
          <Route path="/admin/issue-return" element={
            <ProtectedRoute role="ADMIN"><IssueReturn /></ProtectedRoute>
          } />
          <Route path="/admin/records" element={
            <ProtectedRoute role="ADMIN"><AllRecords /></ProtectedRoute>
          } />
          <Route path="/admin/overdue" element={
            <ProtectedRoute role="ADMIN"><OverdueBooks /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
