import { create } from 'zustand';
import { StoreState, User, Task, Assignment, Filters } from './types';
import { storage } from './storage';
import users from '../../data/users.json';
import tasks from '../../data/tasks.json';

// Load data from JSON files
const loadUsers = async (): Promise<User[]> => {
  return users as User[];
};

const loadTasks = async (): Promise<Task[]> => {
  return tasks as Task[];
};

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  tasks: [],
  assignments: [],
  users: [],
  currentUser: null,
  filters: {
    search: '',
    category: 'all',
    targetWindow: 'all',
    showOnlyCompleted: false,
  },

  // Actions
  setCurrentUser: (user: User | null) => {
    set({ currentUser: user });
  },

  updateAssignment: (assignmentId: string, updates: Partial<Assignment>) => {
    const { assignments, currentUser } = get();
    const updatedAssignments = assignments.map(assignment => 
      assignment.id === assignmentId 
        ? { 
            ...assignment, 
            ...updates, 
            updatedAt: new Date().toISOString(),
            updatedBy: currentUser?.id || 'unknown'
          }
        : assignment
    );
    
    set({ assignments: updatedAssignments });
    storage.setAssignments(updatedAssignments);
  },

  setFilters: (newFilters: Partial<Filters>) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  loadData: async () => {
    const [users, tasks] = await Promise.all([
      loadUsers(),
      loadTasks()
    ]);

    // Load assignments from localStorage
    const assignments = storage.getAssignments();
    
    // Don't load currentUser from localStorage - it should be set by user selection
    set({ users, tasks, assignments });
  },
}));
