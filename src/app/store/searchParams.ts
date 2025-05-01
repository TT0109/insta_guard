// stores/searchParams.ts
import { create } from "zustand";

type SearchParamsStore = {
  searchParams: { [key: string]: string };
  setSearchParams: (params: { [key: string]: string }) => void;
  getQueryString: (symbol?: '?' | '&' ) => string;
};

export const useSearchParmsStore = create<SearchParamsStore>((set, get) => ({
  searchParams: {},
  setSearchParams: (params) => set({ searchParams: params }),
  getQueryString: (symbol: string = '?') : string => {
    const params = get().searchParams;
    const query = new URLSearchParams(params).toString();
    return query ? `${symbol}${query}` : '';
  },
}));
