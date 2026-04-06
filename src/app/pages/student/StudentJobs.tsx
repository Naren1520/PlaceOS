import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MatchScoreBadge } from '../../components/MatchScoreBadge';
import { SkillTag } from '../../components/SkillTag';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Calendar, Building2, Search } from 'lucide-react';
import { toast } from 'sonner';

export function StudentJobs() {
  const { user, students, jobs, applications, applyToJob, calculateMatchScore, globalState } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const student = students.find(s => s.userId === user?.id);

  const jobsWithScores = useMemo(() => {
    if (!student) return [];

    return jobs.map(job => {
      const matchScore = calculateMatchScore(student.skills, job.skillsRequired);
      const hasApplied = applications.some(
        a => a.studentId === user?.id && a.jobId === job.id
      );
      const isExpired = new Date() > job.deadline;

      return {
        ...job,
        matchScore,
        hasApplied,
        isExpired,
      };
    });
  }, [jobs, student, applications, user, calculateMatchScore]);

  const filteredJobs = useMemo(() => {
    return jobsWithScores
      .filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [jobsWithScores, searchTerm]);

  const handleApply = (jobId: string) => {
    if (!student) {
      toast.error('Please complete your profile first');
      return;
    }

    if (globalState.isFrozen) {
      toast.error('Applications are frozen by the coordinator');
      return;
    }

    const job = jobs.find(j => j.id === jobId);
    if (job && new Date() > job.deadline) {
      toast.error('This job posting has expired');
      return;
    }

    const success = applyToJob(user!.id, jobId);
    if (success) {
      toast.success('Application submitted successfully!');
    } else {
      toast.error('Failed to apply. You may have already applied.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Browse Jobs</h1>
        <p className="opacity-70">Discover opportunities that match your skills</p>
      </div>

      {/* Search */}
      <div 
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-40" size={20} />
          <Input
            type="text"
            placeholder="Search by job title, company, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
      </div>

      {/* Jobs List */}
      {!student && (
        <div 
          className="rounded-2xl p-6 text-center"
          style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
        >
          <p className="text-red-600">Please complete your profile to see job matches and apply</p>
        </div>
      )}

      <div className="grid gap-6">
        {filteredJobs.map(job => {
          const matchedSkills = student
            ? student.skills.filter(skill =>
                job.skillsRequired.some(req => req.toLowerCase() === skill.toLowerCase())
              )
            : [];

          return (
            <div
              key={job.id}
              className="rounded-2xl p-6 transition-all hover:scale-[1.02] hover:shadow-xl"
              style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: '#b35c00' }}
                    >
                      <Building2 className="text-white" size={24} />
                    </div>
                    <div>
                      <h3>{job.title}</h3>
                      <p className="opacity-70">{job.companyName}</p>
                    </div>
                  </div>
                </div>
                {student && <MatchScoreBadge score={job.matchScore} showProgress />}
              </div>

              <p className="opacity-70 mb-4">{job.description}</p>

              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map(skill => (
                    <SkillTag
                      key={skill}
                      skill={skill}
                      matched={matchedSkills.some(s => s.toLowerCase() === skill.toLowerCase())}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'rgba(179, 92, 0, 0.1)' }}>
                <div className="flex items-center gap-4 text-sm opacity-70">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Deadline: {job.deadline.toLocaleDateString()}</span>
                  </div>
                  {job.isExpired && (
                    <span className="text-red-600 font-medium">Expired</span>
                  )}
                </div>

                {job.hasApplied ? (
                  <Button disabled className="rounded-xl">
                    Already Applied
                  </Button>
                ) : job.isExpired ? (
                  <Button disabled className="rounded-xl">
                    Expired
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleApply(job.id)}
                    className="rounded-xl"
                    style={{ background: '#b35c00' }}
                    disabled={globalState.isFrozen}
                  >
                    {globalState.isFrozen ? 'Applications Frozen' : 'Apply Now'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {filteredJobs.length === 0 && (
          <div 
            className="rounded-2xl p-12 text-center"
            style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)' }}
          >
            <p className="opacity-70">No jobs found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
