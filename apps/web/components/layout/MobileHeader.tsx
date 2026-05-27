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

  const match = ALL_NAV.filter((item) =>
    isActiveRoute(pathname, item.href, item.exact),
  ).sort((a, b) => b.href.length - a.href.length)[0];

  return match ? t(match.labelKey) : 'Workshop';
}

export function MobileHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const pageTitle = usePageTitle();

  const segments = pathname.split('/').filter(Boolean);
  const isSubPage = segments.length > 2;

  return (
    <header className="z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      {isSubPage && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="Go back"
          className="-ml-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}

      <h1 className="min-w-0 flex-1 truncate text-base font-semibold">
        {pageTitle}
      </h1>

      <ThemeToggle />
    </header>
  );
}