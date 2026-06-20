import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

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
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAF7] px-4 py-8 text-[#374151] sm:px-6 lg:px-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_24px_70px_rgba(31,41,51,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden bg-[#EAF7F0] p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-[#2F855A]">
              Finance Manager
            </p>
            <h1 className="mt-4 max-w-sm text-4xl font-bold leading-tight text-[#1F2933]">
              Personal finance with a calmer monthly view.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-[#374151]">
              Track income, expenses, balance, and transactions in one clean
              workspace built for everyday financial decisions.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-[#E5E7EB] bg-white/85 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-[#6B7280]">
                  Current focus
                </p>
                <p className="mt-2 text-2xl font-bold text-[#1F2933]">
                  Prosperity
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FBF4E8] text-2xl font-bold text-[#CF9F57]">
                $
              </div>
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#F1F5F2]">
              <div className="h-full w-3/4 rounded-full bg-[#3BAA72]" />
            </div>
          </div>
        </div>

        <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-[#2F855A]">
              Personal Finance Manager
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#1F2933]">
              Sign in to your account
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#6B7280]">
              Access your dashboard to review your month, categories, and
              financial position.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-sm font-semibold text-[#374151]"
                htmlFor="email"
              >
                Email
              </label>
              <input
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1F2933] outline-none transition placeholder:text-[#6B7280] focus:border-[#3BAA72] focus:ring-2 focus:ring-[#3BAA72]/20"
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
                className="block text-sm font-semibold text-[#374151]"
                htmlFor="password"
              >
                Senha
              </label>
              <input
                autoComplete="current-password"
                className="mt-2 w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1F2933] outline-none transition placeholder:text-[#6B7280] focus:border-[#3BAA72] focus:ring-2 focus:ring-[#3BAA72]/20"
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
              <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3">
                <p className="text-sm font-semibold text-[#DC2626]">{error}</p>
              </div>
            ) : null}

            <button
              className="w-full rounded-2xl bg-[#3BAA72] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(59,170,114,0.28)] transition hover:bg-[#2F855A] focus:outline-none focus:ring-2 focus:ring-[#3BAA72] focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:bg-[#D1D5DB] disabled:text-[#6B7280] disabled:shadow-none"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Login
