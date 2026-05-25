'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useTranslation } from '@/lib/i18n/TranslationContext';
import { isActiveRoute, MORE_MENU_NAV } from '@/lib/nav/navConfig';
import { cn } from '@/lib/utils';

interface MoreMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MoreMenu({ open, onOpenChange }: MoreMenuProps) {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[80vh] rounded-t-2xl p-0"
        showCloseButton={false}
      >
        <SheetHeader className="px-4 pt-4 pb-2 border-b">
          <SheetTitle className="text-sm font-medium text-muted-foreground text-left">
            {t('nav.more')}
          </SheetTitle>
        </SheetHeader>

        <nav className="overflow-y-auto px-2 py-2 pb-[env(safe-area-inset-bottom,0.5rem)]">
          {MORE_MENU_NAV.map((item) => {
            const active = isActiveRoute(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors',
                  active
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground hover:bg-muted',
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
