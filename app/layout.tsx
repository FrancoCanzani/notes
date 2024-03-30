import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { GeistSans } from 'geist/font/sans';
import ClientProvider from './components/client-provider';
import { auth } from './lib/auth';

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
  const session = await auth();

  return (
    <html lang='en' dir='ltr'>
      <body className={`bg-materialBlue-200 ${GeistSans.className}`}>
        <ClientProvider session={session}>
          <main className='min-h-screen'>{children}</main>
        </ClientProvider>
      </body>
    </html>
  );
}
