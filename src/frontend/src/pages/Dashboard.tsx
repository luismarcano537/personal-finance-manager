function Dashboard() {
  return (
    <section className="max-w-4xl">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
          Your authenticated workspace is ready. Financial summaries and charts
          will appear here in upcoming cards.
        </p>
      </div>
    </section>
  )
}

export default Dashboard
