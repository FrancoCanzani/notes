'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';

import { cn } from '../lib/utils';
import { Button, type ButtonProps } from '../components/ui/button';

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

  return (
    <Button
      variant='menu'
      onClick={() => {
        setIsLoading(true);
        // next-auth signIn() function doesn't work yet at Edge Runtime due to usage of BroadcastChannel
        signIn('github', { callbackUrl: callbackUrl });
      }}
      disabled={isLoading}
      className={cn(className)}
      {...props}
    >
      {isLoading ? <p>Loading</p> : text}
    </Button>
  );
}
