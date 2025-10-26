'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Filters, Task } from '@/lib/types';

interface FiltersBarProps {
  filters: Filters;
  onFiltersChange: (filters: Partial<Filters>) => void;
  tasks: Task[];
}

export function FiltersBar({ filters, onFiltersChange, tasks }: FiltersBarProps) {
  // Get unique categories from tasks
  const categories = Array.from(new Set(tasks.map(task => task.category))).sort();

  const categoryOptions = [
    { value: 'all', label: 'כל הקטגוריות' },
    ...categories.map(cat => ({ value: cat, label: cat }))
  ];

  return (
    <Card className="w-full border-2">
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium flex items-center gap-1">
              🔍 חיפוש
            </Label>
            <Input
              id="search"
              placeholder="חפש משימה או הערה..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className="w-full"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium flex items-center gap-1">
              📂 קטגוריה
            </Label>
            <Select
              value={filters.category}
              onValueChange={(value) => onFiltersChange({ category: value })}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Show Only Completed Checkbox */}
          <div className="flex items-center space-x-2 space-x-reverse gap-1 pt-6">
            <Checkbox
              id="showOnlyCompleted"
              checked={filters.showOnlyCompleted}
              onCheckedChange={(checked) => 
                onFiltersChange({ showOnlyCompleted: checked as boolean })
              }
            />
            <Label htmlFor="showOnlyCompleted" className="text-sm font-medium flex items-center">
              הצג רק משימות שהושלמו
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
