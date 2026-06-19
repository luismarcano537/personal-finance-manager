function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
        <h1 className="text-3xl font-bold text-white">Página não encontrada</h1>
        <p className="mt-3 text-sm text-slate-300">
          A rota informada ainda não existe.
        </p>
      </section>
    </main>
  )
}

export default NotFound
