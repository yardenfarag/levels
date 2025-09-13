'use client';

import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface NotesCellProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function NotesCell({ value, onChange, disabled = false, placeholder = 'הוסף הערה...' }: NotesCellProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleBlur = () => {
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <Input
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      placeholder={placeholder}
      className="w-full text-sm"
    />
  );
}
