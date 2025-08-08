
    "use client";

    import { useTheme } from '@/components/providers/ThemeProvider';
    import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

    export default function ThemeToggleButton() {
      const { theme, toggleTheme } = useTheme();

      return (
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 rounded-full hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <MoonIcon className="w-6 h-6" />
          ) : (
            <SunIcon className="w-6 h-6" />
          )}
        </button>
      );
    }