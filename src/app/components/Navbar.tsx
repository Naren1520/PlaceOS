import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';

export function Navbar() {
  const { user, logout, globalState } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sticky top-0 z-10 border-b border-[#b35c00]/10 px-6 py-4" style={{ background: 'rgba(253, 246, 236, 0.9)', backdropFilter: 'blur(10px)' }}>
      <div className="flex items-center justify-between">
        <div>
          {globalState.isFrozen && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-sm text-red-700 font-medium">Platform is currently frozen</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl hover:bg-[#b35c00]/10 transition-all hover:scale-105">
            <Bell size={20} style={{ color: '#b35c00' }} />
          </button>

          <div className="flex items-center gap-3 px-4 py-2 rounded-xl" style={{ background: 'rgba(179, 92, 0, 0.05)' }}>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm opacity-70 capitalize">{user?.role}</p>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
