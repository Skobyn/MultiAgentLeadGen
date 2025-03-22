import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const LeadGeneration = lazy(() => import('./pages/LeadGeneration/LeadGeneration'));
const EmailCampaigns = lazy(() => import('./pages/EmailCampaigns/EmailCampaigns'));
const ChatbotInterface = lazy(() => import('./pages/ChatbotInterface/ChatbotInterface'));
const Analytics = lazy(() => import('./pages/Analytics/Analytics'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
  </div>
);

// Authentication guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // This is a simplified version. In a real app, you'd check for auth tokens, etc.
  const isAuthenticated = true; // Replace with actual auth check
  
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<LeadGeneration />} />
          <Route path="email-campaigns" element={<EmailCampaigns />} />
          <Route path="chatbot" element={<ChatbotInterface />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;