import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  Settings,
  ChevronLeft,
  Building2,
  UserCircle,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const getNavItems = (): NavItem[] => {
    if (user?.role === 'student') {
      return [
        { label: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard size={20} /> },
        { label: 'Browse Jobs', path: '/student/jobs', icon: <Briefcase size={20} /> },
        { label: 'My Applications', path: '/student/applications', icon: <FileText size={20} /> },
        { label: 'Profile', path: '/student/profile', icon: <UserCircle size={20} /> },
      ];
    } else if (user?.role === 'company') {
      return [
        { label: 'Dashboard', path: '/company/dashboard', icon: <LayoutDashboard size={20} /> },
        { label: 'Post Job', path: '/company/post-job', icon: <Briefcase size={20} /> },
        { label: 'My Jobs', path: '/company/jobs', icon: <Building2 size={20} /> },
        { label: 'Applications', path: '/company/applications', icon: <FileText size={20} /> },
      ];
    } else if (user?.role === 'coordinator') {
      return [
        { label: 'Dashboard', path: '/coordinator/dashboard', icon: <LayoutDashboard size={20} /> },
        { label: 'Students', path: '/coordinator/students', icon: <Users size={20} /> },
        { label: 'Companies', path: '/coordinator/companies', icon: <Building2 size={20} /> },
        { label: 'Analytics', path: '/coordinator/analytics', icon: <BarChart3 size={20} /> },
        { label: 'Settings', path: '/coordinator/settings', icon: <Settings size={20} /> },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <div
      className={`h-screen sticky top-0 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)' }}
    >
      <div className="flex flex-col h-full border-r border-[#b35c00]/10">
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#b35c00' }}>
                <span className="text-white font-bold">P</span>
              </div>
              <span className="font-bold" style={{ color: '#b35c00' }}>PlaceOS X</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-[#b35c00]/10 transition-colors"
          >
            <ChevronLeft
              size={20}
              className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
              style={{ color: '#b35c00' }}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 mb-1 rounded-xl transition-all ${
                  isActive
                    ? 'shadow-md'
                    : 'hover:bg-[#b35c00]/5 hover:scale-105'
                }`}
                style={{
                  background: isActive ? '#b35c00' : 'transparent',
                  color: isActive ? '#ffffff' : '#b35c00',
                }}
              >
                <span>{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        {!isCollapsed && user && (
          <div className="p-4 border-t border-[#b35c00]/10">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#b35c00' }}>
                <span className="text-white font-bold">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-sm opacity-70 truncate capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
