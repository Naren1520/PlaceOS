import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Building2, Briefcase, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

export function CoordinatorCompanies() {
  const { users, jobs, applications } = useAuth();

  const companyData = users
    .filter(u => u.role === 'company')
    .map(company => {
      const companyJobs = jobs.filter(j => j.companyId === company.id);
      const companyApps = applications.filter(a => a.companyId === company.id);
      const hired = companyApps.filter(a => a.status === 'placed').length;

      return {
        ...company,
        jobsPosted: companyJobs.length,
        applicationsReceived: companyApps.length,
        hired,
      };
    });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Company Management</h1>
        <p className="opacity-70">View and manage company accounts</p>
      </div>

      <div 
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
      >
        {companyData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Jobs Posted</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Hired</TableHead>
                <TableHead>Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companyData.map(company => {
                const activityLevel = company.jobsPosted >= 3 ? 'high' : company.jobsPosted >= 1 ? 'medium' : 'low';
                const activityColor = activityLevel === 'high' ? '#22c55e' :
                  activityLevel === 'medium' ? '#eab308' : '#ef4444';

                return (
                  <TableRow key={company.id} className="hover:bg-[#b35c00]/5">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: '#b35c00' }}
                        >
                          <Building2 className="text-white" size={20} />
                        </div>
                        <span className="font-medium">{company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{company.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} className="opacity-50" />
                        <span className="font-medium">{company.jobsPosted}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="opacity-50" />
                        <span className="font-medium">{company.applicationsReceived}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ background: '#22c55e20', color: '#22c55e' }}
                      >
                        {company.hired}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium capitalize"
                        style={{ background: `${activityColor}20`, color: activityColor }}
                      >
                        {activityLevel}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="opacity-70">No companies registered yet</p>
          </div>
        )}
      </div>

      {/* Company Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div 
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
        >
          <p className="text-sm opacity-70 mb-2">Total Companies</p>
          <p className="text-3xl font-bold" style={{ color: '#b35c00' }}>{companyData.length}</p>
        </div>

        <div 
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
        >
          <p className="text-sm opacity-70 mb-2">Total Jobs Posted</p>
          <p className="text-3xl font-bold" style={{ color: '#3b82f6' }}>
            {companyData.reduce((sum, c) => sum + c.jobsPosted, 0)}
          </p>
        </div>

        <div 
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
        >
          <p className="text-sm opacity-70 mb-2">Total Hires</p>
          <p className="text-3xl font-bold" style={{ color: '#22c55e' }}>
            {companyData.reduce((sum, c) => sum + c.hired, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
