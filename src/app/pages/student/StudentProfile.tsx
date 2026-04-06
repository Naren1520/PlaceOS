import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { SkillTag } from '../../components/SkillTag';
import { Upload, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

// Simple keyword extraction from resume text
const extractSkills = (text: string): string[] => {
  const skillKeywords = [
    'React', 'Angular', 'Vue', 'Node.js', 'Python', 'Java', 'JavaScript', 'TypeScript',
    'MongoDB', 'PostgreSQL', 'MySQL', 'SQL', 'NoSQL', 'AWS', 'Azure', 'Docker',
    'Kubernetes', 'Git', 'REST', 'GraphQL', 'Express', 'Django', 'Spring', 'Flask',
    'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'Redux', 'Next.js', 'Webpack', 'CI/CD',
  ];

  const foundSkills = new Set<string>();
  const lowerText = text.toLowerCase();

  skillKeywords.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.add(skill);
    }
  });

  return Array.from(foundSkills);
};

export function StudentProfile() {
  const { user, getStudent, updateStudent } = useAuth();
  const student = getStudent(user?.id || '');

  const [github, setGithub] = useState(student?.github || '');
  const [resumeText, setResumeText] = useState('');
  const [skills, setSkills] = useState<string[]>(student?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [githubScore, setGithubScore] = useState(student?.githubScore || 0);

  useEffect(() => {
    if (student) {
      setGithub(student.github);
      setSkills(student.skills);
      setGithubScore(student.githubScore);
    }
  }, [student]);

  const handleExtractSkills = () => {
    if (!resumeText.trim()) {
      toast.error('Please paste your resume text first');
      return;
    }

    const extractedSkills = extractSkills(resumeText);
    if (extractedSkills.length === 0) {
      toast.error('No skills found. Try adding them manually.');
      return;
    }

    setSkills(extractedSkills);
    toast.success(`Extracted ${extractedSkills.length} skills from resume`);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      toast.error('Skill already added');
      return;
    }

    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
    toast.success('Skill added');
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSave = () => {
    if (skills.length === 0) {
      toast.error('Please add at least one skill');
      return;
    }

    // Calculate risk level based on average match scores
    let riskLevel: 'low' | 'medium' | 'high' = 'high';
    if (githubScore > 70) riskLevel = 'low';
    else if (githubScore > 50) riskLevel = 'medium';

    updateStudent(user!.id, {
      github,
      skills,
      githubScore,
      riskLevel,
      resumeUrl: 'resume.pdf', // Simulated
    });

    toast.success('Profile updated successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Student Profile</h1>
        <p className="opacity-70">Manage your skills and information</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Resume Upload & Skill Extraction */}
        <div 
          className="rounded-2xl p-6 space-y-6"
          style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
        >
          <div>
            <h3 className="mb-4">Resume Skill Extraction</h3>
            <p className="text-sm opacity-70 mb-4">
              Paste your resume text below and we'll automatically extract your skills
            </p>

            <Textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="min-h-[200px] rounded-xl mb-4"
            />

            <Button
              onClick={handleExtractSkills}
              className="w-full rounded-xl"
              style={{ background: '#b35c00' }}
            >
              <Upload size={18} className="mr-2" />
              Extract Skills
            </Button>
          </div>

          <div className="pt-6 border-t" style={{ borderColor: 'rgba(179, 92, 0, 0.1)' }}>
            <h4 className="mb-4">Add Skills Manually</h4>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="e.g., React, Python"
                className="rounded-xl"
              />
              <Button
                onClick={handleAddSkill}
                style={{ background: '#b35c00' }}
              >
                <Plus size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div 
          className="rounded-2xl p-6 space-y-6"
          style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
        >
          <div>
            <h3 className="mb-4">Profile Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 opacity-70">Name</label>
                <Input
                  value={user?.name || ''}
                  disabled
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block mb-2 opacity-70">Email</label>
                <Input
                  value={user?.email || ''}
                  disabled
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block mb-2 opacity-70">GitHub Profile</label>
                <Input
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="github.com/username"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block mb-2 opacity-70">GitHub Score (0-100)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={githubScore}
                  onChange={(e) => setGithubScore(parseInt(e.target.value) || 0)}
                  className="rounded-xl"
                />
                <p className="text-sm opacity-70 mt-1">
                  Simulated score based on contributions, repos, etc.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full rounded-xl"
            style={{ background: '#22c55e' }}
          >
            Save Profile
          </Button>
        </div>
      </div>

      {/* Skills Display */}
      <div 
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
      >
        <h3 className="mb-4">Your Skills ({skills.length})</h3>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <div key={skill} className="relative group">
                <SkillTag skill={skill} matched />
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 opacity-70">
            No skills added yet. Extract from resume or add manually.
          </p>
        )}
      </div>
    </div>
  );
}
