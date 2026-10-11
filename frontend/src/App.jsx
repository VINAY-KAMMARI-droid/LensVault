import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import AppLayout from './components/layout/AppLayout';

// Public pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import AccessDeniedPage from './pages/public/AccessDeniedPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Photographer pages
import PhotographerDashboard from './pages/photographer/PhotographerDashboard';
import EventsListPage from './pages/photographer/EventsListPage';
import EventDetailPage from './pages/photographer/EventDetailPage';
import AlbumDetailPage from './pages/photographer/AlbumDetailPage';

// Client pages
import ClientDashboard from './pages/client/ClientDashboard';
import ClientEventView from './pages/client/ClientEventView';
import ClientAlbumView from './pages/client/ClientAlbumView';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />

        {/* Authenticated Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Photographer Role Routes */}
          <Route
            path="/photographer"
            element={
              <RoleRoute allowedRoles={['PHOTOGRAPHER', 'ADMIN']}>
                <PhotographerDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/photographer/events"
            element={
              <RoleRoute allowedRoles={['PHOTOGRAPHER', 'ADMIN']}>
                <EventsListPage />
              </RoleRoute>
            }
          />
          <Route
            path="/photographer/events/:eventId"
            element={
              <RoleRoute allowedRoles={['PHOTOGRAPHER', 'ADMIN']}>
                <EventDetailPage />
              </RoleRoute>
            }
          />
          <Route
            path="/photographer/events/:eventId/albums/:albumId"
            element={
              <RoleRoute allowedRoles={['PHOTOGRAPHER', 'ADMIN']}>
                <AlbumDetailPage />
              </RoleRoute>
            }
          />

          {/* Client Role Routes */}
          <Route
            path="/client"
            element={
              <RoleRoute allowedRoles={['CLIENT', 'ADMIN']}>
                <ClientDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/client/events/:eventId"
            element={
              <RoleRoute allowedRoles={['CLIENT', 'ADMIN']}>
                <ClientEventView />
              </RoleRoute>
            }
          />
          <Route
            path="/client/events/:eventId/albums/:albumId"
            element={
              <RoleRoute allowedRoles={['CLIENT', 'ADMIN']}>
                <ClientAlbumView />
              </RoleRoute>
            }
          />

          {/* Administrator Role Routes */}
          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RoleRoute allowedRoles={['ADMIN']}>
                <AdminUsersPage />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <RoleRoute allowedRoles={['ADMIN']}>
                <AdminAuditLogsPage />
              </RoleRoute>
            }
          />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
