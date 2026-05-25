'use client';

import { Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AppSearchInputProps extends React.ComponentProps<typeof Input> {
  onClear?: () => void;
}

export function AppSearchInput({
  value,
  onClear,
  className,
  ...props
}: AppSearchInputProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        className={`pl-9 ${value ? 'pr-9' : ''} ${className ?? ''}`}
        value={value}
        {...props}
      />
      {value && onClear && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          tabIndex={-1}
          className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground hover:bg-transparent"
          onClick={onClear}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
