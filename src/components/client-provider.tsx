import React, { ReactNode } from 'react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import { SidebarProvider } from './sidebar-provider';

export default function ClientProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <>
      <SessionProvider session={session}>
        <SidebarProvider>
          {children}
          <Toaster />
        </SidebarProvider>
      </SessionProvider>
    </>
  );
}
