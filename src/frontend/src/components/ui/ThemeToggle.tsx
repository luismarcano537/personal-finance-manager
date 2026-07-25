import { useTheme } from '../../hooks/useTheme'

type ThemeToggleProps = {
  showLabel?: boolean
}

function ThemeToggle({ showLabel = true }: ThemeToggleProps) {
  const { isDarkMode, toggleTheme } = useTheme()
  const targetTheme = isDarkMode ? 'light' : 'dark'

  return (
    <button
      aria-checked={isDarkMode}
      aria-label={`Switch to ${targetTheme} mode`}
      className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-brand-border-strong bg-brand-surface px-3 text-sm font-semibold text-brand-text transition hover:border-brand-primary hover:bg-brand-primary-soft hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      onClick={toggleTheme}
      role="switch"
      title={`Switch to ${targetTheme} mode`}
      type="button"
    >
      {showLabel ? <span>{isDarkMode ? 'Dark' : 'Light'}</span> : null}
      <span
        aria-hidden="true"
        className={`relative block h-6 w-11 overflow-hidden rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-brand-primary' : 'bg-brand-border-strong'}`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-[#FFFFFF] shadow-sm transition-transform duration-300 ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </span>
    </button>
  )
}

export default ThemeToggle
