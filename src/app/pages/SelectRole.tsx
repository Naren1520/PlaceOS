import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Users, Briefcase, Building2 } from 'lucide-react';

export function SelectRole() {
  const { setUserRole } = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      role: 'student' as const,
      title: 'Student',
      description: 'Upload resume, apply to jobs, track applications',
      icon: Users,
      path: '/student/dashboard',
    },
    {
      role: 'company' as const,
      title: 'Company',
      description: 'Post jobs, review applications, hire talent',
      icon: Building2,
      path: '/company/dashboard',
    },
    {
      role: 'coordinator' as const,
      title: 'Coordinator',
      description: 'Manage platform, view analytics, oversee placements',
      icon: Briefcase,
      path: '/coordinator/dashboard',
    },
  ];

  const handleSelectRole = (role: 'student' | 'company' | 'coordinator', path: string) => {
    setUserRole(role);
    navigate(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdf6ec' }}>
      <div className="w-full max-w-4xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#b35c00' }}>Select Your Role</h1>
          <p className="opacity-70">Choose how you want to use PlaceOS X</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((item) => (
            <div
              key={item.role}
              className="rounded-2xl p-8 transition-all hover:scale-105 hover:shadow-2xl cursor-pointer"
              style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}
              onClick={() => handleSelectRole(item.role, item.path)}
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: '#b35c00' }}
              >
                <item.icon className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="opacity-70 mb-6">{item.description}</p>
              <Button
                className="w-full rounded-xl"
                style={{ background: '#b35c00' }}
              >
                Continue as {item.title}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
