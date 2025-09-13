'use client';

import { Button } from '@/components/ui/button';
import { FileText, Table } from 'lucide-react';
import { exportToCsv } from '@/lib/exportCsv';
import { exportToPdf } from '@/lib/exportPdf';
import { Task, Assignment, User } from '@/lib/types';

interface ExportButtonsProps {
  tasks: Task[];
  assignments: Assignment[];
  users: User[];
  currentUser: User | null;
}

export function ExportButtons({ tasks, assignments, users, currentUser }: ExportButtonsProps) {
  const handleCsvExport = () => {
    exportToCsv(tasks, assignments, users, currentUser);
  };

  const handlePdfExport = () => {
    exportToPdf('task-table', `nurse-onboarding-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="flex gap-1 sm:gap-2">
      <Button
        onClick={handleCsvExport}
        variant="outline"
        size="sm"
        className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
      >
        <Table className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">ייצא CSV</span>
        <span className="sm:hidden">CSV</span>
      </Button>
      <Button
        onClick={handlePdfExport}
        variant="outline"
        size="sm"
        className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
      >
        <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">ייצא PDF</span>
        <span className="sm:hidden">PDF</span>
      </Button>
    </div>
  );
}
