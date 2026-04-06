import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SkillTag } from '../../components/SkillTag';
import { Calendar, Users } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';

export function CompanyJobs() {
  const { user, jobs, applications } = useAuth();

  const myJobs = jobs
    .filter(j => j.companyId === user?.id)
    .map(job => {
      const jobApps = applications.filter(a => a.jobId === job.id);
      return { ...job, applicationsCount: jobApps.length };
    })
    .sort((a, b) => b.deadline.getTime() - a.deadline.getTime());

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>My Job Postings</h1>
          <p className="opacity-70">Manage your job listings</p>
        </div>
        <Link to="/company/post-job">
          <Button className="rounded-xl" style={{ background: '#b35c00' }}>
            Post New Job
          </Button>
        </Link>
      </div>

      {myJobs.length > 0 ? (
        <div className="grid gap-6">
          {myJobs.map(job => {
            const isExpired = new Date() > job.deadline;
            return (
              <div
                key={job.id}
                className="rounded-2xl p-6 transition-all hover:scale-[1.02] hover:shadow-xl"
                style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3>{job.title}</h3>
                      {isExpired && (
                        <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-600">
                          Expired
                        </span>
                      )}
                    </div>
                    <p className="opacity-70 mt-1">{job.companyName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-70 mb-1">Applications Received</p>
                    <p className="text-3xl font-bold" style={{ color: '#b35c00' }}>
                      {job.applicationsCount}
                    </p>
                  </div>
                </div>

                <p className="opacity-70 mb-4">{job.description}</p>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.map(skill => (
                      <SkillTag key={skill} skill={skill} />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'rgba(179, 92, 0, 0.1)' }}>
                  <div className="flex items-center gap-4 text-sm opacity-70">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>Deadline: {job.deadline.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>{job.applicationsCount} applicants</span>
                    </div>
                  </div>

                  <Link to="/company/applications" state={{ jobId: job.id }}>
                    <Button variant="outline" className="rounded-xl">
                      View Applications
                    </Button>
                  </Link>
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
          <p className="opacity-70 mb-4">You haven't posted any jobs yet</p>
          <Link to="/company/post-job">
            <Button style={{ background: '#b35c00' }}>Post Your First Job</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
