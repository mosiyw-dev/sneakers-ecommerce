"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SearchState {
  isOpen: boolean;
  searchQuery: string;
  query: string;
  recentSearches: string[];

  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  setSearchQuery: (query: string) => void;
  setQuery: (query: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      isOpen: false,
      searchQuery: "",
      query: "",
      recentSearches: [
        "ایر جردن ۱ شیکاگو",
        "جردن ۴ میلیتاری بلک",
        "ترویس اسکات ریورس موکا",
        "نایک دانک پاندا",
      ],

      openSearch: () => set({ isOpen: true }),
      closeSearch: () => set({ isOpen: false }),
      toggleSearch: () => set((state) => ({ isOpen: !state.isOpen })),
      setSearchQuery: (searchQuery) => set({ searchQuery, query: searchQuery }),
      setQuery: (query) => set({ query, searchQuery: query }),

      addRecentSearch: (search) => {
        const clean = search.trim();
        if (!clean) return;
        set((state) => {
          const filtered = state.recentSearches.filter(
            (s) => s.toLowerCase() !== clean.toLowerCase()
          );
          return {
            recentSearches: [clean, ...filtered].slice(0, 6),
          };
        });
      },

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "jordan-search-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        recentSearches: state.recentSearches,
      }),
    }
  )
);
