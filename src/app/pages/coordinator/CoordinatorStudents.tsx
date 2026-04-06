import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SkillTag } from '../../components/SkillTag';
import { AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

export function CoordinatorStudents() {
  const { users, students, applications } = useAuth();

  const studentData = users
    .filter(u => u.role === 'student')
    .map(user => {
      const student = students.find(s => s.userId === user.id);
      const studentApps = applications.filter(a => a.studentId === user.id);
      const placed = studentApps.some(a => a.status === 'placed');
      const avgMatchScore = studentApps.length > 0
        ? Math.round(studentApps.reduce((sum, app) => sum + app.matchScore, 0) / studentApps.length)
        : 0;

      return {
        ...user,
        student,
        applicationsCount: studentApps.length,
        placed,
        avgMatchScore,
      };
    });

  const getRiskColor = (level: string) => {
    if (level === 'low') return { bg: '#22c55e20', text: '#22c55e' };
    if (level === 'medium') return { bg: '#eab30820', text: '#eab308' };
    return { bg: '#ef444420', text: '#ef4444' };
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Student Management</h1>
        <p className="opacity-70">View and analyze student data</p>
      </div>

      <div 
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Avg Match</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentData.map(student => {
              const riskColor = student.student
                ? getRiskColor(student.student.riskLevel)
                : { bg: '#e5e7eb', text: '#6b7280' };

              return (
                <TableRow key={student.id} className="hover:bg-[#b35c00]/5">
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {student.student ? (
                      <div className="flex flex-wrap gap-1">
                        {student.student.skills.slice(0, 3).map(skill => (
                          <SkillTag key={skill} skill={skill} />
                        ))}
                        {student.student.skills.length > 3 && (
                          <span className="text-xs opacity-70">
                            +{student.student.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm opacity-50">Not set</span>
                    )}
                  </TableCell>
                  <TableCell>{student.applicationsCount}</TableCell>
                  <TableCell>
                    {student.avgMatchScore > 0 ? (
                      <span
                        className="px-2 py-1 rounded-full text-sm"
                        style={{
                          background: '#b35c00',
                          color: '#fff',
                        }}
                      >
                        {student.avgMatchScore}%
                      </span>
                    ) : (
                      <span className="text-sm opacity-50">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {student.student ? (
                      <div className="flex items-center gap-2">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium uppercase"
                          style={{ background: riskColor.bg, color: riskColor.text }}
                        >
                          {student.student.riskLevel}
                        </span>
                        {student.student.riskLevel === 'high' && (
                          <AlertTriangle size={16} className="text-red-500" />
                        )}
                      </div>
                    ) : (
                      <span className="text-sm opacity-50">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {student.placed ? (
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                        Placed
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                        Seeking
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {studentData.length === 0 && (
          <div className="text-center py-8">
            <p className="opacity-70">No students registered yet</p>
          </div>
        )}
      </div>

      {/* Suggestions Section */}
      <div 
        className="rounded-2xl p-6"
        style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
      >
        <h3 className="mb-4">💡 Coordinator Insights</h3>
        <div className="space-y-2 text-sm">
          <p>
            • <strong>{studentData.filter(s => s.student?.riskLevel === 'high').length}</strong> high-risk students need urgent attention
          </p>
          <p>
            • <strong>{studentData.filter(s => !s.student).length}</strong> students haven't completed their profiles
          </p>
          <p>
            • <strong>{studentData.filter(s => s.applicationsCount === 0).length}</strong> students haven't applied to any jobs
          </p>
        </div>
      </div>
    </div>
  );
}
