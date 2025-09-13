'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskStatus } from '@/lib/types';

interface StatusDropdownProps {
  value: TaskStatus;
  onValueChange: (value: TaskStatus) => void;
  disabled?: boolean;
}

export function StatusDropdown({ value, onValueChange, disabled = false }: StatusDropdownProps) {
  const statusOptions: { value: TaskStatus; label: string; color: string }[] = [
    { value: 'לא בוצע', label: 'לא בוצע', color: 'text-gray-500' },
    { value: 'נצפה', label: 'נצפה', color: 'text-yellow-600' },
    { value: 'בוצע', label: 'בוצע', color: 'text-green-600' },
  ];

  const getStatusColor = (status: TaskStatus) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || 'text-gray-500';
  };

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={`w-full min-w-[100px] max-w-full text-xs sm:text-sm ${getStatusColor(value)}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="w-full">
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} className={`${option.color} text-xs sm:text-sm`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                option.value === 'לא בוצע' ? 'bg-gray-400' :
                option.value === 'נצפה' ? 'bg-yellow-500' :
                'bg-green-500'
              }`} />
              {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
