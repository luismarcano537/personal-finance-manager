import { useState, type MouseEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ui/ThemeToggle'

const primaryCta = 'inline-flex min-h-12 items-center justify-center rounded-2xl bg-brand-primary px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(59,170,114,0.24)] transition hover:brightness-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4'
const secondaryCta = 'inline-flex min-h-12 items-center justify-center rounded-2xl border border-brand-border-strong bg-brand-surface px-6 py-3 text-sm font-bold text-brand-text-strong shadow-sm transition hover:border-brand-primary hover:bg-brand-primary-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4'
const sectionLink = 'text-sm font-semibold text-brand-text-muted transition hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'
const mobileSectionLink = 'flex min-h-12 items-center rounded-xl px-4 text-sm font-semibold text-brand-text transition hover:bg-brand-primary-soft hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'
const sectionScrollOffset = 88
let activeScrollAnimation: number | null = null

type SectionLinkProps = {
  children: ReactNode
  className?: string
  onNavigate?: () => void
  sectionId: string
}

function easeInOutCubic(progress: number): number {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2
}

function animateToSection(section: HTMLElement, sectionId: string): void {
  const startPosition = window.scrollY
  const targetPosition = Math.max(
    section.getBoundingClientRect().top + startPosition - sectionScrollOffset,
    0,
  )
  const distance = targetPosition - startPosition

  if (activeScrollAnimation !== null) {
    window.cancelAnimationFrame(activeScrollAnimation)
  }

  const updateUrl = (): void => {
    const url = `/#${sectionId}`

    if (window.location.hash === `#${sectionId}`) {
      window.history.replaceState(null, '', url)
      return
    }

    window.history.pushState(null, '', url)
  }

  if (Math.abs(distance) < 1) {
    window.scrollTo(0, targetPosition)
    updateUrl()
    return
  }

  const duration = Math.min(1100, Math.max(650, Math.abs(distance) * 0.35))
  const startTime = performance.now()

  const animate = (currentTime: number): void => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easeInOutCubic(progress)

    window.scrollTo(0, startPosition + distance * easedProgress)

    if (progress < 1) {
      activeScrollAnimation = window.requestAnimationFrame(animate)
      return
    }

    activeScrollAnimation = null
    updateUrl()
  }

  activeScrollAnimation = window.requestAnimationFrame(animate)
}

function SectionLink({
  children,
  className = sectionLink,
  onNavigate,
  sectionId,
}: SectionLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    const section = document.getElementById(sectionId)

    if (!section) {
      return
    }

    event.preventDefault()
    onNavigate?.()
    animateToSection(section, sectionId)
  }

  return (
    <Link
      className={className}
      onClick={handleClick}
      to={`/#${sectionId}`}
    >
      {children}
    </Link>
  )
}

function Brand() {
  return (
    <span className="flex items-center gap-2.5">
      <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary text-sm font-bold text-white shadow-[0_8px_20px_rgba(59,170,114,0.22)]">S</span>
      <span className="text-lg font-bold text-brand-text-strong">Stewardly</span>
    </span>
  )
}

