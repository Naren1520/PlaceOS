import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { SkillTag } from '../../components/SkillTag';

export function CompanyPostJob() {
  const { user, addJob, globalState } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      toast.error('Skill already added');
      return;
    }

    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (globalState.isFrozen) {
      toast.error('Job postings are frozen by the coordinator');
      return;
    }

    if (skills.length === 0) {
      toast.error('Please add at least one required skill');
      return;
    }

    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      toast.error('Deadline must be in the future');
      return;
    }

    addJob({
      title,
      description,
      skillsRequired: skills,
      deadline: deadlineDate,
      companyId: user!.id,
      companyName: user!.name,
    });

    toast.success('Job posted successfully!');
    navigate('/company/jobs');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Post New Job</h1>
        <p className="opacity-70">Create a job posting to attract talented students</p>
      </div>

      {globalState.isFrozen && (
        <div 
          className="rounded-2xl p-4"
          style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
        >
          <p className="text-red-600 font-medium">
            Job postings are currently frozen by the coordinator
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div 
          className="rounded-2xl p-6 space-y-6"
          style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
        >
          <div>
            <label className="block mb-2 opacity-70">Job Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Full Stack Developer"
              required
              className="rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-2 opacity-70">Job Description *</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, responsibilities, and requirements..."
              required
              className="min-h-[150px] rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-2 opacity-70">Application Deadline *</label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              className="rounded-xl"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block mb-2 opacity-70">Required Skills *</label>
            <div className="flex gap-2 mb-4">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="e.g., React, Python, SQL"
                className="rounded-xl"
              />
              <Button
                type="button"
                onClick={handleAddSkill}
                style={{ background: '#b35c00' }}
              >
                <Plus size={18} />
              </Button>
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <div key={skill} className="relative group">
                    <SkillTag skill={skill} />
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-6 border-t" style={{ borderColor: 'rgba(179, 92, 0, 0.1)' }}>
            <Button
              type="submit"
              className="rounded-xl"
              style={{ background: '#22c55e' }}
              disabled={globalState.isFrozen}
            >
              {globalState.isFrozen ? 'Posting Frozen' : 'Post Job'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => navigate('/company/jobs')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
