import { create } from 'zustand/react';
import { Category } from './categories.interface';

type CategoriesStore = {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
};

const useCategoriesStore = create<CategoriesStore>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
}));

export default useCategoriesStore;
