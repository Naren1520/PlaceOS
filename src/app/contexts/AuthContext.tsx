import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'coordinator' | 'student' | 'company' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface Student {
  userId: string;
  resumeUrl: string;
  skills: string[];
  github: string;
  githubScore: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface Job {
  id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  deadline: Date;
  companyId: string;
  companyName: string;
}

interface Application {
  id: string;
  studentId: string;
  studentName: string;
  jobId: string;
  companyId: string;
  matchScore: number;
  status: 'applied' | 'shortlisted' | 'rejected' | 'placed';
  appliedAt: Date;
}

interface GlobalState {
  isFrozen: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  setUserRole: (role: Role) => void;
  
  // Data management
  users: User[];
  students: Student[];
  jobs: Job[];
  applications: Application[];
  globalState: GlobalState;
  
  // Actions
  addUser: (user: Omit<User, 'id'>, password?: string) => Promise<void>;
  updateStudent: (userId: string, data: Partial<Student>) => void;
  getStudent: (userId: string) => Student | undefined;
  addJob: (job: Omit<Job, 'id'>) => void;
  applyToJob: (studentId: string, jobId: string) => boolean;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
  toggleFreeze: () => void;
  calculateMatchScore: (studentSkills: string[], requiredSkills: string[]) => number;
  getMissingSkills: (studentSkills: string[], requiredSkills: string[]) => string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data
const initialUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@placeos.com', role: 'coordinator' },
  { id: '2', name: 'John Doe', email: 'john@student.com', role: 'student' },
  { id: '3', name: 'Jane Smith', email: 'jane@student.com', role: 'student' },
  { id: '4', name: 'Bob Wilson', email: 'bob@student.com', role: 'student' },
  { id: '5', name: 'Tech Corp', email: 'hr@techcorp.com', role: 'company' },
  { id: '6', name: 'Innovation Labs', email: 'hr@innovlabs.com', role: 'company' },
];

const initialStudents: Student[] = [
  {
    userId: '2',
    resumeUrl: 'resume-john.pdf',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS'],
    github: 'github.com/johndoe',
    githubScore: 85,
    riskLevel: 'low',
  },
  {
    userId: '3',
    resumeUrl: 'resume-jane.pdf',
    skills: ['Python', 'Django', 'PostgreSQL'],
    github: 'github.com/janesmith',
    githubScore: 60,
    riskLevel: 'medium',
  },
  {
    userId: '4',
    resumeUrl: 'resume-bob.pdf',
    skills: ['Java', 'Spring'],
    github: 'github.com/bobwilson',
    githubScore: 45,
    riskLevel: 'high',
  },
];

const initialJobs: Job[] = [
  {
    id: 'j1',
    title: 'Full Stack Developer',
    description: 'We are looking for a full stack developer with expertise in React and Node.js',
    skillsRequired: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    deadline: new Date('2026-05-01'),
    companyId: '5',
    companyName: 'Tech Corp',
  },
  {
    id: 'j2',
    title: 'Backend Engineer',
    description: 'Python developer needed for backend systems',
    skillsRequired: ['Python', 'Django', 'PostgreSQL', 'Docker'],
    deadline: new Date('2026-04-20'),
    companyId: '5',
    companyName: 'Tech Corp',
  },
  {
    id: 'j3',
    title: 'Frontend Developer',
    description: 'React specialist for modern web applications',
    skillsRequired: ['React', 'TypeScript', 'CSS', 'Webpack'],
    deadline: new Date('2026-05-15'),
    companyId: '6',
    companyName: 'Innovation Labs',
  },
];

const initialApplications: Application[] = [
  {
    id: 'a1',
    studentId: '2',
    studentName: 'John Doe',
    jobId: 'j1',
    companyId: '5',
    matchScore: 100,
    status: 'shortlisted',
    appliedAt: new Date('2026-03-15'),
  },
  {
    id: 'a2',
    studentId: '3',
    studentName: 'Jane Smith',
    jobId: 'j2',
    companyId: '5',
    matchScore: 75,
    status: 'applied',
    appliedAt: new Date('2026-03-18'),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [globalState, setGlobalState] = useState<GlobalState>({ isFrozen: false });

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('placeos-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'admin123' })
      });
      const data = await response.json();
      if (response.ok) {
        const loggedInUser: User = {
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role
        };
        setUser(loggedInUser);
        localStorage.setItem('placeos-user', JSON.stringify(loggedInUser));
        localStorage.setItem('placeos-token', data.token);
      } else {
        console.error('Login failed:', data.message);
        // Fallback onto mock data just in case during testing
        const foundUser = users.find(u => u.email === email);
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('placeos-user', JSON.stringify(foundUser));
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const foundUser = users.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('placeos-user', JSON.stringify(foundUser));
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('placeos-user');
    localStorage.removeItem('placeos-token');
  };

  const setUserRole = (role: Role) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('placeos-user', JSON.stringify(updatedUser));
      
      // Update in users array
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  const addUser = async (userData: Omit<User, 'id'>, password?: string) => {
    try {
      const token = localStorage.getItem('placeos-token');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: userData.name, 
          email: userData.email, 
          password: password || 'default123', 
          role: userData.role 
        })
      });
      const data = await response.json();
      
      if (response.ok) {
        const newUser: User = {
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role
        };
        setUsers([...users, newUser]);
      } else {
        console.error('Failed to add user to backend:', data.message);
        // Fallback for UI if backend errors during development
        const fallbackUser: User = {
          ...userData,
          id: `u${Date.now()}`,
        };
        setUsers([...users, fallbackUser]);
      }
    } catch (error) {
      console.error('Add user error:', error);
      const newUser: User = {
        ...userData,
        id: `u${Date.now()}`,
      };
      setUsers([...users, newUser]);
    }
  };

  const updateStudent = (userId: string, data: Partial<Student>) => {
    setStudents(students.map(s => 
      s.userId === userId ? { ...s, ...data } : s
    ));
    
    // If student doesn't exist, create one
    if (!students.find(s => s.userId === userId)) {
      const newStudent: Student = {
        userId,
        resumeUrl: '',
        skills: [],
        github: '',
        githubScore: 0,
        riskLevel: 'high',
        ...data,
      };
      setStudents([...students, newStudent]);
    }
  };

  const getStudent = (userId: string) => {
    return students.find(s => s.userId === userId);
  };

  const addJob = (jobData: Omit<Job, 'id'>) => {
    const newJob: Job = {
      ...jobData,
      id: `j${Date.now()}`,
    };
    setJobs([...jobs, newJob]);
  };

  const calculateMatchScore = (studentSkills: string[], requiredSkills: string[]): number => {
    if (requiredSkills.length === 0) return 0;
    
    const normalizedStudentSkills = studentSkills.map(s => s.toLowerCase());
    const normalizedRequiredSkills = requiredSkills.map(s => s.toLowerCase());
    
    const matchedSkills = normalizedRequiredSkills.filter(skill =>
      normalizedStudentSkills.includes(skill)
    );
    
    return Math.round((matchedSkills.length / normalizedRequiredSkills.length) * 100);
  };

  const getMissingSkills = (studentSkills: string[], requiredSkills: string[]): string[] => {
    const normalizedStudentSkills = studentSkills.map(s => s.toLowerCase());
    const normalizedRequiredSkills = requiredSkills.map(s => s.toLowerCase());
    
    return requiredSkills.filter(skill =>
      !normalizedStudentSkills.includes(skill.toLowerCase())
    );
  };

  const applyToJob = (studentId: string, jobId: string): boolean => {
    const job = jobs.find(j => j.id === jobId);
    const student = students.find(s => s.userId === studentId);
    const studentUser = users.find(u => u.id === studentId);
    
    if (!job || !student || !studentUser) return false;
    
    // Check if frozen
    if (globalState.isFrozen) return false;
    
    // Check deadline
    if (new Date() > job.deadline) return false;
    
    // Check if already applied
    const alreadyApplied = applications.find(
      a => a.studentId === studentId && a.jobId === jobId
    );
    if (alreadyApplied) return false;
    
    // Calculate match score
    const matchScore = calculateMatchScore(student.skills, job.skillsRequired);
    
    const newApplication: Application = {
      id: `a${Date.now()}`,
      studentId,
      studentName: studentUser.name,
      jobId,
      companyId: job.companyId,
      matchScore,
      status: 'applied',
      appliedAt: new Date(),
    };
    
    setApplications([...applications, newApplication]);
    return true;
  };

  const updateApplicationStatus = (id: string, status: Application['status']) => {
    setApplications(applications.map(a =>
      a.id === id ? { ...a, status } : a
    ));
  };

  const toggleFreeze = () => {
    setGlobalState({ isFrozen: !globalState.isFrozen });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        setUserRole,
        users,
        students,
        jobs,
        applications,
        globalState,
        addUser,
        updateStudent,
        getStudent,
        addJob,
        applyToJob,
        updateApplicationStatus,
        toggleFreeze,
        calculateMatchScore,
        getMissingSkills,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
