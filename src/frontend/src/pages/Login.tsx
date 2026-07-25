import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandLogo from '../components/ui/BrandLogo'
import ThemeToggle from '../components/ui/ThemeToggle'
import { useAuth } from '../hooks/useAuth'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'

const loginErrorMessage =
  'Unable to sign in. Please check your email and password.'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }

    setLoading(true)

    try {
      await login({ email, password })
      navigate('/dashboard', { replace: true })
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError, loginErrorMessage))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page min-h-screen overflow-x-clip text-brand-text transition-colors duration-300">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <header className="login-header flex min-h-20 items-center justify-between gap-3 py-4">
          <Link
            aria-label="Stewardly home"
            className="flex min-w-0 items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            to="/"
          >
            <BrandLogo className="[&_.brand-logo-tagline]:hidden sm:[&_.brand-logo-tagline]:block" compact showTagline />
          </Link>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <Link
              className="inline-flex min-h-10 items-center px-2 text-xs font-semibold text-brand-text-muted transition hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary sm:px-3 sm:text-sm"
              to="/"
            >
              Back to home
            </Link>
            <ThemeToggle showLabel={false} />
          </div>
        </header>

        <div className="login-card-stage relative isolate flex flex-1 items-center justify-center pb-8 pt-2 sm:pb-10 lg:pb-14">
          <section className="login-shell relative z-[1] grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-brand-border/80 bg-brand-surface lg:min-h-[610px] lg:grid-cols-[1.04fr_0.96fr]">
            <div className="login-visual relative overflow-hidden rounded-t-[calc(2rem-1px)] border-b border-brand-border p-6 lg:rounded-l-[calc(2rem-1px)] lg:rounded-tr-none sm:p-8 lg:border-b-0 lg:border-r lg:p-12">
              <div
                aria-hidden="true"
                className="absolute left-0 top-10 h-px w-16 bg-brand-gold/70"
              />

              <div className="login-panel-enter relative flex h-full flex-col justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-primary-dark">
                    Stewardly
                  </p>
                  <h1 className="mt-4 max-w-lg text-3xl font-bold leading-tight text-brand-text-strong sm:text-4xl lg:text-[2.75rem]">
                    Welcome back to your calmer money space.
                  </h1>
                  <p className="mt-5 max-w-lg text-sm leading-7 text-brand-text sm:text-base">
                    Review your income, expenses, categories and commitments
                    with clarity &mdash; without the noise of complex
                    spreadsheets.
                  </p>
                </div>

                <div className="mt-8 lg:mt-12">
                  <div className="login-focus-card max-w-md rounded-lg border border-brand-border bg-brand-surface/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-text-muted">
                          Current focus
                        </p>
                        <p className="mt-2 text-2xl font-bold text-brand-text-strong">
                          Clarity
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
                      <span>Monthly focus</span>
                      <span className="text-brand-primary-dark">
                        Financial peace
                      </span>
                    </div>
                  </div>

                  <p className="mt-6 text-sm font-semibold text-brand-text">
                    Manage the little.{' '}
                    <span className="text-brand-primary-dark">
                      Prepare for more.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="login-form-enter login-form-panel flex items-center rounded-b-[calc(2rem-1px)] bg-brand-surface px-5 lg:rounded-r-[calc(2rem-1px)] lg:rounded-bl-none py-8 sm:px-10 sm:py-12 lg:px-12">
              <div className="mx-auto w-full max-w-md">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-primary-dark">
                    Sign in
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-brand-text-strong">
                    Welcome back
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-brand-text-muted">
                    Access your Stewardly dashboard and continue organizing your
                    financial life with calm and clarity.
                  </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label
                      className="block text-sm font-semibold text-brand-text"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      autoComplete="email"
                      className="login-input mt-2 min-h-12 w-full rounded-lg border border-brand-border bg-brand-background/70 px-4 py-3 text-sm text-brand-text-strong outline-none transition placeholder:text-brand-text-muted focus:border-brand-primary focus:bg-brand-surface focus:ring-2 focus:ring-brand-primary/20"
                      id="email"
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
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      autoComplete="current-password"
                      className="login-input mt-2 min-h-12 w-full rounded-lg border border-brand-border bg-brand-background/70 px-4 py-3 text-sm text-brand-text-strong outline-none transition placeholder:text-brand-text-muted focus:border-brand-primary focus:bg-brand-surface focus:ring-2 focus:ring-brand-primary/20"
                      id="password"
                      name="password"
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      required
                      type="password"
                      value={password}
                    />
                  </div>

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
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-brand-text-muted">
                  New to Stewardly?{' '}
                  <Link
                    className="font-bold text-brand-primary-dark transition hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    to="/login"
                  >
                    Get started
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>

        <footer className="flex w-full flex-col gap-4 border-t border-brand-border/80 py-6 text-xs text-brand-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="min-w-0 leading-6">
            © 2026 Stewardly. Manage the little. Prepare for more.
          </p>
          <nav
            aria-label="Login footer navigation"
            className="flex flex-wrap items-center gap-x-5 gap-y-3"
          >
            <Link
              className="font-semibold transition hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              to="/"
            >
              Home
            </Link>
            <Link
              className="font-semibold transition hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              to="/#privacy"
            >
              Privacy
            </Link>
            <Link
              className="font-semibold transition hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              to="/#terms"
            >
              Terms
            </Link>
          </nav>
        </footer>
      </div>
    </main>
  )
}

export default Login
