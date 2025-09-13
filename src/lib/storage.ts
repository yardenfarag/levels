import { User, Assignment, Task } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  CURRENT_USER: 'nurse-onboarding-current-user',
  ASSIGNMENTS: 'nurse-onboarding-assignments',
} as const;

export const storage = {
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser: (user: User | null): void => {
    if (typeof window === 'undefined') return;
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (error) {
      console.error('Failed to save current user:', error);
    }
  },

  getAssignments: (): Assignment[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  setAssignments: (assignments: Assignment[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    } catch (error) {
      console.error('Failed to save assignments:', error);
    }
  },

  createAssignmentsForTrainee: (traineeId: string, tasks: Task[]): Assignment[] => {
    return tasks.map(task => ({
      id: uuidv4(),
      taskId: task.id,
      traineeId,
      status: 'לא בוצע' as const,
      notes: task.note || '',
      updatedAt: new Date().toISOString(),
      updatedBy: traineeId,
    }));
  },
};
