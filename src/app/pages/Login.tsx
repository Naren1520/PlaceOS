import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { LogIn } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, users } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    
    // Slight delay to ensure context updates or handle routing appropriately
    setTimeout(() => {
        // Find if local mock matches or just route if success
        const localData = localStorage.getItem('placeos-user');
        if (localData) {
            const user = JSON.parse(localData);
            if (!user.role) {
                navigate('/select-role');
            } else if (user.role === 'student') {
                navigate('/student/dashboard');
            } else if (user.role === 'company') {
                navigate('/company/dashboard');
            } else if (user.role === 'coordinator') {
                navigate('/coordinator/dashboard');
            }
        }
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdf6ec' }}>
      <div className="w-full max-w-md">
        <div 
          className="rounded-3xl p-8 shadow-2xl"
          style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: '#b35c00' }}>
              <LogIn className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#b35c00' }}>PlaceOS X</h1>
            <p className="opacity-70">Autonomous Placement Intelligence Platform</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-2 opacity-70">Email Address (or 'admin')</label>
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block mb-2 opacity-70">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                className="rounded-xl"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl py-6 transition-all hover:scale-105"
              style={{ background: '#b35c00' }}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(179, 92, 0, 0.05)' }}>
            <p className="text-sm opacity-70 mb-2">Demo accounts:</p>
            <ul className="text-sm space-y-1" style={{ color: '#b35c00' }}>
              <li>• admin@placeos.com (Coordinator)</li>
              <li>• john@student.com (Student)</li>
              <li>• hr@techcorp.com (Company)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
