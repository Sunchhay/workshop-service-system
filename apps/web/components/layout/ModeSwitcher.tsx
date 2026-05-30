'use client';

import { ArrowLeftRight, LayoutDashboard, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useSidebar } from '@/components/providers/SidebarProvider';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslation } from '@/lib/i18n/TranslationContext';
import { cn } from '@/lib/utils';

// POS/cart mode = exactly /admin/carts, not sale history or sub-routes.
export function isPosMode(pathname: string): boolean {
  return pathname === '/admin/carts';
}

export function usePosMode(): boolean {
  const pathname = usePathname();
  return isPosMode(pathname);
}

// ─── Sidebar variant ──────────────────────────────────────────────────────────
// Placed at the bottom of the desktop sidebar.
// Respects collapsed state — shows icon-only when collapsed.
export function ModeSwitcherSidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { collapsed } = useSidebar();
  const posMode = isPosMode(pathname);

  const href = posMode ? '/admin' : '/admin/carts';
  const label = posMode ? t('sales.switchToAdmin') : t('sales.switchToPos');
  const Icon = posMode ? LayoutDashboard : ShoppingCart;

  const btn = (
    <Button
      asChild
      variant="outline"
      size="sm"
      className={cn(
        'transition-colors',
        collapsed
          ? 'mx-auto h-10 w-10 justify-center p-0'
          : 'w-full gap-2 justify-start',
      )}
    >
      <Link href={href} aria-label={label}>
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span className="truncate">{label}</span>}
      </Link>
    </Button>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{btn}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return btn;
}

// ─── Desktop header variant ───────────────────────────────────────────────────
// Shown in the desktop header. In POS mode shows a prominent "← Admin Mode"
// button; in Admin mode shows a compact "Switch to POS Mode" button.
export function ModeSwitcherHeader() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const posMode = isPosMode(pathname);

  if (posMode) {
    return (
      <Button asChild variant="outline" size="sm" className="gap-1.5">
        <Link href="/admin">
          <LayoutDashboard className="h-3.5 w-3.5" />
          <span>{t('sales.switchToAdmin')}</span>
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild variant="outline" size="sm" className="gap-1.5">
      <Link href="/admin/carts">
        <ShoppingCart className="h-3.5 w-3.5" />
        <span>{t('sales.switchToPos')}</span>
      </Link>
    </Button>
  );
}

// ─── Mobile header variant ────────────────────────────────────────────────────
// Icon-only button that fits in the tight mobile header.
export function ModeSwitcherMobile() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const posMode = isPosMode(pathname);

  const href = posMode ? '/admin' : '/admin/carts';
  const label = posMode ? t('sales.switchToAdmin') : t('sales.switchToPos');
  const Icon = posMode ? LayoutDashboard : ShoppingCart;

  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="h-8 w-8 shrink-0"
      aria-label={label}
    >
      <Link href={href}>
        <Icon className="h-4 w-4" />
      </Link>
    </Button>
  );
}
