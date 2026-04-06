import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MatchScoreBadge } from '../../components/MatchScoreBadge';
import { SkillTag } from '../../components/SkillTag';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { toast } from 'sonner';

export function CompanyApplications() {
  const { user, applications, updateApplicationStatus, jobs, students } = useAuth();
  const [filterJob, setFilterJob] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const myJobs = jobs.filter(j => j.companyId === user?.id);
  const myApplications = applications
    .filter(a => a.companyId === user?.id)
    .map(app => {
      const job = jobs.find(j => j.id === app.jobId);
      const student = students.find(s => s.userId === app.studentId);
      return { ...app, job, student };
    });

  const filteredApplications = useMemo(() => {
    let filtered = myApplications;

    if (filterJob !== 'all') {
      filtered = filtered.filter(a => a.jobId === filterJob);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(a => a.status === filterStatus);
    }

    return filtered.sort((a, b) => b.matchScore - a.matchScore);
  }, [myApplications, filterJob, filterStatus]);

  const handleStatusChange = (appId: string, newStatus: 'shortlisted' | 'rejected' | 'placed') => {
    updateApplicationStatus(appId, newStatus);
    toast.success(`Application ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' };
      case 'shortlisted':
        return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' };
      case 'rejected':
        return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' };
      default:
        return { bg: 'rgba(234, 179, 8, 0.1)', text: '#eab308' };
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Applications</h1>
        <p className="opacity-70">Review and manage student applications</p>
      </div>

      {/* Filters */}
      <div 
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm opacity-70">Filter by Job</label>
            <Select value={filterJob} onValueChange={setFilterJob}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {myJobs.map(job => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2 text-sm opacity-70">Filter by Status</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="placed">Placed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="grid gap-6">
          {filteredApplications.map(app => {
            const statusColor = getStatusColor(app.status);
            const matchedSkills = app.student && app.job
              ? app.student.skills.filter(skill =>
                  app.job!.skillsRequired.some(req => req.toLowerCase() === skill.toLowerCase())
                )
              : [];

            return (
              <div
                key={app.id}
                className="rounded-2xl p-6 transition-all hover:shadow-xl"
                style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3>{app.studentName}</h3>
                    <p className="opacity-70">{app.job?.title}</p>
                    <p className="text-sm opacity-50 mt-1">
                      Applied: {app.appliedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <MatchScoreBadge score={app.matchScore} showProgress />
                    <div className="mt-2">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium capitalize"
                        style={{ background: statusColor.bg, color: statusColor.text }}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>

                {app.student && (
                  <div className="mb-4">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm opacity-70 mb-1">GitHub</p>
                        <p className="font-medium">{app.student.github || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-70 mb-1">GitHub Score</p>
                        <p className="font-medium">{app.student.githubScore}/100</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-70 mb-1">Risk Level</p>
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium uppercase"
                          style={{
                            background: app.student.riskLevel === 'low' ? '#22c55e20' :
                              app.student.riskLevel === 'medium' ? '#eab30820' : '#ef444420',
                            color: app.student.riskLevel === 'low' ? '#22c55e' :
                              app.student.riskLevel === 'medium' ? '#eab308' : '#ef4444',
                          }}
                        >
                          {app.student.riskLevel}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm opacity-70 mb-1">Skills Matched</p>
                        <p className="font-medium">
                          {matchedSkills.length}/{app.job?.skillsRequired.length || 0}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Student Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {app.student.skills.map(skill => (
                          <SkillTag
                            key={skill}
                            skill={skill}
                            matched={matchedSkills.includes(skill)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t" style={{ borderColor: 'rgba(179, 92, 0, 0.1)' }}>
                  {app.status !== 'shortlisted' && (
                    <Button
                      onClick={() => handleStatusChange(app.id, 'shortlisted')}
                      className="rounded-xl"
                      style={{ background: '#3b82f6' }}
                    >
                      Shortlist
                    </Button>
                  )}
                  {app.status !== 'placed' && (
                    <Button
                      onClick={() => handleStatusChange(app.id, 'placed')}
                      className="rounded-xl"
                      style={{ background: '#22c55e' }}
                    >
                      Mark as Placed
                    </Button>
                  )}
                  {app.status !== 'rejected' && (
                    <Button
                      onClick={() => handleStatusChange(app.id, 'rejected')}
                      variant="outline"
                      className="rounded-xl border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div 
          className="rounded-2xl p-12 text-center"
          style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)' }}
        >
          <p className="opacity-70">No applications found</p>
        </div>
      )}
    </div>
  );
}
