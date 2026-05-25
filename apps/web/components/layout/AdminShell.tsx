'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { SidebarProvider } from '@/components/providers/SidebarProvider';
import { AuthGuard } from '@/features/auth/components/AuthGuard';

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
    <AuthGuard>
      <SidebarProvider>
        <div className="bg-background md:flex md:h-screen md:overflow-hidden">
          {/* Desktop sidebar — hidden on mobile via internal md:flex class */}
          <DesktopSidebar />

          {/* Right column: header + content + mobile bottom nav */}
          <div className="flex flex-1 flex-col min-h-screen md:min-h-0 md:overflow-hidden">
            {/* Desktop top header — hidden on mobile via internal md:flex class */}
            <DesktopHeader />

            {/* Mobile sticky header — hidden on desktop via internal md:hidden class */}
            <MobileHeader />

            {/* Main scrollable content */}
            <main className={`bg-[var(--app-background)] flex-1 overflow-y-auto p-4 md:p-6 md:pb-6 ${showBottomNav ? 'pb-safe-nav' : 'pb-6'}`}>
              {children}
            </main>

            {/* Mobile bottom nav — hidden on sub-pages and on desktop */}
            {showBottomNav && <MobileBottomNav onMoreClick={() => setMoreOpen(true)} />}
          </div>
        </div>

        {/* Mobile More sheet — rendered outside the layout flow */}
        <MoreMenu open={moreOpen} onOpenChange={setMoreOpen} />
      </SidebarProvider>
    </AuthGuard>
  );
}
