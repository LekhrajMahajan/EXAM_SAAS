import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createPersistConfig } from '../persist/config';

interface FilterState {
  savedFilters: Record<string, any>;
  tableFilters: Record<string, any>;
  searchFilters: Record<string, string>;
  
  saveFilter: (key: string, filter: any) => void;
  setTableFilter: (tableId: string, filter: any) => void;
  setSearchFilter: (searchId: string, query: string) => void;
  clearTableFilter: (tableId: string) => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      savedFilters: {},
      tableFilters: {},
      searchFilters: {},
      
      saveFilter: (key, filter) => set((state) => ({
        savedFilters: { ...state.savedFilters, [key]: filter }
      })),
      
      setTableFilter: (tableId, filter) => set((state) => ({
        tableFilters: { ...state.tableFilters, [tableId]: filter }
      })),
      
      setSearchFilter: (searchId, query) => set((state) => ({
        searchFilters: { ...state.searchFilters, [searchId]: query }
      })),
      
      clearTableFilter: (tableId) => set((state) => {
        const newFilters = { ...state.tableFilters };
        delete newFilters[tableId];
        return { tableFilters: newFilters };
      }),
    }),
    createPersistConfig('filters')
  )
);
