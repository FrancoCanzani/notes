"use client";

import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { DownloadIcon } from "@radix-ui/react-icons";

const InstallPWA = ({ className }: { className?: string }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as any);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
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
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
      });
    }
  };

  return (
    <>
      {deferredPrompt && (
        <button
          className={cn(
            "px-2 py-1.5 opacity-75 group font-medium rounded-md text-sm flex items-center justify-start gap-x-2 w-full hover:opacity-100",
            className
          )}
          onClick={handleInstallClick}
        >
          <DownloadIcon />
          Install App
        </button>
      )}
    </>
  );
};

export default InstallPWA;