function ProductMockups() {
  const categoryItems = [
    { name: 'Home', value: '42%', color: 'bg-brand-primary' },
    { name: 'Food', value: '28%', color: 'bg-brand-gold' },
    { name: 'Transport', value: '18%', color: 'bg-[#7DA1A6]' },
  ]
  const commitments = [
    { name: 'Rent', date: 'Today', color: 'bg-brand-gold-soft' },
    { name: 'Electricity', date: 'Jul 21', color: 'bg-brand-primary-soft' },
    { name: 'Internet', date: 'Jul 24', color: 'bg-brand-surface-muted' },
  ]

  return (
    <div className="relative mx-auto mt-12 h-[355px] w-full max-w-4xl sm:h-[455px] lg:h-[500px]">
      <div className="absolute inset-x-8 bottom-0 h-20 rounded-[50%] bg-brand-primary-soft/70 blur-2xl" />
      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-end justify-center">
        <div aria-label="Categories interface preview" className="h-[255px] w-[142px] translate-x-8 translate-y-7 -rotate-3 rounded-[2rem] border-[5px] border-[var(--landing-device-frame)] bg-brand-surface p-3 shadow-[0_24px_55px_rgba(31,41,51,0.16)] sm:h-[330px] sm:w-[184px] sm:translate-x-4 lg:h-[365px] lg:w-[202px] lg:translate-x-0" role="img">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-brand-border-strong" />
          <p className="mt-5 text-[8px] font-semibold text-brand-text-muted">EXPENSES</p>
          <p className="mt-1 text-sm font-bold text-brand-text-strong">Categories</p>
          <div className="mt-4 space-y-2">
            {categoryItems.map((item) => (
              <div className="rounded-xl border border-brand-border bg-brand-background p-2.5" key={item.name}>
                <div className="flex justify-between gap-2 text-[8px]"><span className="font-semibold">{item.name}</span><span className="text-brand-text-muted">{item.value}</span></div>
                <div className="mt-2 h-1 rounded-full bg-brand-border"><div className={`h-full w-2/3 rounded-full ${item.color}`} /></div>
              </div>
            ))}
          </div>
        </div>

        <div aria-label="Financial health dashboard interface preview" className="z-10 -mx-10 h-[305px] w-[170px] rounded-[2rem] border-[5px] border-[var(--landing-device-frame)] bg-brand-surface p-3 shadow-[0_24px_55px_rgba(31,41,51,0.2)] sm:-mx-6 sm:h-[400px] sm:w-[224px] lg:-mx-3 lg:h-[450px] lg:w-[252px]" role="img">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-brand-border-strong" />
          <div className="mt-4 flex justify-between"><span className="text-[9px] font-bold">Stewardly</span><span className="h-5 w-5 rounded-lg bg-brand-primary-soft" /></div>
          <p className="mt-4 text-[8px] font-semibold text-brand-text-muted">JULY OVERVIEW</p>
          <p className="mt-1 text-base font-bold text-brand-text-strong sm:text-lg">Financial health</p>
          <div className="mt-3 rounded-2xl bg-brand-primary-soft p-3 sm:p-4">
            <div className="flex items-end justify-between gap-2"><div><p className="text-[8px] font-semibold text-brand-primary-dark">Monthly balance</p><p className="mt-1 text-base font-bold sm:text-lg">$1,280</p></div><span className="rounded-lg bg-brand-surface px-2 py-1 text-[8px] font-bold text-brand-primary-dark">+12%</span></div>
            <div className="mt-4 flex h-10 items-end gap-1 sm:h-14">
              {[35, 55, 44, 75, 62, 88, 72].map((height, index) => <span className={index === 5 ? 'flex-1 rounded-t bg-brand-primary' : 'flex-1 rounded-t bg-brand-primary/25'} key={height} style={{ height: `${height}%` }} />)}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-brand-border p-2.5"><p className="text-[7px] text-brand-text-muted">Income</p><p className="mt-1 text-[10px] font-bold text-brand-primary-dark">$3,450</p></div>
            <div className="rounded-xl border border-brand-border p-2.5"><p className="text-[7px] text-brand-text-muted">Expenses</p><p className="mt-1 text-[10px] font-bold">$2,170</p></div>
          </div>
        </div>

        <div aria-label="Commitments calendar interface preview" className="h-[255px] w-[142px] -translate-x-8 translate-y-7 rotate-3 rounded-[2rem] border-[5px] border-[var(--landing-device-frame)] bg-brand-surface p-3 shadow-[0_24px_55px_rgba(31,41,51,0.16)] sm:h-[330px] sm:w-[184px] sm:-translate-x-4 lg:h-[365px] lg:w-[202px] lg:translate-x-0" role="img">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-brand-border-strong" />
          <p className="mt-5 text-[8px] font-semibold text-brand-text-muted">UPCOMING</p>
          <p className="mt-1 text-sm font-bold text-brand-text-strong">Commitments</p>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[7px] text-brand-text-muted">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}{[14, 15, 16, 17, 18, 19, 20].map((day) => <span className={day === 17 ? 'rounded-md bg-brand-primary py-1 text-white' : 'py-1 text-brand-text'} key={day}>{day}</span>)}</div>
          <div className="mt-4 space-y-2">{commitments.map((item) => <div className={`flex justify-between gap-2 rounded-xl p-2.5 ${item.color}`} key={item.name}><span className="text-[8px] font-semibold">{item.name}</span><span className="text-[7px] text-brand-text-muted">{item.date}</span></div>)}</div>
        </div>
      </div>
    </div>
  )
}

