'use client';

import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Assignment, Task, User } from '@/lib/types';

interface ProgressSummaryProps {
  assignments: Assignment[];
  tasks: Task[];
  currentUser: User | null;
  users: User[];
}

export function ProgressSummary({ assignments, tasks, currentUser, users }: ProgressSummaryProps) {
  // Filter assignments based on current user role
  const filteredAssignments = currentUser?.role === 'trainee' 
    ? assignments.filter(a => a.traineeId === currentUser.id)
    : assignments;

  const totalTasks = tasks.length;
  const completedTasks = filteredAssignments.filter(a => a.status === 'בוצע').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getProgressLabel = () => {
    if (currentUser?.role === 'trainee') {
      return `התקדמות: ${completedTasks}/${totalTasks} משימות הושלמו`;
    } else {
      const allTrainees = users.filter(u => u.role === 'trainee');
      const totalAssignments = allTrainees.length * totalTasks;
      const allCompleted = assignments.filter(a => a.status === 'בוצע').length;
      return `סך הכל: ${allCompleted}/${totalAssignments} משימות הושלמו`;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-center">
          סיכום התקדמות
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-2xl font-bold mb-2 ${
            progressPercentage === 100 ? 'text-green-600' :
            progressPercentage >= 75 ? 'text-blue-600' :
            progressPercentage >= 50 ? 'text-yellow-600' :
            progressPercentage >= 25 ? 'text-orange-600' :
            'text-red-600'
          }`}>
            {progressPercentage}%
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3"
          />
          <div className="mt-2 text-xs text-muted-foreground">
            {progressPercentage === 100 ? '🎉 הושלם בהצלחה!' :
             progressPercentage >= 75 ? '🔥 כמעט שם!' :
             progressPercentage >= 50 ? '💪 מחצית הדרך!' :
             progressPercentage >= 25 ? '🚀 התחלה טובה!' :
             '💪 בואו נתחיל!'}
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          {getProgressLabel()}
        </p>
      </CardContent>
    </Card>
  );
}
