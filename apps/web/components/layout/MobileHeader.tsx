'use client';

import { ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTranslation } from '@/lib/i18n/TranslationContext';
import { ALL_NAV, isActiveRoute } from '@/lib/nav/navConfig';

function usePageTitle(): string {
  const { t } = useTranslation();
  const pathname = usePathname();

  // Find the most specific (longest) matching nav item
  const match = ALL_NAV.filter((item) =>
    isActiveRoute(pathname, item.href, item.exact),
  ).sort((a, b) => b.href.length - a.href.length)[0];

  return match ? t(match.labelKey) : 'Workshop';
}

export function MobileHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const pageTitle = usePageTitle();

  // Show back button on sub-pages: /admin/module/id or deeper
  const segments = pathname.split('/').filter(Boolean);
  const isSubPage = segments.length > 2;

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 safe-area-top md:hidden">
      {isSubPage && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      <h1 className="flex-1 text-base font-semibold">{pageTitle}</h1>
      <ThemeToggle />
    </header>
  );
}
