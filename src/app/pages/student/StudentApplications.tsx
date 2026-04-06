import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MatchScoreBadge } from '../../components/MatchScoreBadge';
import { CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

export function StudentApplications() {
  const { user, applications, jobs } = useAuth();

  const myApplications = applications
    .filter(a => a.studentId === user?.id)
    .map(app => {
      const job = jobs.find(j => j.id === app.jobId);
      return { ...app, job };
    })
    .sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'shortlisted':
        return <Clock size={20} className="text-blue-600" />;
      case 'rejected':
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <Clock size={20} className="text-yellow-600" />;
    }
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
        <h1>My Applications</h1>
        <p className="opacity-70">Track the status of your job applications</p>
      </div>

      <div 
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
      >
        {myApplications.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Match Score</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myApplications.map(app => {
                const statusColor = getStatusColor(app.status);
                return (
                  <TableRow key={app.id} className="hover:bg-[#b35c00]/5">
                    <TableCell className="font-medium">
                      {app.job?.title || 'Unknown Job'}
                    </TableCell>
                    <TableCell>{app.job?.companyName || 'Unknown Company'}</TableCell>
                    <TableCell>
                      <MatchScoreBadge score={app.matchScore} />
                    </TableCell>
                    <TableCell>{app.appliedAt.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(app.status)}
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium capitalize"
                          style={{ background: statusColor.bg, color: statusColor.text }}
                        >
                          {app.status}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p className="opacity-70">You haven't applied to any jobs yet</p>
            <p className="text-sm opacity-50 mt-2">Start exploring opportunities and apply to jobs that match your skills</p>
          </div>
        )}
      </div>

      {/* Status Legend */}
      <div 
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
      >
        <h3 className="mb-4">Status Guide</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { status: 'applied', label: 'Applied', desc: 'Application submitted' },
            { status: 'shortlisted', label: 'Shortlisted', desc: 'Under review' },
            { status: 'rejected', label: 'Rejected', desc: 'Not selected' },
            { status: 'placed', label: 'Placed', desc: 'Congratulations!' },
          ].map(item => {
            const color = getStatusColor(item.status);
            return (
              <div
                key={item.status}
                className="p-4 rounded-xl"
                style={{ background: color.bg }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(item.status)}
                  <span className="font-medium" style={{ color: color.text }}>
                    {item.label}
                  </span>
                </div>
                <p className="text-sm opacity-70">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
