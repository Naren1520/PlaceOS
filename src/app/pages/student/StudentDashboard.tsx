import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { StatsCard } from '../../components/StatsCard';
import { MatchScoreBadge } from '../../components/MatchScoreBadge';
import { Briefcase, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';

export function StudentDashboard() {
  const { user, students, applications, jobs, calculateMatchScore } = useAuth();

  const student = students.find(s => s.userId === user?.id);
  const myApplications = applications.filter(a => a.studentId === user?.id);

  const stats = useMemo(() => {
    const placed = myApplications.filter(a => a.status === 'placed').length;
    const shortlisted = myApplications.filter(a => a.status === 'shortlisted').length;
    const pending = myApplications.filter(a => a.status === 'applied').length;

    return { placed, shortlisted, pending, total: myApplications.length };
  }, [myApplications]);

  const topJobs = useMemo(() => {
    if (!student) return [];
    
    return jobs
      .slice(0, 3)
      .map(job => ({
        ...job,
        matchScore: calculateMatchScore(student.skills, job.skillsRequired),
      }))
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [jobs, student, calculateMatchScore]);

  const suggestions = useMemo(() => {
    if (!student || jobs.length === 0) return [];
    
    const allRequiredSkills = new Set<string>();
    jobs.forEach(job => {
      job.skillsRequired.forEach(skill => allRequiredSkills.add(skill));
    });

    const studentSkillsLower = student.skills.map(s => s.toLowerCase());
    const missingSkills = Array.from(allRequiredSkills).filter(
      skill => !studentSkillsLower.includes(skill.toLowerCase())
    );

    return missingSkills.slice(0, 5);
  }, [student, jobs]);

  const getRiskColor = (level: string) => {
    if (level === 'low') return '#22c55e';
    if (level === 'medium') return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Welcome back, {user?.name}! 👋</h1>
        <p className="opacity-70">Track your applications and discover new opportunities</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Applications"
          value={stats.total}
          icon={Briefcase}
          color="#b35c00"
        />
        <StatsCard
          title="Placed"
          value={stats.placed}
          icon={CheckCircle}
          color="#22c55e"
        />
        <StatsCard
          title="Shortlisted"
          value={stats.shortlisted}
          icon={Clock}
          color="#3b82f6"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="#eab308"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div 
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
        >
          <h3 className="mb-4">Profile Overview</h3>
          {student ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm opacity-70 mb-1">Risk Level</p>
                <div className="flex items-center gap-2">
                  <div
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ background: `${getRiskColor(student.riskLevel)}20`, color: getRiskColor(student.riskLevel) }}
                  >
                    {student.riskLevel.toUpperCase()}
                  </div>
                  <AlertTriangle size={18} style={{ color: getRiskColor(student.riskLevel) }} />
                </div>
              </div>

              <div>
                <p className="text-sm opacity-70 mb-1">GitHub Score</p>
                <p className="text-2xl font-bold" style={{ color: '#b35c00' }}>{student.githubScore}/100</p>
              </div>

              <div>
                <p className="text-sm opacity-70 mb-1">Skills Count</p>
                <p className="text-2xl font-bold" style={{ color: '#b35c00' }}>{student.skills.length}</p>
              </div>

              <Link to="/student/profile">
                <Button className="w-full rounded-xl" style={{ background: '#b35c00' }}>
                  View Full Profile
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="opacity-70 mb-4">Complete your profile to get started</p>
              <Link to="/student/profile">
                <Button style={{ background: '#b35c00' }}>Complete Profile</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Top Matching Jobs */}
        <div 
          className="md:col-span-2 rounded-2xl p-6"
          style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3>Top Matching Jobs</h3>
            <Link to="/student/jobs">
              <Button variant="ghost" style={{ color: '#b35c00' }}>View All</Button>
            </Link>
          </div>

          <div className="space-y-4">
            {topJobs.map(job => (
              <div 
                key={job.id}
                className="p-4 rounded-xl border transition-all hover:scale-105 hover:shadow-lg"
                style={{ borderColor: 'rgba(179, 92, 0, 0.2)' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4>{job.title}</h4>
                    <p className="text-sm opacity-70">{job.companyName}</p>
                  </div>
                  <MatchScoreBadge score={job.matchScore} />
                </div>
                <p className="text-sm opacity-70 mb-3 line-clamp-2">{job.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm opacity-70">Deadline: {job.deadline.toLocaleDateString()}</p>
                  <Link to={`/student/jobs`}>
                    <Button size="sm" style={{ background: '#b35c00' }}>Apply Now</Button>
                  </Link>
                </div>
              </div>
            ))}

            {topJobs.length === 0 && (
              <div className="text-center py-8">
                <p className="opacity-70">No jobs available at the moment</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Improvement Suggestions */}
      {suggestions.length > 0 && (
        <div 
          className="rounded-2xl p-6"
          style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
        >
          <h3 className="mb-4">💡 Skill Recommendations</h3>
          <p className="opacity-70 mb-4">
            Learning these skills can improve your job match scores:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(skill => (
              <span
                key={skill}
                className="px-4 py-2 rounded-xl font-medium"
                style={{ background: '#3b82f6', color: '#fff' }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
