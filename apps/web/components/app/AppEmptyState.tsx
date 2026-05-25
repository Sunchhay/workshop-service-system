import type { LucideIcon } from 'lucide-react';

interface AppEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

export function AppEmptyState({ icon: Icon, title, description }: AppEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      {Icon && <Icon className="h-10 w-10 text-muted-foreground/40" />}
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground/70 max-w-xs">{description}</p>
      )}
    </div>
  );
}
