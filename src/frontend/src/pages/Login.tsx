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
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Login</h1>
          <p className="mt-3 text-sm text-slate-300">
            Acesse sua conta para continuar.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-sm font-medium text-slate-200"
              htmlFor="email"
            >
              Email
            </label>
            <input
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400"
              id="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-slate-200"
              htmlFor="password"
            >
              Senha
            </label>
            <input
              autoComplete="current-password"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400"
              id="password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </div>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          <button
            className="w-full rounded-lg bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default Login
