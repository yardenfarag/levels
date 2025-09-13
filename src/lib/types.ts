export type UserRole = 'trainee' | 'instructor' | 'admin';

export type TaskStatus = 'לא בוצע' | 'נצפה' | 'בוצע';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  targetWindow: string;
  note?: string;
}

export interface Assignment {
  id: string;
  taskId: string;
  traineeId: string;
  status: TaskStatus;
  notes?: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Filters {
  search: string;
  category: string | 'all';
  targetWindow: string | 'all';
  showOnlyCompleted: boolean;
}

export interface StoreState {
  // Data
  tasks: Task[];
  assignments: Assignment[];
  users: User[];
  currentUser: User | null;
  
  // UI State
  filters: Filters;
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  updateAssignment: (assignmentId: string, updates: Partial<Assignment>) => void;
  setFilters: (filters: Partial<Filters>) => void;
  loadData: () => void;
}
