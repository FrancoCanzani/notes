import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Karla } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';

const inter = Karla({ subsets: ['latin'] });
const APP_NAME = 'QuickNotes';
const APP_DESCRIPTION = 'The fastest way to jot down ideas';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: '%s - PWA App',
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    shortcut: '/favicon.ico',
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang='en' dir='ltr'>
      <body className={`${inter.className} [scrollbar-gutter: stable]`}>
        <ClerkProvider>
          <main className='min-h-screen'>{children}</main>
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
