import { createContext } from 'react'

export type Theme = 'light' | 'dark'

export type ThemeContextValue = {
  isDarkMode: boolean
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
)
