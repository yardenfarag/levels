'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusDropdown } from './StatusDropdown';
import { NotesCell } from './NotesCell';
import { Assignment, Task, User, Filters } from '@/lib/types';
import { useMemo } from 'react';

interface TaskTableProps {
  tasks: Task[];
  assignments: Assignment[];
  users: User[];
  currentUser: User | null;
  filters: Filters;
  onUpdateAssignment: (assignmentId: string, updates: Partial<Assignment>) => void;
}

export function TaskTable({ 
  tasks, 
  assignments, 
  users, 
  currentUser, 
  filters, 
  onUpdateAssignment 
}: TaskTableProps) {
  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        assignments.some(a => 
          a.taskId === task.id && 
          (a.notes || '').toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(task => task.category === filters.category);
    }

    // Apply target window filter
    if (filters.targetWindow !== 'all') {
      filtered = filtered.filter(task => task.targetWindow === filters.targetWindow);
    }

    // Apply completed filter
    if (filters.showOnlyCompleted) {
      filtered = filtered.filter(task => 
        assignments.some(a => a.taskId === task.id && a.status === 'בוצע')
      );
    }

    return filtered;
  }, [tasks, assignments, filters]);

  // Get assignments for current user or all if instructor/admin
  const getAssignmentsForUser = (taskId: string) => {
    if (currentUser?.role === 'trainee') {
      return assignments.filter(a => a.taskId === taskId && a.traineeId === currentUser.id);
    }
    return assignments.filter(a => a.taskId === taskId);
  };

  const canEdit = (assignment: Assignment) => {
    if (!currentUser) return false;
    if (currentUser.role === 'instructor' || currentUser.role === 'admin') return true;
    return assignment.traineeId === currentUser.id;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">
          רשימת משימות
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div id="task-table" className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="grid grid-cols-3 sm:grid-cols-12 gap-2 sm:gap-2 p-3 sm:p-3 bg-muted/50 rounded-lg text-xs sm:text-sm font-medium mb-3">
              <div className="col-span-2 sm:col-span-3 text-right">משימה</div>
              <div className="col-span-1 sm:col-span-2 text-center hidden sm:block">קטגוריה</div>
              <div className="col-span-1 sm:col-span-2 text-center hidden sm:block">שלב/פרק זמן</div>
              <div className="col-span-1 sm:col-span-2 text-center">סטטוס</div>
              <div className="col-span-1 sm:col-span-2 text-right hidden sm:block">הערות</div>
              <div className="col-span-1 sm:col-span-1 text-center hidden sm:block">מתלמדת</div>
            </div>

            {/* Tasks */}
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                לא נמצאו משימות המתאימות לסינון
              </div>
            ) : (
              filteredTasks.map((task) => {
                const taskAssignments = getAssignmentsForUser(task.id);
                
                if (taskAssignments.length === 0) {
                  // Show task without assignment for instructors
                  if (currentUser?.role === 'instructor' || currentUser?.role === 'admin') {
                    return (
                      <div key={task.id} className="grid grid-cols-3 sm:grid-cols-12 gap-2 sm:gap-2 p-3 sm:p-3 border-b text-xs sm:text-sm mb-2 sm:mb-0">
                        <div className="col-span-2 sm:col-span-3 text-right">{task.title}</div>
                        <div className="col-span-1 sm:col-span-2 text-center hidden sm:block">{task.category}</div>
                        <div className="col-span-1 sm:col-span-2 text-center hidden sm:block">{task.targetWindow}</div>
                        <div className="col-span-1 sm:col-span-2 text-center text-muted-foreground">-</div>
                        <div className="col-span-1 sm:col-span-2 text-right text-muted-foreground hidden sm:block">-</div>
                        <div className="col-span-1 sm:col-span-1 text-center text-muted-foreground hidden sm:block">-</div>
                      </div>
                    );
                  }
                  return null;
                }

                return taskAssignments.map((assignment) => {
                  const trainee = users.find(u => u.id === assignment.traineeId);
                  const canEditThis = canEdit(assignment);

                  const getRowBgColor = (status: string) => {
                    switch (status) {
                      case 'בוצע': return 'bg-green-50 border-green-200';
                      case 'נצפה': return 'bg-yellow-50 border-yellow-200';
                      case 'לא בוצע': return 'bg-gray-50 border-gray-200';
                      default: return 'bg-white border-gray-200';
                    }
                  };

                  return (
                    <div key={assignment.id} className={`grid grid-cols-3 sm:grid-cols-12 gap-2 sm:gap-2 p-3 sm:p-3 border-b text-xs sm:text-sm transition-colors mb-2 sm:mb-0 ${getRowBgColor(assignment.status)}`}>
                      <div className="col-span-2 sm:col-span-3 text-right">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">
                          {task.category} {task.targetWindow && <p>• {task.targetWindow}</p>}
                        </div>
                      </div>
                      <div className="col-span-1 sm:col-span-2 text-center hidden sm:block">{task.category}</div>
                      <div className="col-span-1 sm:col-span-2 text-center hidden sm:block">{task.targetWindow}</div>
                      <div className="col-span-1 sm:col-span-2 text-center">
                        <div className="w-full">
                          <StatusDropdown
                            value={assignment.status}
                            onValueChange={(status) => 
                              onUpdateAssignment(assignment.id, { status })
                            }
                            disabled={!canEditThis}
                          />
                        </div>
                      </div>
                      <div className="col-span-1 sm:col-span-2 text-right hidden sm:block">
                        <NotesCell
                          value={assignment.notes || ''}
                          onChange={(notes) => 
                            onUpdateAssignment(assignment.id, { notes })
                          }
                          disabled={!canEditThis}
                        />
                      </div>
                      <div className="col-span-1 sm:col-span-1 text-center text-xs text-muted-foreground hidden sm:block">
                        {trainee?.name || '-'}
                      </div>
                      {/* Mobile notes and trainee row */}
                      <div className="col-span-3 sm:hidden mt-3 space-y-3">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">הערות:</div>
                          <NotesCell
                            value={assignment.notes || ''}
                            onChange={(notes) => 
                              onUpdateAssignment(assignment.id, { notes })
                            }
                            disabled={!canEditThis}
                          />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">מתלמדת:</div>
                          <div className="text-sm font-medium">{trainee?.name || '-'}</div>
                        </div>
                      </div>
                    </div>
                  );
                });
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
