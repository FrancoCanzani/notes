import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import ClientProvider from './components/client-provider';

const inter = Inter({ subsets: ['latin'] });
const APP_NAME = 'next-pwa example';
const APP_DESCRIPTION = 'This is an example of using next-pwa';

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
  const session = await getServerSession();

  return (
    <html lang='en' dir='ltr'>
      <body className={`dark:text-gray-100 bg-gray-50 ${inter.className}`}>
        {/* this div is intentional, prevents a layout shift when opening components */}
        <div className={`max-w-4xl m-auto`}>
          <ClientProvider session={session}>
            <main className='p-6 pt-3 md:pt-6 min-h-screen'>{children}</main>
          </ClientProvider>
        </div>
      </body>
    </html>
  );
}
