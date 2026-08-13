import { useState, useCallback } from 'react';
import type { TabItem } from '../types';

export function useTabs(initialTabs: TabItem[] = []) {
  const [tabs, setTabs] = useState<TabItem[]>(initialTabs);
  const [activeTabId, setActiveTabId] = useState<string | null>(initialTabs[0]?.id || null);

  const addTab = useCallback((tab: TabItem) => {
    setTabs(prev => {
      if (prev.find(t => t.id === tab.id)) return prev;
      return [...prev, tab];
    });
    setActiveTabId(tab.id);
  }, []);

  const removeTab = useCallback((id: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(t => t.id !== id);
      if (activeTabId === id && newTabs.length > 0) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      }
      return newTabs;
    });
  }, [activeTabId]);

  return {
    tabs,
    activeTabId,
    setActiveTabId,
    addTab,
    removeTab
  };
}
