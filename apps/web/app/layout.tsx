import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Noto_Sans_Khmer } from 'next/font/google';

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

export const metadata: Metadata = {
  title: 'Workshop System',
  description: 'Workshop service management system',
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
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansKhmer.variable} h-full antialiased`}
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
