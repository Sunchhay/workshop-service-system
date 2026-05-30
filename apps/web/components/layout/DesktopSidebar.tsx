'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useSidebar } from '@/components/providers/SidebarProvider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslation } from '@/lib/i18n/TranslationContext';
import {
  isActiveRoute,
  MAIN_NAV,
  MANAGEMENT_NAV,
  type NavItem,
} from '@/lib/nav/navConfig';
import { cn } from '@/lib/utils';

import { ModeSwitcherSidebar } from './ModeSwitcher';

function SidebarNavItem({
  item,
  pathname,
  collapsed,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
}) {
  const { t } = useTranslation();
  const active = isActiveRoute(pathname, item.href, item.exact);

  const link = (
    <Link
      href={item.href}
      aria-label={collapsed ? t(item.labelKey) : undefined}
      className={cn(
        'flex items-center rounded-lg transition-colors',
        collapsed
          ? 'mx-auto h-10 w-10 justify-center'
          : 'w-full gap-3 px-3 py-2.5 text-sm',
        active
          ? 'bg-primary/10 font-medium text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{t(item.labelKey)}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {t(item.labelKey)}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

export function DesktopSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { collapsed } = useSidebar();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'hidden h-screen shrink-0 flex-col overflow-hidden border-r bg-sidebar md:flex',
          'transition-[width] duration-300 ease-in-out',
          collapsed ? 'w-[72px]' : 'w-60',
        )}
      >
        {/* Brand row */}
        <div
          className={cn(
            'flex h-20 shrink-0 items-center overflow-hidden border-b',
            collapsed ? 'justify-center px-2' : 'px-4',
          )}
        >
          {collapsed ? (
            <div className="relative h-11 w-11 overflow-hidden rounded-md">
              <Image
                src="/icons/icon.png"
                alt="Workshop System"
                fill
                className="object-contain dark:hidden"
                priority
              />

              <Image
                src="/icons/icon.png"
                alt="Workshop System"
                fill
                className="hidden object-contain dark:block"
                priority
              />
            </div>
          ) : (
            <div className="relative h-16 w-[190px] overflow-visible">
              <Image
                src="/icons/horizontal-black.png"
                alt="Workshop System"
                fill
                sizes="190px"
                className="object-contain object-left dark:hidden"
                priority
              />

              <Image
                src="/icons/horizontal-white.png"
                alt="Workshop System"
                fill
                sizes="190px"
                className="hidden object-contain object-left dark:block"
                priority
              />
            </div>
          )}
        </div>

        {/* Scrollable nav */}
        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-1 px-2 py-4">
            {MAIN_NAV.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                pathname={pathname}
                collapsed={collapsed}
              />
            ))}
          </div>

          {MANAGEMENT_NAV.length > 0 && (
            <div className="px-2 pb-4">
              <Separator className="mb-4" />

              {!collapsed && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('nav.management')}
                </p>
              )}

              <div className="space-y-1">
                {MANAGEMENT_NAV.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Mode switcher — always visible at sidebar bottom */}
        <div className={cn('shrink-0 border-t py-2', collapsed ? 'flex justify-center' : 'px-2')}>
          <ModeSwitcherSidebar />
        </div>
      </aside>
    </TooltipProvider>
  );
}