function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const whyCards = [
    { eyebrow: 'See clearly', title: 'Clarity over confusion', text: 'See where your money goes without fighting complex spreadsheets.' },
    { eyebrow: 'Think calmly', title: 'Calm by design', text: 'A clean experience built to help you think, not overwhelm you.' },
    { eyebrow: 'Move with purpose', title: 'Purposeful organization', text: 'Manage what you have today so you can make better decisions tomorrow.' },
  ]
  const steps = [
    { title: 'Create your categories', text: 'Separate your income and expenses into simple categories that match your real life.' },
    { title: 'Register your transactions', text: 'Add what comes in and what goes out, then understand your monthly balance clearly.' },
    { title: 'Track commitments', text: 'Prepare for upcoming bills and recurring financial responsibilities before they become stress.' },
    { title: 'Follow your progress', text: 'Use clean cards and summaries to see your financial life with more peace and confidence.' },
  ]
  const benefits = ['Know what you earn.', 'Understand what you spend.', 'Prepare for what is coming.', 'Build better habits step by step.']

  return (
    <div className="min-h-screen overflow-x-clip bg-brand-background text-brand-text transition-colors duration-300">
      <header className="sticky top-0 z-40 border-b border-brand-border/80 bg-brand-background/95 shadow-[0_8px_24px_rgba(31,41,51,0.06)] backdrop-blur-md">
        <nav aria-label="Public navigation" className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <Link aria-label="Stewardly home" className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary" to="/"><Brand /></Link>

          <div className="hidden items-center gap-8 md:flex">
            <SectionLink sectionId="why-stewardly">Why Stewardly</SectionLink>
            <SectionLink sectionId="how-it-works">How it works</SectionLink>
            <SectionLink sectionId="benefits">Benefits</SectionLink>
          </div>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <ThemeToggle />
            <Link className="inline-flex min-h-11 items-center px-3 text-sm font-bold hover:text-brand-primary-dark" to="/login">Sign in</Link>
            <Link className="inline-flex min-h-11 items-center rounded-xl bg-brand-primary px-4 text-sm font-bold text-white hover:brightness-90" to="/login">Get started</Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <Link className="inline-flex min-h-11 items-center rounded-xl bg-brand-primary px-3 text-sm font-bold text-white transition hover:brightness-90" to="/login">Get started</Link>
            <button
              aria-controls="mobile-navigation"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-border-strong bg-brand-surface text-brand-text-strong transition hover:border-brand-primary hover:bg-brand-primary-soft hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
              type="button"
            >
              <span aria-hidden="true" className="relative block h-4 w-5">
                <span className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition duration-200 ${isMobileMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
                <span className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition duration-200 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition duration-200 ${isMobileMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </nav>

        {isMobileMenuOpen ? (
          <div className="absolute inset-x-0 top-full border-b border-brand-border bg-brand-surface shadow-[0_18px_40px_rgba(31,41,51,0.12)] md:hidden">
            <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl px-4 py-4 sm:px-6" id="mobile-navigation">
              <div className="mb-3 flex min-h-12 items-center justify-between gap-4 rounded-xl bg-brand-background px-4">
                <span className="text-sm font-semibold text-brand-text">Appearance</span>
                <ThemeToggle />
              </div>
              <div className="flex flex-col gap-1">
                <SectionLink className={mobileSectionLink} onNavigate={() => setIsMobileMenuOpen(false)} sectionId="why-stewardly">Why Stewardly</SectionLink>
                <SectionLink className={mobileSectionLink} onNavigate={() => setIsMobileMenuOpen(false)} sectionId="how-it-works">How it works</SectionLink>
                <SectionLink className={mobileSectionLink} onNavigate={() => setIsMobileMenuOpen(false)} sectionId="benefits">Benefits</SectionLink>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-brand-border pt-4">
                <Link className={secondaryCta} onClick={() => setIsMobileMenuOpen(false)} to="/login">Sign in</Link>
                <Link className={primaryCta} onClick={() => setIsMobileMenuOpen(false)} to="/login">Get started</Link>
              </div>
            </nav>
          </div>
        ) : null}
      </header>

      <main>
        <section className="px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-18 lg:px-8 lg:pt-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-normal text-brand-primary-dark">Personal finance, thoughtfully organized</p>
            <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight text-brand-text-strong sm:text-5xl lg:text-6xl">Manage your money with clarity, calm and purpose.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-brand-text-muted sm:text-lg">Stewardly helps you organize income, expenses and financial commitments without the noise of complex spreadsheets or overwhelming finance apps.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link className={primaryCta} to="/login">Get started</Link><Link className={secondaryCta} to="/login">Sign in</Link></div>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-brand-text-muted">Start simple. Create your categories, register your transactions and understand where your money is going.</p>
          </div>
          <ProductMockups />
        </section>

        <section className="scroll-mt-8 border-y border-brand-border bg-brand-surface px-4 py-20 sm:px-6 lg:px-8 lg:py-24" id="why-stewardly">
          <div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-normal text-brand-gold">A calmer approach</p><h2 className="mt-3 text-3xl font-bold text-brand-text-strong sm:text-4xl">Why Stewardly?</h2><p className="mt-5 text-base leading-8 text-brand-text-muted sm:text-lg">Because managing money should not feel confusing, noisy or stressful.</p></div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">{whyCards.map((card) => <article className="rounded-3xl border border-brand-border bg-brand-surface p-6 shadow-[0_18px_45px_rgba(31,41,51,0.05)] sm:p-7" key={card.title}><p className="text-xs font-bold uppercase tracking-normal text-brand-primary-dark">{card.eyebrow}</p><h3 className="mt-3 text-xl font-bold text-brand-text-strong">{card.title}</h3><p className="mt-3 text-sm leading-7 text-brand-text-muted">{card.text}</p></article>)}</div>
          </div>
        </section>

        <section className="scroll-mt-8 px-4 py-20 sm:px-6 lg:px-8 lg:py-24" id="how-it-works">
          <div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-normal text-brand-primary-dark">How it works</p><h2 className="mt-3 text-3xl font-bold text-brand-text-strong sm:text-4xl">Start organizing in a few simple steps</h2></div>
            <div className="mt-12 grid sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-4">{steps.map((step, index) => <article className="border-t border-brand-border py-6 sm:border-l sm:border-t-0 sm:px-5 sm:py-0" key={step.title}><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary-soft text-sm font-bold text-brand-primary-dark">{String(index + 1).padStart(2, '0')}</span><h3 className="mt-5 text-lg font-bold text-brand-text-strong">{step.title}</h3><p className="mt-3 text-sm leading-7 text-brand-text-muted">{step.text}</p></article>)}</div>
          </div>
        </section>

        <section className="scroll-mt-8 bg-brand-primary-soft px-4 py-20 sm:px-6 lg:px-8 lg:py-24" id="benefits">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-normal text-brand-primary-dark">Built for everyday life</p><h2 className="mt-3 text-3xl font-bold text-brand-text-strong sm:text-4xl">Less financial noise. More peace to decide.</h2><p className="mt-6 text-base leading-8 sm:text-lg">Stewardly is designed for people who want to stop guessing, stop depending on messy notes, and start building a calmer relationship with money.</p></div>
            <ul className="grid gap-3 sm:grid-cols-2">{benefits.map((benefit) => <li className="flex min-h-28 items-start gap-3 rounded-2xl border border-brand-primary/20 bg-brand-surface p-5 shadow-sm" key={benefit}><span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">✓</span><span className="font-bold leading-6 text-brand-text-strong">{benefit}</span></li>)}</ul>
          </div>
        </section>

        <section className="scroll-mt-8 border-b border-brand-border bg-brand-surface px-4 py-20 sm:px-6 lg:px-8 lg:py-24" id="privacy">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr]"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-normal text-brand-gold">Trust and privacy</p><h2 className="mt-3 text-3xl font-bold text-brand-text-strong sm:text-4xl">Built for calm and responsible organization.</h2><p className="mt-6 text-base leading-8 text-brand-text-muted sm:text-lg">Your financial organization should feel private, simple and under your control. Stewardly is being built with clarity, privacy and responsible money management in mind.</p></div>
            <div className="grid gap-4 sm:grid-cols-2"><article className="rounded-3xl border border-brand-border bg-brand-background p-6"><h3 className="text-sm font-bold text-brand-text-strong">Private by principle</h3><p className="mt-3 text-sm leading-6 text-brand-text-muted">Your financial records belong to your personal organization.</p></article><article className="rounded-3xl border border-brand-border bg-brand-background p-6" id="terms"><h3 className="text-sm font-bold text-brand-text-strong">Clear by design</h3><p className="mt-3 text-sm leading-6 text-brand-text-muted">Simple language and focused tools keep you in control.</p></article></div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24"><div className="mx-auto max-w-5xl rounded-3xl border border-brand-primary/20 bg-[var(--landing-contrast-surface)] px-6 py-12 text-center shadow-[0_24px_70px_rgba(31,41,51,0.14)] sm:px-10 sm:py-16"><p className="text-sm font-bold uppercase tracking-normal text-brand-gold">A simple first step</p><h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold text-white sm:text-4xl">Start with what you have today.</h2><p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#D8DFE3]">You do not need a complicated system to begin. Stewardly helps you take the first step with clarity.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link className={primaryCta} to="/login">Get started</Link><Link className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10" to="/login">Sign in</Link></div></div></section>
      </main>

      <footer className="border-t border-brand-border bg-brand-surface px-4 py-12 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-col gap-10 lg:flex-row lg:justify-between"><div><Link className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary" to="/"><Brand /></Link><p className="mt-4 text-sm font-semibold">Manage the little. Prepare for more.</p></div><nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3"><SectionLink sectionId="why-stewardly">Why Stewardly</SectionLink><SectionLink sectionId="how-it-works">How it works</SectionLink><SectionLink sectionId="benefits">Benefits</SectionLink><SectionLink sectionId="privacy">Privacy</SectionLink><SectionLink sectionId="terms">Terms</SectionLink><Link className={sectionLink} to="/login">Sign in</Link></nav></div><p className="mt-10 border-t border-brand-border pt-6 text-xs leading-6 text-brand-text-muted">© 2026 Stewardly. Built to help people manage money with clarity, calm and purpose.</p></div></footer>
    </div>
  )
}

export default LandingPage
