import React, { createContext, useContext, useState } from 'react';

interface Exam {
  id: string;
  subject: string;
  date: string;
  time: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
}

interface Subject {
  id: string;
  name: string;
  color: string;
  progress: number;
  totalHours: number;
  studiedHours: number;
}

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  tags: string[];
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  completed: boolean;
}

interface AppContextType {
  exams: Exam[];
  subjects: Subject[];
  notes: Note[];
  goals: Goal[];
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [exams, setExams] = useState<Exam[]>([
    {
      id: '1',
      subject: 'Data Structures & Algorithms',
      date: '2025-09-15',
      time: '10:00 AM',
      type: 'Midterm',
      priority: 'high'
    },
    {
      id: '2',
      subject: 'Machine Learning',
      date: '2025-09-22',
      time: '2:00 PM',
      type: 'Quiz',
      priority: 'medium'
    },
    {
      id: '3',
      subject: 'Database Systems',
      date: '2025-09-28',
      time: '9:00 AM',
      type: 'Final',
      priority: 'high'
    }
  ]);

  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Data Structures & Algorithms',
      color: '#8b7cf8',
      progress: 75,
      totalHours: 40,
      studiedHours: 30
    },
    {
      id: '2',
      name: 'Machine Learning',
      color: '#60a5fa',
      progress: 60,
      totalHours: 35,
      studiedHours: 21
    },
    {
      id: '3',
      name: 'Database Systems',
      color: '#34d399',
      progress: 85,
      totalHours: 30,
      studiedHours: 25.5
    }
  ]);

  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Binary Search Trees',
      content: 'Key properties and operations of BSTs...',
      subject: 'Data Structures & Algorithms',
      createdAt: '2025-09-07T10:00:00Z',
      tags: ['trees', 'algorithms']
    },
    {
      id: '2',
      title: 'Supervised Learning Basics',
      content: 'Introduction to supervised learning algorithms...',
      subject: 'Machine Learning',
      createdAt: '2025-09-06T14:30:00Z',
      tags: ['ml', 'supervised-learning']
    }
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Complete DSA Course',
      description: 'Finish all topics in Data Structures and Algorithms',
      targetDate: '2025-09-30',
      progress: 75,
      completed: false
    },
    {
      id: '2',
      title: 'Study 5 hours daily',
      description: 'Maintain consistent study schedule',
      targetDate: '2025-09-14',
      progress: 80,
      completed: false
    }
  ]);

  const addExam = (exam: Omit<Exam, 'id'>) => {
    const newExam = { ...exam, id: Date.now().toString() };
    setExams(prev => [...prev, newExam]);
  };

  const updateExam = (id: string, exam: Partial<Exam>) => {
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...exam } : e));
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject = { ...subject, id: Date.now().toString() };
    setSubjects(prev => [...prev, newSubject]);
  };

  const updateSubject = (id: string, subject: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...subject } : s));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const addNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote = { 
      ...note, 
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (id: string, note: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...note } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal = { ...goal, id: Date.now().toString() };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, goal: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...goal } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  return (
    <AppContext.Provider value={{
      exams, subjects, notes, goals,
      addExam, updateExam, deleteExam,
      addSubject, updateSubject, deleteSubject,
      addNote, updateNote, deleteNote,
      addGoal, updateGoal, deleteGoal
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}