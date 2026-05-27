'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { SidebarProvider } from '@/components/providers/SidebarProvider';
// import { AuthGuard } from '@/features/auth/components/AuthGuard';

import { DesktopHeader } from './DesktopHeader';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileHeader } from './MobileHeader';
import { MoreMenu } from './MoreMenu';

const LIST_ROUTES = new Set([
  '/admin',
  '/admin/service-jobs',
  '/admin/customers',
  '/admin/services',
  '/admin/users',
  '/admin/price-catalog',
  '/admin/machine-models',
  '/admin/reference-book',
  '/admin/products',
  '/admin/invoices',
  '/admin/payments',
  '/admin/sales',
  '/admin/expenses',
  '/admin/reports',
  '/admin/settings',
]);

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();

  const showBottomNav = LIST_ROUTES.has(pathname);

  return (
    // <AuthGuard>
    <SidebarProvider>
      <div className="fixed inset-0 flex overflow-hidden bg-background">
        {/* Desktop sidebar */}
        <DesktopSidebar />

        {/* Main app layout */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Desktop header */}
          <DesktopHeader />

          {/* Mobile header */}
          <MobileHeader />

          {/* Scrollable page content only */}
          <main
            className={`min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[var(--app-background)] p-4 md:p-6 ${showBottomNav ? 'pb-safe-nav' : 'pb-6'
              }`}
          >
            {children}
          </main>

          {/* Mobile bottom navigation */}
          {showBottomNav && (
            <MobileBottomNav onMoreClick={() => setMoreOpen(true)} />
          )}
        </div>
      </div>

      {/* Mobile More sheet */}
      <MoreMenu open={moreOpen} onOpenChange={setMoreOpen} />
    </SidebarProvider>
    // </AuthGuard>
  );
}