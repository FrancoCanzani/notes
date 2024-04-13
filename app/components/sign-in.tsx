'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { cn } from '../lib/utils';
import { type ButtonProps } from './ui/button';
import { handleUser } from '../lib/actions';

interface LoginButtonProps extends ButtonProps {
  provider: 'github' | 'google';
  callbackUrl?: string;
  children: React.ReactNode;
}

export function SignInButton({
  children,
  provider,
  className,
  callbackUrl,
  ...props
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const session = useSession();
  const user = session.data?.user;

  const handleLogin = async () => {
    setIsLoading(true);
    // next-auth signIn() function doesn't work yet at Edge Runtime due to usage of BroadcastChannel
    await signIn(provider, { callbackUrl: callbackUrl ?? '/notes' });
    if (user) {
      await handleUser(user);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={cn(className)}
      {...props}
    >
      {isLoading ? <p>Loading...</p> : children}
    </button>
  );
}
