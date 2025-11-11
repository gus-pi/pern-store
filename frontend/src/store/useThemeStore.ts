import { create } from 'zustand';

type ThemeStore = {
    theme: string;
    setTheme: (theme: string) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: localStorage.getItem('preferred-theme') || 'forest',
    setTheme: (theme: string) => {
        localStorage.setItem('preferred-theme', theme);
        set({ theme });
    },
}));
