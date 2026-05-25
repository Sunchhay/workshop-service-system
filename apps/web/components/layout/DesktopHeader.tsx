'use client';

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { useSidebar } from '@/components/providers/SidebarProvider';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { LanguageSwitcher } from './LanguageSwitcher';
import { UserMenu } from './UserMenu';

export function DesktopHeader() {
  const { t } = useTranslation();
  const { collapsed, toggleSidebar } = useSidebar();

  return (
    <header className="hidden md:flex h-14 shrink-0 items-center gap-2 border-b bg-sidebar px-4">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={
          collapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')
        }
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        {collapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </button>

      <div className="flex-1" />

      <LanguageSwitcher />
      <ThemeToggle />
      <Separator orientation="vertical" className="mx-1 h-5" />
      <UserMenu />
    </header>
  );
}
