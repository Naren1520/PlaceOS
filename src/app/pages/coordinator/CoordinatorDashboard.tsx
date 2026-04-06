import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { StatsCard } from '../../components/StatsCard';
import { Users, Briefcase, CheckCircle, AlertTriangle, Building2, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function CoordinatorDashboard() {
  const { users, students, jobs, applications } = useAuth();

  const stats = useMemo(() => {
    const totalStudents = users.filter(u => u.role === 'student').length;
    const totalCompanies = users.filter(u => u.role === 'company').length;
    const totalJobs = jobs.length;
    const placedStudents = new Set(
      applications.filter(a => a.status === 'placed').map(a => a.studentId)
    ).size;
    const highRiskStudents = students.filter(s => s.riskLevel === 'high').length;
    const placementRate = totalStudents > 0
      ? Math.round((placedStudents / totalStudents) * 100)
      : 0;

    return {
      totalStudents,
      totalCompanies,
      totalJobs,
      placedStudents,
      highRiskStudents,
      placementRate,
    };
  }, [users, students, jobs, applications]);

  const skillDemand = useMemo(() => {
    const skillCount: Record<string, number> = {};
    
    jobs.forEach(job => {
      job.skillsRequired.forEach(skill => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });

    return Object.entries(skillCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([skill, count]) => ({ skill, count }));
  }, [jobs]);

  const riskDistribution = useMemo(() => {
    const low = students.filter(s => s.riskLevel === 'low').length;
    const medium = students.filter(s => s.riskLevel === 'medium').length;
    const high = students.filter(s => s.riskLevel === 'high').length;

    return [
      { level: 'Low Risk', count: low },
      { level: 'Medium Risk', count: medium },
      { level: 'High Risk', count: high },
    ];
  }, [students]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Coordinator Dashboard</h1>
        <p className="opacity-70">Platform overview and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          color="#b35c00"
        />
        <StatsCard
          title="Companies"
          value={stats.totalCompanies}
          icon={Building2}
          color="#3b82f6"
        />
        <StatsCard
          title="Active Jobs"
          value={stats.totalJobs}
          icon={Briefcase}
          color="#8b5cf6"
        />
        <StatsCard
          title="Placed Students"
          value={stats.placedStudents}
          icon={CheckCircle}
          color="#22c55e"
        />
        <StatsCard
          title="High Risk"
          value={stats.highRiskStudents}
          icon={AlertTriangle}
          color="#ef4444"
        />
        <StatsCard
          title="Placement Rate"
          value={`${stats.placementRate}%`}
          icon={TrendingUp}
          color="#10b981"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Demanded Skills */}
        <div 
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
        >
          <h3 className="mb-4">Top Demanded Skills</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillDemand}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="skill"
                angle={-45}
                textAnchor="end"
                height={100}
                style={{ fontSize: '12px' }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#b35c00" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div 
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
        >
          <h3 className="mb-4">Student Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskDistribution}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div 
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
      >
        <h3 className="mb-4">Recent Applications</h3>
        <div className="space-y-3">
          {applications
            .sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime())
            .slice(0, 5)
            .map(app => {
              const job = jobs.find(j => j.id === app.jobId);
              return (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-105"
                  style={{ background: 'rgba(179, 92, 0, 0.05)' }}
                >
                  <div>
                    <p className="font-medium">{app.studentName}</p>
                    <p className="text-sm opacity-70">{job?.title}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ background: '#b35c00', color: '#fff' }}
                    >
                      {app.matchScore}%
                    </p>
                    <p className="text-xs opacity-50 mt-1">
                      {app.appliedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
