import Papa from 'papaparse';
import { Task, Assignment, User } from './types';

export const exportToCsv = (tasks: Task[], assignments: Assignment[], users: User[], currentUser: User | null) => {
  // Filter assignments based on current user role
  const filteredAssignments = currentUser?.role === 'trainee' 
    ? assignments.filter(a => a.traineeId === currentUser.id)
    : assignments;

  // Create data for CSV
  const csvData = filteredAssignments.map(assignment => {
    const task = tasks.find(t => t.id === assignment.taskId);
    const trainee = users.find(u => u.id === assignment.traineeId);
    const updatedBy = users.find(u => u.id === assignment.updatedBy);
    
    return {
      'משימה': task?.title || '',
      'קטגוריה': task?.category || '',
      'פרק זמן': task?.targetWindow || '',
      'סטטוס': assignment.status,
      'הערות': assignment.notes || '',
      'מתלמדת': trainee?.name || '',
      'עודכן על ידי': updatedBy?.name || '',
      'תאריך עדכון': new Date(assignment.updatedAt).toLocaleDateString('he-IL'),
    };
  });

  const csv = Papa.unparse(csvData, {
    header: true,
    delimiter: ',',
  });

  // Create and download file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `nurse-onboarding-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
