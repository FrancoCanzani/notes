'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

const InstallPWA = ({ className }: { className?: string }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as any);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
      });
    }
  };

  return (
    <>
      {deferredPrompt && (
        <button
          className={cn(
            'p-3 text-sm flex items-center justify-start gap-x-4 w-full rounded-sm hover:bg-gray-100 hover:font-medium transition-all duration-150',
            className
          )}
          onClick={handleInstallClick}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='1.4em'
            height='1.4em'
            viewBox='0 0 32 32'
          >
            <path
              fill='currentColor'
              d='M15 4v16.563L9.719 15.28L8.28 16.72l7 7l.719.687l.719-.687l7-7l-1.438-1.438l-5.28 5.28V4zM7 26v2h18v-2z'
            />
          </svg>
          Install App
        </button>
      )}
    </>
  );
};

export default InstallPWA;
