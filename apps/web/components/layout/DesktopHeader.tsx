'use client';

import { History, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useSidebar } from '@/components/providers/SidebarProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { LanguageSwitcher } from './LanguageSwitcher';
import { isPosMode, ModeSwitcherHeader } from './ModeSwitcher';
import { UserMenu } from './UserMenu';

export function DesktopHeader() {
  const { t } = useTranslation();
  const { collapsed, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const posMode = isPosMode(pathname);

  return (
    <header className="hidden md:flex h-14 shrink-0 items-center gap-2 border-b bg-sidebar px-4">
      {posMode ? (
        /* POS mode: mode-switch + page title on left, sale history + actions on right */
        <>
          <div className="flex items-center gap-2 shrink-0">
            <ModeSwitcherHeader />
            <Badge variant="secondary" className="text-xs font-semibold">
              {t('sales.posMode')}
            </Badge>
            <Separator orientation="vertical" className="mx-1 h-5" />
            <span className="text-sm font-semibold">{t('pos.title')}</span>
          </div>
          <div className="flex-1" />
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link href="/admin/sales/history">
              <History className="h-4 w-4 mr-1.5" />
              {t('sales.salesHistory')}
            </Link>
          </Button>
          <Separator orientation="vertical" className="mx-1 h-5" />
        </>
      ) : (
        /* Admin mode: regular sidebar toggle */
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={collapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      )}

      {/* In Admin mode: spacer + POS mode switcher */}
      {!posMode && (
        <>
          <div className="flex-1" />
          <ModeSwitcherHeader />
        </>
      )}

      <LanguageSwitcher />
      <ThemeToggle />
      <Separator orientation="vertical" className="mx-1 h-5" />
      <UserMenu />
    </header>
  );
}
