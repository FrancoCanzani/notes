import React, { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { ClerkProvider } from '@clerk/nextjs';

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      {children}
      <Toaster />
    </ClerkProvider>
  );
}
