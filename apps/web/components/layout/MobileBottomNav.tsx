'use client';

import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useTranslation } from '@/lib/i18n/TranslationContext';
import {
  isActiveRoute,
  MOBILE_BOTTOM_NAV,
  MORE_MENU_NAV,
} from '@/lib/nav/navConfig';
import { cn } from '@/lib/utils';

interface MobileBottomNavProps {
  onMoreClick: () => void;
}

export function MobileBottomNav({ onMoreClick }: MobileBottomNavProps) {
  const { t } = useTranslation();
  const pathname = usePathname();

  const moreActive = MORE_MENU_NAV.some((item) =>
    isActiveRoute(pathname, item.href, item.exact),
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t bg-background/95 safe-area-bottom md:hidden">
      {MOBILE_BOTTOM_NAV.map(({ href, icon: Icon, labelKey, exact }) => {
        const active = isActiveRoute(pathname, href, exact);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-xs font-medium transition-colors',
              active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{t(labelKey)}</span>
          </Link>
        );
      })}

      {/* More */}
      <button
        type="button"
        onClick={onMoreClick}
        className={cn(
          'flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-xs font-medium transition-colors',
          moreActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <MoreHorizontal className="h-5 w-5" />
        <span>{t('nav.more')}</span>
      </button>
    </nav>
  );
}
