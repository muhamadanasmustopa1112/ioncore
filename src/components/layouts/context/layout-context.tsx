'use client';

import { MenuConfig, NavConfig } from '@/config/types';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

// Define the shape of the layout state
interface LayoutState {
  sidebarCollapse: boolean;
  setSidebarCollapse: (open: boolean) => void;
  sidebarPinnedNavItems: string[];
  pinSidebarNavItem: (id: string) => void;
  unpinSidebarNavItem: (id: string) => void;
  isSidebarNavItemPinned: (id: string) => boolean;
  getSidebarNavItems: () => MenuConfig;
}

// Create the context
const LayoutContext = createContext<LayoutState | undefined>(undefined);

// Provider component
interface LayoutProviderProps {
  children: ReactNode;
  sidebarNavItems: MenuConfig;
}

export function LayoutProvider({
  children,
  sidebarNavItems,
}: LayoutProviderProps) {
  const [sidebarCollapse, setSidebarCollapse] = useState(false);
  const initialPinned = sidebarNavItems.map((item) => item.title);
  const [sidebarPinnedNavItems, setSidebarPinnedNavItems] =
    useState<string[]>(initialPinned);

  const pinSidebarNavItem = (id: string) => {
    setSidebarPinnedNavItems((prev) =>
      prev.includes(id) ? prev : [...prev, id],
    );
  };
  const unpinSidebarNavItem = (id: string) => {
    setSidebarPinnedNavItems((prev) => prev.filter((itemId) => itemId !== id));
  };
  const isSidebarNavItemPinned = (id: string) => {
    return sidebarPinnedNavItems.includes(id);
  };

  // Memoize the processed navigation items to prevent duplicate object creation
  const processedNavItems = useMemo(() => {
    return sidebarNavItems.map((item) => {
      return item;
    });
  }, [sidebarNavItems, sidebarPinnedNavItems]);

  const getSidebarNavItems = () => {
    return processedNavItems;
  };

  return (
    <LayoutContext.Provider
      value={{
        sidebarCollapse,
        setSidebarCollapse,
        sidebarPinnedNavItems,
        getSidebarNavItems,
        pinSidebarNavItem,
        unpinSidebarNavItem,
        isSidebarNavItemPinned,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

// Custom hook for consuming the context
export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
