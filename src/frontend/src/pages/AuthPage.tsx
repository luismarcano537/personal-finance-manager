import { useCallback, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import RegisterFeedbackModal, {
  type RegisterFeedbackType,
} from '../components/auth/RegisterFeedbackModal'
import BrandLogo from '../components/ui/BrandLogo'
import ThemeToggle from '../components/ui/ThemeToggle'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'

type AuthMode = 'login' | 'register'

type RegisterFeedback = {
  type: RegisterFeedbackType
  title: string
  message: string
}

type VisualContent = {
  eyebrow: string
  headline: string
  description: string
  focusLabel: string
  focusValue: string
  progressLabel: string
  progressValue: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const loginErrorMessage =
  'Unable to sign in. Please check your email and password.'
const registerErrorMessage =
  'Please review your information and try again.'
const registrationSuccessMessage =
  'Your Stewardly account was created successfully. You can now sign in and start organizing your financial life.'
const inputClassName =
  'login-input mt-2 min-h-12 w-full rounded-lg border border-brand-border bg-brand-background/70 px-4 py-3 text-sm text-brand-text-strong outline-none transition placeholder:text-brand-text-muted focus:border-brand-primary focus:bg-brand-surface focus:ring-2 focus:ring-brand-primary/20'

const visualContent: Record<AuthMode, VisualContent> = {
  login: {
    eyebrow: 'Stewardly',
    headline: 'Welcome back to your calmer money space.',
    description:
      'Review your income, expenses, categories and commitments with clarity — without the noise of complex spreadsheets.',
    focusLabel: 'Current focus',
    focusValue: 'Clarity',
    progressLabel: 'Monthly focus',
    progressValue: 'Financial peace',
  },
  register: {
    eyebrow: 'Get started',
    headline: 'Start organizing your money with clarity.',
    description:
      'Create your account, set your first categories and take the first step toward a calmer financial life.',
    focusLabel: 'First step',
    focusValue: 'Create your account',
    progressLabel: 'Your foundation',
    progressValue: 'A calmer start',
  },
}

function VisualPanel({ mode }: { mode: AuthMode }) {
  const content = visualContent[mode]

  return (
    <div className="auth-panel-content relative flex h-full flex-col justify-between" key={`visual-${mode}`}>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-primary-dark">
          {content.eyebrow}
        </p>
        <h1 className="mt-4 max-w-lg text-3xl font-bold leading-tight text-brand-text-strong sm:text-4xl lg:text-[2.75rem]">
          {content.headline}
        </h1>
        <p className="mt-5 max-w-lg text-sm leading-7 text-brand-text sm:text-base">
          {content.description}
        </p>
      </div>

      <div className="mt-8 lg:mt-12">
        <div className="login-focus-card max-w-md rounded-xl border border-brand-border bg-brand-surface/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-text-muted">
                {content.focusLabel}
              </p>
              <p className="mt-2 break-words text-2xl font-bold text-brand-text-strong">
                {content.focusValue}
              </p>
            </div>
            <div
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-brand-gold/30 bg-brand-gold-soft"
            >
              <span className="h-4 w-4 rounded-full border-[5px] border-brand-gold" />
            </div>
          </div>

          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-brand-surface-muted">
            <div className="relative h-full w-3/4 rounded-full bg-brand-primary">
              <span className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-brand-surface bg-brand-gold" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 text-xs font-semibold text-brand-text-muted">
            <span>{content.progressLabel}</span>
            <span className="text-right text-brand-primary-dark">
              {content.progressValue}
            </span>
          </div>
        </div>

        <p className="mt-6 text-sm font-semibold text-brand-text">
          Manage the little.{' '}
          <span className="text-brand-primary-dark">Prepare for more.</span>
        </p>
      </div>
    </div>
  )
}

function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const mode: AuthMode =
    location.pathname === '/register' ? 'register' : 'login'
  const isRegister = mode === 'register'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [registerFeedback, setRegisterFeedback] =
    useState<RegisterFeedback | null>(null)
  const isSubmitting = isRegister ? isRegistering : isSigningIn

  const closeRegisterFeedback = useCallback(() => {
    setRegisterFeedback(null)
  }, [])

  const handleRegisterFeedbackAction = useCallback(() => {
    if (registerFeedback?.type === 'success') {
      setRegisterFeedback(null)
      navigate('/login', { replace: true })
      return
    }

    setRegisterFeedback(null)
  }, [navigate, registerFeedback?.type])

  function validateForm(): string | null {
    if (isRegister && !name.trim()) {
      return 'Name is required.'
    }

    if (!email.trim()) {
      return 'Email is required.'
    }

    if (!emailPattern.test(email.trim())) {
      return 'Enter a valid email address.'
    }

    if (!password) {
      return 'Password is required.'
    }

    if (isRegister && password.length < 8) {
      return 'Password must have at least 8 characters.'
    }

    if (isRegister && !confirmPassword) {
      return 'Confirm your password.'
    }

    if (isRegister && password !== confirmPassword) {
      return 'Passwords do not match.'
    }

    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setError('')

    const validationMessage = validateForm()

    if (validationMessage) {
      if (isRegister) {
        setRegisterFeedback({
          type: 'error',
          title: 'We could not create your account',
          message: validationMessage,
        })
      } else {
        setError(validationMessage)
      }

      return
    }

    if (isRegister) {
      setIsRegistering(true)
    } else {
      setIsSigningIn(true)
    }

    try {
      if (isRegister) {
        await authService.register({
          name: name.trim(),
          email: email.trim(),
          password,
        })
        setRegisterFeedback({
          type: 'success',
          title: 'Account created successfully',
          message: registrationSuccessMessage,
        })
        return
      }

      await login({ email: email.trim(), password })
      navigate('/dashboard', { replace: true })
    } catch (caughtError) {
      const message = getApiErrorMessage(
        caughtError,
        isRegister ? registerErrorMessage : loginErrorMessage,
      )

      if (isRegister) {
        setRegisterFeedback({
          type: 'error',
          title: 'We could not create your account',
          message,
        })
      } else {
        setError(message)
      }
    } finally {
      if (isRegister) {
        setIsRegistering(false)
      } else {
        setIsSigningIn(false)
      }
    }
  }

  return (
    <main className="login-page flex min-h-dvh flex-col overflow-x-clip text-brand-text transition-colors duration-300 lg:min-h-screen">
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:min-h-screen lg:px-8">
        <header className="login-header flex min-h-16 shrink-0 items-center justify-between gap-3 py-3 sm:min-h-20 sm:py-4">
          <Link
            aria-label="Stewardly home"
            className="flex min-w-0 items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            to="/"
          >
            <BrandLogo
              className="[&_.brand-logo-tagline]:hidden sm:[&_.brand-logo-tagline]:block"
              compact
              showTagline
            />
          </Link>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <Link
              aria-label="Back to home"
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-brand-text-muted transition hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary sm:px-3 sm:text-sm"
              to="/"
            >
              <span aria-hidden="true" className="text-lg sm:hidden">
                &larr;
              </span>
              <span className="sm:hidden">Home</span>
              <span className="hidden sm:inline">Back to home</span>
            </Link>
            <ThemeToggle showLabel={false} />
          </div>
        </header>

        <div
          className={`login-card-stage relative isolate flex justify-center pb-4 pt-3 md:pb-8 md:pt-3 lg:flex-1 lg:items-center lg:pb-14 lg:pt-2 ${isRegister ? 'flex-none items-start' : 'flex-1 items-center'}`}
        >
          <section
            className="auth-shell login-shell relative z-[1] mx-auto grid w-full max-w-[420px] overflow-hidden rounded-[1.75rem] border border-brand-border/80 bg-brand-surface sm:rounded-[2rem] md:max-w-xl lg:min-h-[670px] lg:max-w-6xl"
            data-mode={mode}
          >
            <div className="auth-visual-panel login-visual relative hidden overflow-hidden border-b border-brand-border p-6 sm:p-8 lg:block lg:p-12">
              <div
                aria-hidden="true"
                className="absolute left-0 top-10 h-px w-16 bg-brand-gold/70"
              />
              <VisualPanel mode={mode} />
            </div>

            <div className="auth-form-panel login-form-panel flex items-center bg-brand-surface px-5 py-6 sm:px-6 md:px-10 md:py-12 lg:px-12">
              <div className="auth-form-content mx-auto w-full max-w-md" key={`form-${mode}`}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-primary-dark">
                    {isRegister ? 'Create account' : 'Sign in'}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-brand-text-strong md:mt-3 md:text-3xl">
                    {isRegister
                      ? 'Create your Stewardly account'
                      : 'Welcome back'}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-brand-text-muted md:mt-3">
                    {isRegister
                      ? 'Start managing your money with clarity, calm and purpose.'
                      : 'Access your Stewardly dashboard and continue organizing your financial life with calm and clarity.'}
                  </p>
                </div>

                <form className="mt-6 space-y-4 md:mt-8 md:space-y-5" noValidate onSubmit={handleSubmit}>
                  {isRegister ? (
                    <div>
                      <label
                        className="block text-sm font-semibold text-brand-text"
                        htmlFor="auth-name"
                      >
                        Name
                      </label>
                      <input
                        autoComplete="name"
                        className={inputClassName}
                        id="auth-name"
                        maxLength={150}
                        name="name"
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Your name"
                        required
                        type="text"
                        value={name}
                      />
                    </div>
                  ) : null}

                  <div>
                    <label
                      className="block text-sm font-semibold text-brand-text"
                      htmlFor="auth-email"
                    >
                      Email
                    </label>
                    <input
                      autoComplete="email"
                      className={inputClassName}
                      id="auth-email"
                      maxLength={255}
                      name="email"
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      required
                      type="email"
                      value={email}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold text-brand-text"
                      htmlFor="auth-password"
                    >
                      Password
                    </label>
                    <input
                      autoComplete={isRegister ? 'new-password' : 'current-password'}
                      className={inputClassName}
                      id="auth-password"
                      minLength={isRegister ? 8 : undefined}
                      name="password"
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder={isRegister ? 'At least 8 characters' : 'Enter your password'}
                      required
                      type="password"
                      value={password}
                    />
                  </div>

                  {isRegister ? (
                    <div>
                      <label
                        className="block text-sm font-semibold text-brand-text"
                        htmlFor="auth-confirm-password"
                      >
                        Confirm password
                      </label>
                      <input
                        autoComplete="new-password"
                        className={inputClassName}
                        id="auth-confirm-password"
                        minLength={8}
                        name="confirmPassword"
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Enter your password again"
                        required
                        type="password"
                        value={confirmPassword}
                      />
                    </div>
                  ) : null}

                  {error ? (
                    <div
                      aria-live="polite"
                      className="rounded-lg border border-brand-error/30 bg-brand-error-soft px-4 py-3"
                      role="alert"
                    >
                      <p className="text-sm font-semibold text-brand-error">
                        {error}
                      </p>
                    </div>
                  ) : null}

                  <button
                    className="min-h-12 w-full rounded-lg bg-brand-primary px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(59,170,114,0.24)] transition hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-brand-surface disabled:cursor-not-allowed disabled:bg-brand-border-strong disabled:text-brand-text-muted disabled:shadow-none"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting
                      ? isRegister
                        ? 'Creating account...'
                        : 'Signing in...'
                      : isRegister
                        ? 'Create account'
                        : 'Sign in'}
                  </button>
                </form>

                <p className="mt-5 text-center text-sm text-brand-text-muted md:mt-6">
                  {isRegister
                    ? 'Already have an account? '
                    : 'New to Stewardly? '}
                  <Link
                    className="font-bold text-brand-primary-dark transition hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    to={isRegister ? '/login' : '/register'}
                  >
                    {isRegister ? 'Sign in' : 'Get started'}
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>

        <footer className="flex w-full shrink-0 flex-col items-center gap-1.5 border-t border-brand-border/40 py-3 text-center text-[0.6875rem] text-brand-text-muted sm:flex-row sm:justify-between sm:gap-2 sm:py-4 sm:text-left sm:text-xs md:gap-4 lg:border-brand-border/80 lg:py-6">
          <p className="min-w-0 leading-5 md:leading-6">
            © 2026 Stewardly.
            <span className="hidden lg:inline">
              {' '}
              Manage the little. Prepare for more.
            </span>
          </p>
          <nav
            aria-label="Authentication footer navigation"
            className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 sm:justify-start md:gap-x-5 md:gap-y-3"
          >
            <Link
              className="font-semibold transition hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              to="/"
            >
              Home
            </Link>
            <span aria-hidden="true" className="text-brand-border-strong md:hidden">
              &middot;
            </span>
            <Link
              className="font-semibold transition hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              to="/#privacy"
            >
              Privacy
            </Link>
            <span aria-hidden="true" className="text-brand-border-strong md:hidden">
              &middot;
            </span>
            <Link
              className="font-semibold transition hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              to="/#terms"
            >
              Terms
            </Link>
          </nav>
        </footer>
      </div>

      {registerFeedback ? (
        <RegisterFeedbackModal
          isOpen
          message={registerFeedback.message}
          onClose={closeRegisterFeedback}
          onPrimaryAction={handleRegisterFeedbackAction}
          primaryActionLabel={
            registerFeedback.type === 'success' ? 'Sign in' : 'Try again'
          }
          title={registerFeedback.title}
          type={registerFeedback.type}
        />
      ) : null}
    </main>
  )
}

export default AuthPage
