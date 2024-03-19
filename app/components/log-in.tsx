'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { cn } from '../lib/utils';
import { Button, type ButtonProps } from '../components/ui/button';
import { handleUser } from '../lib/actions';

interface LoginButtonProps extends ButtonProps {
  showGithubIcon?: boolean;
  text?: string;
  callbackUrl?: string;
}

export function LoginButton({
  text = 'Login with GitHub',
  showGithubIcon = true,
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
    await signIn('github', { callbackUrl: callbackUrl });
    if (user) {
      await handleUser(user);
    }
  };

  return (
    <Button
      variant='menu'
      onClick={handleLogin}
      disabled={isLoading}
      className={cn(className)}
      {...props}
    >
      {isLoading ? <p>Loading</p> : text}
    </Button>
  );
}
