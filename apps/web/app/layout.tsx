import type { Metadata, Viewport } from 'next';
import {
  Battambang,
  Geist,
  Geist_Mono,
  Koulen,
  Moul,
  Noto_Sans_Khmer,
} from 'next/font/google';

import { StoreProvider } from '@/components/providers/StoreProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { TranslationProvider } from '@/lib/i18n/TranslationContext';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoSansKhmer = Noto_Sans_Khmer({
  variable: '--font-noto-sans-khmer',
  subsets: ['khmer'],
  weight: ['400', '500', '600', '700'],
});

const moul = Moul({
  variable: '--font-moul',
  subsets: ['khmer'],
  weight: ['400'],
});

const koulen = Koulen({
  variable: '--font-koulen',
  subsets: ['khmer'],
  weight: ['400'],
});

const battambang = Battambang({
  variable: '--font-battambang',
  subsets: ['khmer'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'ជាងក្រឡឹង ដែង រស្មី',
  description: 'មានទទួល សំលៀងវីលីគាំង សីសូមុី ម៉ាបក្បាលកន្លះ ធ្វើប៉ូម ទាក់បូ និងក្រឡឹងគ្រឿងម៉ាស៊ីនគ្រប់ប្រភេទ',
  icons: {
    icon: [
      {
        url: '/icons/favicon-light.png?v=1',
        type: 'image/png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icons/favicon-dark.png?v=1',
        type: 'image/png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    shortcut: '/icons/app-icon-512.png',
    apple: '/icons/app-icon-512.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="km"
      suppressHydrationWarning
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        ${notoSansKhmer.variable}
        ${moul.variable}
        ${koulen.variable}
        ${battambang.variable}
        h-full antialiased
      `}
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <ThemeProvider>
            <TranslationProvider>{children}</TranslationProvider>
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}