import type { ReactNode } from 'react';
import './globals.css';
import { Karla } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';

const inter = Karla({ subsets: ['latin'] });

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
