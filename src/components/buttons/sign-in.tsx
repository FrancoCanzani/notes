'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { cn } from '../../lib/utils';
import { type ButtonProps } from '../ui/button';
import { handleUser } from '../../lib/actions';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface SignInButtonProps extends ButtonProps {
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
}: SignInButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { data: session } = useSession();

  React.useEffect(() => {
    const handleUserData = async () => {
      if (session?.user) {
        const { email, id, name, image } = session.user;
        if (email && id && name && image) {
          try {
            const newUserResult = await handleUser({ email, id, name, image });
          } catch (error) {
            toast.error('Error handling user');
          }
        }
      }
    };
    handleUserData();
  }, [session]);

  const handleLogin = async () => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl: callbackUrl ?? '/notes' });
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
