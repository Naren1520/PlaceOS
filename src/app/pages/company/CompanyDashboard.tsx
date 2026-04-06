import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { StatsCard } from '../../components/StatsCard';
import { Briefcase, Users, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';

export function CompanyDashboard() {
  const { user, jobs, applications } = useAuth();

  const myJobs = jobs.filter(j => j.companyId === user?.id);
  const myApplications = applications.filter(a => a.companyId === user?.id);

  const stats = useMemo(() => {
    const totalJobs = myJobs.length;
    const totalApplications = myApplications.length;
    const shortlisted = myApplications.filter(a => a.status === 'shortlisted').length;
    const placed = myApplications.filter(a => a.status === 'placed').length;

    return { totalJobs, totalApplications, shortlisted, placed };
  }, [myJobs, myApplications]);

  const recentApplications = useMemo(() => {
    return myApplications
      .sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime())
      .slice(0, 5)
      .map(app => {
        const job = myJobs.find(j => j.id === app.jobId);
        return { ...app, job };
      });
  }, [myApplications, myJobs]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Company Dashboard</h1>
        <p className="opacity-70">Manage your job postings and applications</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatsCard
          title="Active Jobs"
          value={stats.totalJobs}
          icon={Briefcase}
          color="#b35c00"
        />
        <StatsCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={Users}
          color="#3b82f6"
        />
        <StatsCard
          title="Shortlisted"
          value={stats.shortlisted}
          icon={Clock}
          color="#eab308"
        />
        <StatsCard
          title="Placed"
          value={stats.placed}
          icon={CheckCircle}
          color="#22c55e"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div 
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
        >
          <h3 className="mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/company/post-job">
              <Button className="w-full rounded-xl justify-start" style={{ background: '#b35c00' }}>
                <Briefcase size={18} className="mr-2" />
                Post New Job
              </Button>
            </Link>
            <Link to="/company/applications">
              <Button variant="outline" className="w-full rounded-xl justify-start">
                <Users size={18} className="mr-2" />
                View All Applications
              </Button>
            </Link>
            <Link to="/company/jobs">
              <Button variant="outline" className="w-full rounded-xl justify-start">
                <Briefcase size={18} className="mr-2" />
                Manage Jobs
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Applications */}
        <div 
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
        >
          <h3 className="mb-4">Recent Applications</h3>
          {recentApplications.length > 0 ? (
            <div className="space-y-3">
              {recentApplications.map(app => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl border transition-all hover:scale-105"
                  style={{ borderColor: 'rgba(179, 92, 0, 0.2)' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{app.studentName}</p>
                    <span
                      className="px-2 py-1 rounded-full text-xs"
                      style={{ background: '#b35c00', color: '#fff' }}
                    >
                      {app.matchScore}%
                    </span>
                  </div>
                  <p className="text-sm opacity-70">{app.job?.title}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {app.appliedAt.toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="opacity-70">No applications yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Active Jobs */}
      <div 
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3>Active Job Postings</h3>
          <Link to="/company/jobs">
            <Button variant="ghost" style={{ color: '#b35c00' }}>View All</Button>
          </Link>
        </div>

        {myJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {myJobs.slice(0, 4).map(job => {
              const jobApps = myApplications.filter(a => a.jobId === job.id);
              return (
                <div
                  key={job.id}
                  className="p-4 rounded-xl border transition-all hover:scale-105"
                  style={{ borderColor: 'rgba(179, 92, 0, 0.2)' }}
                >
                  <h4>{job.title}</h4>
                  <p className="text-sm opacity-70 mb-3 line-clamp-2">{job.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">{jobApps.length} applications</span>
                    <span className="opacity-70">Deadline: {job.deadline.toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="opacity-70 mb-4">You haven't posted any jobs yet</p>
            <Link to="/company/post-job">
              <Button style={{ background: '#b35c00' }}>Post Your First Job</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
