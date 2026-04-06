import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function CoordinatorAnalytics() {
  const { students, applications, jobs } = useAuth();

  const skillGapAnalysis = useMemo(() => {
    const allRequiredSkills = new Set<string>();
    jobs.forEach(job => {
      job.skillsRequired.forEach(skill => allRequiredSkills.add(skill));
    });

    const allStudentSkills = new Set<string>();
    students.forEach(student => {
      student.skills.forEach(skill => allStudentSkills.add(skill.toLowerCase()));
    });

    const gaps: { skill: string; gap: number }[] = [];
    allRequiredSkills.forEach(skill => {
      if (!allStudentSkills.has(skill.toLowerCase())) {
        const demandCount = jobs.filter(j =>
          j.skillsRequired.some(s => s.toLowerCase() === skill.toLowerCase())
        ).length;
        gaps.push({ skill, gap: demandCount });
      }
    });

    return gaps.sort((a, b) => b.gap - a.gap).slice(0, 8);
  }, [jobs, students]);

  const applicationStatusData = useMemo(() => {
    const statusCounts = {
      applied: applications.filter(a => a.status === 'applied').length,
      shortlisted: applications.filter(a => a.status === 'shortlisted').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      placed: applications.filter(a => a.status === 'placed').length,
    };

    return [
      { name: 'Applied', value: statusCounts.applied, color: '#eab308' },
      { name: 'Shortlisted', value: statusCounts.shortlisted, color: '#3b82f6' },
      { name: 'Rejected', value: statusCounts.rejected, color: '#ef4444' },
      { name: 'Placed', value: statusCounts.placed, color: '#22c55e' },
    ];
  }, [applications]);

  const matchScoreDistribution = useMemo(() => {
    const ranges = [
      { range: '0-20', count: 0 },
      { range: '21-40', count: 0 },
      { range: '41-60', count: 0 },
      { range: '61-80', count: 0 },
      { range: '81-100', count: 0 },
    ];

    applications.forEach(app => {
      if (app.matchScore <= 20) ranges[0].count++;
      else if (app.matchScore <= 40) ranges[1].count++;
      else if (app.matchScore <= 60) ranges[2].count++;
      else if (app.matchScore <= 80) ranges[3].count++;
      else ranges[4].count++;
    });

    return ranges;
  }, [applications]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Analytics & Insights</h1>
        <p className="opacity-70">Deep dive into placement data</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill Gap Analysis */}
        <div 
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
        >
          <h3 className="mb-4">Skill Gap Analysis</h3>
          <p className="text-sm opacity-70 mb-4">
            Skills demanded by companies but missing in student pool
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillGapAnalysis}>
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
              <Bar dataKey="gap" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Application Status Distribution */}
        <div 
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
        >
          <h3 className="mb-4">Application Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={applicationStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {applicationStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Match Score Distribution */}
        <div 
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
        >
          <h3 className="mb-4">Match Score Distribution</h3>
          <p className="text-sm opacity-70 mb-4">
            Distribution of match scores across all applications
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={matchScoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#b35c00" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Metrics */}
        <div 
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
        >
          <h3 className="mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ background: 'rgba(179, 92, 0, 0.05)' }}>
              <p className="text-sm opacity-70 mb-1">Average Match Score</p>
              <p className="text-3xl font-bold" style={{ color: '#b35c00' }}>
                {applications.length > 0
                  ? Math.round(applications.reduce((sum, app) => sum + app.matchScore, 0) / applications.length)
                  : 0}%
              </p>
            </div>

            <div className="p-4 rounded-xl" style={{ background: 'rgba(34, 197, 94, 0.05)' }}>
              <p className="text-sm opacity-70 mb-1">Placement Success Rate</p>
              <p className="text-3xl font-bold" style={{ color: '#22c55e' }}>
                {applications.length > 0
                  ? Math.round((applications.filter(a => a.status === 'placed').length / applications.length) * 100)
                  : 0}%
              </p>
            </div>

            <div className="p-4 rounded-xl" style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
              <p className="text-sm opacity-70 mb-1">Avg Applications per Student</p>
              <p className="text-3xl font-bold" style={{ color: '#3b82f6' }}>
                {students.length > 0
                  ? (applications.length / students.length).toFixed(1)
                  : 0}
              </p>
            </div>

            <div className="p-4 rounded-xl" style={{ background: 'rgba(139, 92, 246, 0.05)' }}>
              <p className="text-sm opacity-70 mb-1">Avg Skills per Student</p>
              <p className="text-3xl font-bold" style={{ color: '#8b5cf6' }}>
                {students.length > 0
                  ? (students.reduce((sum, s) => sum + s.skills.length, 0) / students.length).toFixed(1)
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div 
        className="rounded-2xl p-6"
        style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
      >
        <h3 className="mb-4">📊 Data-Driven Recommendations</h3>
        <div className="space-y-2 text-sm">
          {skillGapAnalysis.length > 0 && (
            <p>
              • Organize training sessions for: <strong>{skillGapAnalysis.slice(0, 3).map(s => s.skill).join(', ')}</strong>
            </p>
          )}
          <p>
            • {students.filter(s => s.riskLevel === 'high').length} students need personalized career guidance
          </p>
          {applications.filter(a => a.matchScore < 40).length > 0 && (
            <p>
              • {applications.filter(a => a.matchScore < 40).length} applications have low match scores - students may need skill development
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
