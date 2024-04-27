'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

interface SidebarContextType {
  showSidebar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <SidebarContext.Provider value={{ showSidebar, setShowSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
