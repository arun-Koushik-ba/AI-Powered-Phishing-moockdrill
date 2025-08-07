
import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupContent, useSidebar } from '@/components/ui/sidebar';
import { Home, Settings, LogOut, Drill, Menu, BarChart, Moon, Sun, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';

interface AdminSidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const AdminSidebar = ({
  onNavigate,
  currentPage
}: AdminSidebarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, toggleSidebar } = useSidebar();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    authService.logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      className: "bg-teal text-white"
    });
    navigate('/');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    toast({
      title: "Theme Changed",
      description: `Switched to ${isDarkMode ? 'light' : 'dark'} mode`,
      className: "bg-teal text-white"
    });
  };

  const menuItems = [{
    title: "Admin Dashboard",
    icon: Home,
    page: "home"
  }, {
    title: "Create Drill",
    icon: Drill,
    page: "create-drill"
  }, {
    title: "Analytics",
    icon: BarChart,
    page: "analytics"
  }];

  return <>
    {/* Floating Hamburger Button - Always Visible */}
    <button 
      onClick={toggleSidebar} 
      className={`fixed top-4 left-4 z-50 w-12 h-12 bg-gradient-to-br from-navy to-dark-blue rounded-lg flex items-center justify-center hover:opacity-80 hover:scale-110 transition-all duration-300 shadow-lg ${state === "collapsed" ? "hover:animate-bounce" : ""}`}
    >
      <Menu className="w-6 h-6 text-white" />
    </button>

    {/* Logo - Always Visible */}
    <button 
      onClick={() => onNavigate('home')} 
      className="fixed top-4 left-20 z-40 flex items-center space-x-2 bg-gradient-to-r from-teal to-navy rounded-lg font-bold hover:opacity-80 transition-opacity px-4 py-2 bg-gray-50 text-transparent"
    >
      <img src="/lovable-uploads/12f8f750-81e3-44a4-a12f-2b640c50729d.png" alt="HackAware Logo" className="w-8 h-8" />
      <span></span>
    </button>

    {/* Hack-Aware Image - Show when sidebar is collapsed and not scrolled */}
    {state === "collapsed" && !isScrolled && (
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30 transition-all duration-300">
        <img 
          src="/lovable-uploads/f7d2a752-cbdb-424f-b2cf-3a8db8bf7529.png" 
          alt="Hack-Aware" 
          className="w-64 h-auto opacity-90"
        />
      </div>
    )}

    <Sidebar className={`border-r border-cream bg-white dark:bg-gray-900 dark:border-gray-700 transition-all duration-300 ${state === "collapsed" ? "w-16" : "w-64"}`}>
      <SidebarHeader className="p-4 border-b border-cream dark:border-gray-700">
        {state === "expanded" && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-dark-blue dark:text-white">Management Panel</h2>
            <p className="text-sm text-dark-blue/60 dark:text-gray-400">Cybersecurity Training</p>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="flex-1 p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className={state === "collapsed" ? "mt-16" : "mt-4"}>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.page} className="group relative">
                  <SidebarMenuButton 
                    onClick={() => onNavigate(item.page)} 
                    isActive={currentPage === item.page} 
                    className={`w-full justify-start hover:bg-teal/10 hover:text-navy data-[active=true]:bg-teal data-[active=true]:text-white dark:hover:bg-teal/20 dark:text-white ${state === "collapsed" ? "justify-center p-3" : ""}`}
                  >
                    <item.icon className="w-5 h-5" />
                    {state === "expanded" && <span className="ml-3">{item.title}</span>}
                    
                    {state === "collapsed" && (
                      <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                        {item.title}
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-cream dark:border-gray-700">
        <SidebarMenu>
          <SidebarMenuItem className="group relative">
            <SidebarMenuButton 
              onClick={() => onNavigate('account-settings')} 
              isActive={currentPage === 'account-settings'} 
              className={`w-full justify-start hover:bg-purple-500/10 hover:text-purple-700 data-[active=true]:bg-purple-500 data-[active=true]:text-white dark:hover:bg-purple-500/20 dark:text-white ${state === "collapsed" ? "justify-center p-3" : ""}`}
            >
              <Settings className="w-5 h-5" />
              {state === "expanded" && <span className="ml-3">Account Settings</span>}
              
              {state === "collapsed" && (
                <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                  Account Settings
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>

    {/* Top Right Menu - Hide on scroll */}
    {!isScrolled && (
      <div className="fixed top-4 right-4 z-40 flex space-x-2 transition-all duration-300">
        <div className="group relative">
          <button 
            onClick={toggleTheme} 
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:scale-105 transition-all duration-200 shadow-lg" 
            style={{ backgroundColor: 'transparent' }}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
        </div>

        <div className="group relative">
          <button 
            onClick={handleLogout} 
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:scale-105 transition-all duration-200 shadow-lg" 
            style={{ backgroundColor: 'transparent' }}
          >
            <LogOut className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>
    )}
  </>;
};

export default AdminSidebar;
