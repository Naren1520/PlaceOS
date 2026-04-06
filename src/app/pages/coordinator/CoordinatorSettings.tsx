import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Switch } from '../../components/ui/switch';
import { Snowflake, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export function CoordinatorSettings() {
  const { globalState, toggleFreeze, addUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'company'>('student');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error('Please fill in all fields');
      return;
    }

    addUser({ name, email, role });
    toast.success(`${role === 'student' ? 'Student' : 'Company'} added successfully!`);
    
    setName('');
    setEmail('');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Platform Settings</h1>
        <p className="opacity-70">Manage platform configuration and users</p>
      </div>

      {/* Freeze System */}
      <div 
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Snowflake size={24} style={{ color: '#3b82f6' }} />
              <h3>Freeze Platform</h3>
            </div>
            <p className="opacity-70 mb-4">
              When enabled, students cannot apply to jobs and companies cannot post new jobs.
              Use this during placement result announcements or maintenance.
            </p>
            
            {globalState.isFrozen && (
              <div 
                className="p-4 rounded-xl mb-4"
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
              >
                <p className="text-red-600 font-medium">⚠️ Platform is currently frozen</p>
                <p className="text-sm text-red-600 mt-1">
                  All job postings and applications are blocked
                </p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Switch
                checked={globalState.isFrozen}
                onCheckedChange={toggleFreeze}
              />
              <span className="font-medium">
                {globalState.isFrozen ? 'Platform Frozen' : 'Platform Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Users */}
      <div 
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <UserPlus size={24} style={{ color: '#b35c00' }} />
          <h3>Add New User</h3>
        </div>

        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block mb-2 opacity-70">User Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === 'student'}
                  onChange={(e) => setRole(e.target.value as 'student')}
                  className="w-4 h-4"
                  style={{ accentColor: '#b35c00' }}
                />
                <span>Student</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="company"
                  checked={role === 'company'}
                  onChange={(e) => setRole(e.target.value as 'company')}
                  className="w-4 h-4"
                  style={{ accentColor: '#b35c00' }}
                />
                <span>Company</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block mb-2 opacity-70">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'student' ? 'Student Name' : 'Company Name'}
              className="rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-2 opacity-70">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'student' ? 'student@email.com' : 'company@email.com'}
              className="rounded-xl"
            />
          </div>

          <Button
            type="submit"
            className="rounded-xl"
            style={{ background: '#b35c00' }}
          >
            Add {role === 'student' ? 'Student' : 'Company'}
          </Button>
        </form>
      </div>

      {/* Platform Info */}
      <div 
        className="rounded-2xl p-6"
        style={{ background: 'rgba(179, 92, 0, 0.05)', border: '1px solid rgba(179, 92, 0, 0.2)' }}
      >
        <h3 className="mb-4">ℹ️ Platform Information</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Platform:</strong> PlaceOS X - Autonomous Placement Intelligence Platform</p>
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Features:</strong> Resume Skill Extraction, Match Score Engine, Risk Prediction, Smart Recommendations</p>
        </div>
      </div>
    </div>
  );
}
