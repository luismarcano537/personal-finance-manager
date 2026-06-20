import { useAuth } from '../hooks/useAuth'

function Dashboard() {
  const { logout, user } = useAuth()

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <section className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl sm:p-12">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Dashboard
        </h1>
        <p className="mt-4 text-base text-emerald-400 sm:text-lg">
          Bem-vindo{user ? `, ${user.name}` : ''}.
        </p>
        <button
          className="mt-8 rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-400 hover:text-emerald-300"
          onClick={logout}
          type="button"
        >
          Sair
        </button>
      </section>
    </main>
  )
}

export default Dashboard
