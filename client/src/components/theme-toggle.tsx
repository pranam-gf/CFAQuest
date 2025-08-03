import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle theme"
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          isDark ? "translate-x-6" : "translate-x-1"
        }`}
      />
      <Sun
        className={`absolute left-1 h-3 w-3 text-yellow-500 transition-opacity duration-200 ${
          isDark ? "opacity-0" : "opacity-100"
        }`}
      />
      <Moon
        className={`absolute right-1 h-3 w-3 text-gray-400 transition-opacity duration-200 ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
      />
    </button>
  )
}