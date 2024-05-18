import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Roboto_Mono } from 'next/font/google';
import ShowTailwindBreakpoint from '../components/show-tailwind-breakpoint';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';

// If loading a variable font, you don't need to specify the font weight
const roboto = Roboto_Mono({ subsets: ['latin'] });
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
      <body className={`${roboto.className}`}>
        <ClerkProvider>
          <main className='min-h-screen'>{children}</main>
          {process.env.DEV_ENVIRONMENT === 'development' && (
            <ShowTailwindBreakpoint />
          )}
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
