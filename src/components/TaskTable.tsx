'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusDropdown } from './StatusDropdown';
import { NotesCell } from './NotesCell';
import { Assignment, Task, User, Filters } from '@/lib/types';
import { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState(1);

  // Helper function to get assignments for user
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

  // Expand tasks with their assignments to count properly
  const taskRows = useMemo(() => {
    const rows: { task: Task; assignment?: Assignment }[] = [];
    
    for (const task of filteredTasks) {
      const taskAssignments = getAssignmentsForUser(task.id);
      
      if (taskAssignments.length === 0) {
        if (currentUser?.role === 'instructor' || currentUser?.role === 'admin') {
          rows.push({ task });
        }
      } else {
        for (const assignment of taskAssignments) {
          rows.push({ task, assignment });
        }
      }
    }
    
    return rows;
  }, [filteredTasks, currentUser, assignments]);

  // Pagination calculations
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(taskRows.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRows = taskRows.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

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
            <div className="grid grid-cols-4 sm:grid-cols-12 gap-1 sm:gap-2 p-3 sm:p-3 bg-muted/50 rounded-lg text-xs sm:text-sm font-medium mb-3">
              <div className="col-span-2 sm:col-span-3 text-right">משימה</div>
              <div className="col-span-1 sm:col-span-2 text-center hidden sm:block">קטגוריה</div>
              <div className="col-span-1 sm:col-span-2 text-center hidden sm:block">שלב/פרק זמן</div>
              <div className="col-span-2 sm:col-span-2 text-center">סטטוס</div>
              <div className="col-span-1 sm:col-span-2 text-right hidden sm:block">הערות</div>
              <div className="col-span-1 sm:col-span-1 text-center hidden sm:block">מתלמדת</div>
            </div>

            {/* Tasks */}
            {paginatedRows.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                לא נמצאו משימות המתאימות לסינון
              </div>
            ) : (
              paginatedRows.map((row) => {
                const { task, assignment } = row;
                
                // If no assignment, show empty row for instructors
                if (!assignment) {
                  return (
                    <div key={task.id} className="grid grid-cols-4 sm:grid-cols-12 gap-1 sm:gap-2 p-3 sm:p-3 border-b text-xs sm:text-sm mb-2 sm:mb-0">
                      <div className="col-span-2 sm:col-span-3 text-right">{task.title}</div>
                      <div className="col-span-1 sm:col-span-2 text-center hidden sm:block">{task.category}</div>
                      <div className="col-span-1 sm:col-span-2 text-center hidden sm:block">{task.targetWindow}</div>
                      <div className="col-span-2 sm:col-span-2 text-center text-muted-foreground">-</div>
                      <div className="col-span-1 sm:col-span-2 text-right text-muted-foreground hidden sm:block">-</div>
                      <div className="col-span-1 sm:col-span-1 text-center text-muted-foreground hidden sm:block">-</div>
                    </div>
                  );
                }

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
                  <div key={assignment.id} className={`grid grid-cols-5 sm:grid-cols-12 gap-1 sm:gap-2 p-3 sm:p-3 border-b text-xs sm:text-sm transition-colors mb-2 sm:mb-0 ${getRowBgColor(assignment.status)}`}>
                    <div className="col-span-3 sm:col-span-3 text-right">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-muted-foreground sm:hidden" style={{ fontSize: '11px' }}>
                        {task.category} {task.targetWindow && <p>• {task.targetWindow}</p>}
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-2 text-center hidden sm:block">{task.category}</div>
                    <div className="col-span-1 sm:col-span-2 text-center hidden sm:block">{task.targetWindow}</div>
                    <div className="col-span-2 sm:col-span-2 text-center">
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
                    <div className="col-span-4 sm:hidden mt-3 space-y-3">
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
              })
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="text-xs sm:text-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap justify-center">
              {(() => {
                const pages: number[] = [];
                const maxVisible = 5;
                
                if (totalPages <= maxVisible) {
                  // Show all pages if total is small
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // Always show first page
                  pages.push(1);
                  
                  // Calculate range around current page
                  let start = Math.max(2, currentPage - 1);
                  let end = Math.min(totalPages - 1, currentPage + 1);
                  
                  // Adjust if we're near the beginning or end
                  if (currentPage <= 3) {
                    start = 2;
                    end = 4;
                  } else if (currentPage >= totalPages - 2) {
                    start = totalPages - 3;
                    end = totalPages - 1;
                  }
                  
                  // Add pages with ellipsis where needed
                  if (start > 2) {
                    pages.push(-1); // -1 represents ellipsis
                  }
                  
                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }
                  
                  if (end < totalPages - 1) {
                    pages.push(-1); // -1 represents ellipsis
                  }
                  
                  // Always show last page
                  pages.push(totalPages);
                }
                
                return pages.map((page, index) => {
                  if (page === -1) {
                    return (
                      <span key={`ellipsis-${index}`} className="px-1 text-muted-foreground text-xs">
                        ...
                      </span>
                    );
                  }
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="min-w-[28px] sm:min-w-[32px] text-xs sm:text-sm px-1 sm:px-2"
                    >
                      {page}
                    </Button>
                  );
                });
              })()}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="text-xs sm:text-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
