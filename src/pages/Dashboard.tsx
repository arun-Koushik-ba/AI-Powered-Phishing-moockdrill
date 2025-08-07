import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/AdminSidebar';
import { authService } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';
import HomePage from '@/pages/dashboard/HomePage';
import CreateDrillPage from '@/pages/dashboard/CreateDrillPage';
import AccountSettingsPage from '@/pages/dashboard/AccountSettingsPage';
import AnalyticsPage from '@/pages/dashboard/AnalyticsPage';
const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = useNavigate();
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };
  const getPageTitle = () => {
    switch (currentPage) {
      case 'home':
        return 'Admin Dashboard';
      case 'create-drill':
        return 'Create Mock Drill';
      case 'analytics':
        return 'Analytics';
      case 'account-settings':
        return 'Account Settings';
      default:
        return 'Admin Dashboard';
    }
  };
  const getPageDescription = () => {
    switch (currentPage) {
      case 'home':
        return 'AI Mock Drill Simulation Platform - Cybersecurity Awareness';
      case 'create-drill':
        return 'Create personalized phishing simulations for security training';
      case 'analytics':
        return 'Monitor drill performance and security awareness metrics';
      case 'account-settings':
        return 'Manage your account settings and preferences';
      default:
        return 'Welcome to your admin dashboard';
    }
  };
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'create-drill':
        return <CreateDrillPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'account-settings':
        return <AccountSettingsPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };
  if (!authService.isAuthenticated()) {
    return null;
  }
  return <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-purple-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <AdminSidebar onNavigate={handleNavigate} currentPage={currentPage} />
        <main className="flex-1 pl-20">
          <div className="p-6 pt-20">
            <div className="mb-6">
              
              
            </div>
            <div className="animate-fade-in">
              {renderCurrentPage()}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>;
};
export default Dashboard;