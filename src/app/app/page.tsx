'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RoleBadge } from '@/components/RoleBadge';
import { ProgressSummary } from '@/components/ProgressSummary';
import { FiltersBar } from '@/components/FiltersBar';
import { TaskTable } from '@/components/TaskTable';
import { ExportButtons } from '@/components/ExportButtons';
import { useStore } from '@/lib/store';
import { storage } from '@/lib/storage';
import { LogOut } from 'lucide-react';

export default function AppPage() {
  const router = useRouter();
  const { 
    tasks, 
    assignments, 
    users, 
    currentUser, 
    filters, 
    setCurrentUser, 
    updateAssignment, 
    setFilters, 
    loadData 
  } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      await loadData();
      setIsLoading(false);
    };
    initializeData();
  }, [loadData]);

  // Separate effect for assignment creation after data is loaded
  useEffect(() => {
    if (!currentUser || !tasks.length || isLoading) return;

    // Create assignments for current trainee if they don't exist
    if (currentUser.role === 'trainee') {
      const existingAssignments = assignments.filter(a => a.traineeId === currentUser.id);
      if (existingAssignments.length === 0) {
        const newAssignments = storage.createAssignmentsForTrainee(currentUser.id, tasks);
        // Update store with new assignments
        useStore.setState(state => ({
          assignments: [...state.assignments, ...newAssignments]
        }));
        // Save to localStorage
        storage.setAssignments([...assignments, ...newAssignments]);
      }
    }
    
    // For instructors/admins, create assignments for all trainees if they don't exist
    if (currentUser.role === 'instructor' || currentUser.role === 'admin') {
      const trainees = users.filter(u => u.role === 'trainee');
      for (const trainee of trainees) {
        const existingAssignments = assignments.filter(a => a.traineeId === trainee.id);
        if (existingAssignments.length === 0) {
          const newAssignments = storage.createAssignmentsForTrainee(trainee.id, tasks);
          // Update store with new assignments
          useStore.setState(state => ({
            assignments: [...state.assignments, ...newAssignments]
          }));
          // Save to localStorage
          storage.setAssignments([...assignments, ...newAssignments]);
        }
      }
    }
  }, [currentUser, tasks, assignments, users, isLoading]);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  const handleLogout = () => {
    setCurrentUser(null);
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">טוען...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                {currentUser.name}
              <RoleBadge role={currentUser.role} />
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <ExportButtons 
                tasks={tasks}
                assignments={assignments}
                users={users}
                currentUser={currentUser}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">יציאה</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Progress Summary */}
          <ProgressSummary 
            assignments={assignments}
            tasks={tasks}
            currentUser={currentUser}
            users={users}
          />

          {/* Filters */}
          <FiltersBar 
            filters={filters}
            onFiltersChange={setFilters}
            tasks={tasks}
          />

          {/* Task Table */}
          <TaskTable
            tasks={tasks}
            assignments={assignments}
            users={users}
            currentUser={currentUser}
            filters={filters}
            onUpdateAssignment={updateAssignment}
            onSetFilters={setFilters}
          />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>דמו — הנתונים נשמרים בדפדפן בלבד</p>
        </footer>
      </main>
    </div>
  );
}
