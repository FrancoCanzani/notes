import React, { ReactNode } from 'react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

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
        {children}
        <Toaster />
      </SessionProvider>
    </>
  );
}
