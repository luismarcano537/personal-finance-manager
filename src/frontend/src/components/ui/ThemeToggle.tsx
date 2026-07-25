import { useTheme } from '../../hooks/useTheme'

type ThemeToggleProps = {
  showLabel?: boolean
}

function ThemeToggle({ showLabel = true }: ThemeToggleProps) {
  const { isDarkMode, toggleTheme } = useTheme()
  const targetTheme = isDarkMode ? 'light' : 'dark'
  const buttonClassName = showLabel
    ? 'inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-brand-border bg-brand-surface/90 px-2.5 text-xs font-semibold text-brand-text shadow-sm backdrop-blur-sm transition hover:border-brand-primary hover:bg-brand-primary-soft hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'
    : 'inline-flex h-10 w-12 shrink-0 items-center justify-center rounded-xl border border-brand-border bg-brand-surface/90 p-0 shadow-sm backdrop-blur-sm transition hover:border-brand-primary hover:bg-brand-primary-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'

  return (
    <button
      aria-checked={isDarkMode}
      aria-label={`Switch to ${targetTheme} mode`}
      className={buttonClassName}
      onClick={toggleTheme}
      role="switch"
      title={`Switch to ${targetTheme} mode`}
      type="button"
    >
      {showLabel ? <span>{isDarkMode ? 'Dark' : 'Light'}</span> : null}
      <span
        aria-hidden="true"
        className={`relative block h-5 w-9 overflow-hidden rounded-full border border-brand-border-strong p-0.5 transition-colors duration-300 ${isDarkMode ? 'bg-brand-primary' : 'bg-brand-surface-muted'}`}
      >
        <span
          className={`block h-3.5 w-3.5 rounded-full bg-[#FFFFFF] shadow-sm transition-transform duration-300 ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`}
        />
      </span>
    </button>
  )
}

export default ThemeToggle
