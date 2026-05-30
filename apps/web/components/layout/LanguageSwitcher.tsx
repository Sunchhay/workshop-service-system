'use client';

import { Languages } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/lib/i18n/TranslationContext';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();

  const currentFlag = locale === 'km' ? '🇰🇭' : '🇬🇧';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('language.en')}>
          <span className="text-lg leading-none">{currentFlag}</span>
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => setLocale('en')}
          className={cn(
            'cursor-pointer gap-2',
            locale === 'en' && 'text-primary font-medium',
          )}
        >
          <span className="text-base">🇬🇧</span>
          <span>{t('language.en')}</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setLocale('km')}
          className={cn(
            'cursor-pointer gap-2',
            locale === 'km' && 'text-primary font-medium',
          )}
        >
          <span className="text-base">🇰🇭</span>
          <span>{t('language.km')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}