import { useEffect, useId, useRef } from 'react'

export type RegisterFeedbackType = 'success' | 'error'

type RegisterFeedbackModalProps = {
  isOpen: boolean
  type: RegisterFeedbackType
  title: string
  message: string
  onClose: () => void
  primaryActionLabel?: string
  onPrimaryAction?: () => void
}

function RegisterFeedbackModal({
  isOpen,
  type,
  title,
  message,
  onClose,
  primaryActionLabel = 'Close',
  onPrimaryAction,
}: RegisterFeedbackModalProps) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const primaryActionRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    primaryActionRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || dialogRef.current === null) {
        return
      }

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )

      if (focusableElements.length === 0) {
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocusedElement?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const isSuccess = type === 'success'

  function handlePrimaryAction() {
    if (onPrimaryAction) {
      onPrimaryAction()
      return
    }

    onClose()
  }

  return (
    <div
      className="register-feedback-overlay fixed inset-0 z-[70] flex min-h-screen items-center justify-center overflow-y-auto px-4 py-6"
    >
      <div
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="register-feedback-card relative w-full max-w-md overflow-hidden rounded-3xl border border-brand-border bg-brand-surface p-6 text-center shadow-[0_30px_90px_rgba(14,21,17,0.28)] sm:p-8"
        ref={dialogRef}
        role="dialog"
      >
        <button
          aria-label="Close feedback dialog"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-brand-border bg-brand-surface-muted text-sm font-bold text-brand-text-muted transition hover:border-brand-border-strong hover:text-brand-text-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          onClick={onClose}
          type="button"
        >
          <span aria-hidden="true">X</span>
        </button>

        <div
          aria-hidden="true"
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border text-3xl font-bold shadow-sm ${
            isSuccess
              ? 'border-brand-primary/30 bg-brand-primary-soft text-brand-primary-dark'
              : 'border-brand-error/30 bg-brand-error-soft text-brand-error'
          }`}
        >
          {isSuccess ? '✓' : '!'}
        </div>

        <p
          className={`mt-5 text-xs font-bold uppercase tracking-[0.12em] ${
            isSuccess ? 'text-brand-primary-dark' : 'text-brand-error'
          }`}
        >
          {isSuccess ? 'Registration complete' : 'Registration needs attention'}
        </p>
        <h2
          className="mt-3 break-words text-2xl font-bold text-brand-text-strong sm:text-3xl"
          id={titleId}
        >
          {title}
        </h2>
        <p
          className="mt-4 break-words text-sm leading-7 text-brand-text-muted sm:text-base"
          id={descriptionId}
        >
          {message}
        </p>

        <button
          className={`mt-7 min-h-12 w-full rounded-xl px-5 py-3 text-sm font-bold text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface ${
            isSuccess
              ? 'bg-brand-primary shadow-[0_14px_32px_rgba(59,170,114,0.25)] hover:bg-brand-primary-dark focus-visible:ring-brand-primary'
              : 'bg-brand-error shadow-[0_14px_32px_rgba(220,38,38,0.2)] hover:brightness-90 focus-visible:ring-brand-error'
          }`}
          onClick={handlePrimaryAction}
          ref={primaryActionRef}
          type="button"
        >
          {primaryActionLabel}
        </button>
      </div>
    </div>
  )
}

export default RegisterFeedbackModal
