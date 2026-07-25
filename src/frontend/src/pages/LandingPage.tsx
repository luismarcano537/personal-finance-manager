import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '../components/ui/BrandLogo'
import ThemeToggle from '../components/ui/ThemeToggle'

const primaryCta =
  'inline-flex min-h-12 items-center justify-center rounded-2xl bg-brand-primary px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(59,170,114,0.24)] transition hover:brightness-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4'
const secondaryCta =
  'inline-flex min-h-12 items-center justify-center rounded-2xl border border-brand-border-strong bg-brand-surface px-6 py-3 text-sm font-bold text-brand-text-strong shadow-sm transition hover:border-brand-primary hover:bg-brand-primary-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4'
const sectionLink =
  'text-sm font-semibold text-brand-text-muted transition hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'
const mobileSectionLink =
  'flex min-h-12 items-center rounded-xl px-4 text-sm font-semibold text-brand-text transition hover:bg-brand-primary-soft hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'
const sectionScrollOffset = 88

let activeScrollAnimation: number | null = null

type SectionLinkProps = {
  children: ReactNode
  className?: string
  onNavigate?: () => void
  sectionId: string
}

type RevealVariant =
  | 'blur-in'
  | 'fade-left'
  | 'fade-right'
  | 'fade-up'
  | 'scale-up'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  variant?: RevealVariant
}

type WhyIconType = 'clarity' | 'calm' | 'purpose'

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
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

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

  if (prefersReducedMotion || Math.abs(distance) < 1) {
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

function Reveal({
  children,
  className = '',
  delay = 0,
  variant = 'fade-up',
}: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const element = elementRef.current

    if (!element || isVisible) {
      return
    }

    if (typeof IntersectionObserver === 'undefined') {
      const frameId = window.requestAnimationFrame(() => setIsVisible(true))
      return () => window.cancelAnimationFrame(frameId)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [isVisible])

  return (
    <div
      className={`landing-reveal landing-reveal-${variant} ${isVisible ? 'landing-reveal-visible' : ''} ${className}`}
      ref={elementRef}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function WhyIcon({ type }: { type: WhyIconType }) {
  if (type === 'clarity') {
    return (
      <span aria-hidden="true" className="flex h-11 w-11 flex-col justify-center gap-1.5 rounded-2xl bg-brand-primary-soft px-3">
        <span className="h-0.5 w-full rounded-full bg-brand-primary" />
        <span className="h-0.5 w-3/4 rounded-full bg-brand-primary/70" />
        <span className="h-0.5 w-1/2 rounded-full bg-brand-gold" />
      </span>
    )
  }

  if (type === 'calm') {
    return (
      <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gold-soft">
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-gold/70">
          <span className="h-2 w-2 rounded-full bg-brand-gold" />
        </span>
      </span>
    )
  }

  return (
    <span aria-hidden="true" className="grid h-11 w-11 grid-cols-2 gap-1 rounded-2xl bg-brand-primary-soft p-2.5">
      <span className="rounded-sm bg-brand-primary" />
      <span className="rounded-sm bg-brand-gold" />
      <span className="rounded-sm bg-brand-primary/45" />
      <span className="rounded-sm bg-brand-primary-dark" />
    </span>
  )
}

type ProductMockupsProps = {
  parallaxRef: RefObject<HTMLDivElement | null>
}

function ProductMockups({ parallaxRef }: ProductMockupsProps) {
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
    <div className="landing-parallax-stage relative mx-auto mt-10 h-[350px] w-full max-w-4xl sm:h-[445px] lg:mt-12 lg:h-[490px]" ref={parallaxRef}>
      <div className="landing-mockup-glow absolute inset-x-[10%] bottom-0 h-[82%]" />

      <span className="landing-floating-label landing-hero-label landing-hero-label-1 absolute left-1/2 top-0 z-20 -translate-x-1/2">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
        Monthly clarity
      </span>
      <span className="landing-floating-label landing-hero-label landing-hero-label-2 absolute left-2 top-20 z-20 hidden sm:inline-flex lg:left-10 lg:top-28">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
        Spending categories
      </span>
      <span className="landing-floating-label landing-hero-label landing-hero-label-3 absolute right-2 top-28 z-20 hidden sm:inline-flex lg:right-10 lg:top-36">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
        Upcoming bills
      </span>

      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-end justify-center">
        <div
          aria-label="Categories interface preview"
          className="landing-phone-side landing-hero-phone-left h-[245px] w-[136px] translate-x-8 translate-y-8 -rotate-6 rounded-[2rem] border-[5px] border-[var(--landing-device-frame)] bg-brand-surface p-3 sm:h-[325px] sm:w-[180px] sm:translate-x-4 lg:h-[365px] lg:w-[202px] lg:translate-x-0"
          role="img"
        >
          <div className="mx-auto h-1.5 w-10 rounded-full bg-brand-border-strong" />
          <p className="mt-5 text-[8px] font-semibold text-brand-text-muted">EXPENSES</p>
          <p className="mt-1 text-sm font-bold text-brand-text-strong">Categories</p>
          <div className="mt-4 space-y-2">
            {categoryItems.map((item) => (
              <div className="rounded-xl border border-brand-border bg-brand-background p-2.5" key={item.name}>
                <div className="flex justify-between gap-2 text-[8px]">
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-brand-text-muted">{item.value}</span>
                </div>
                <div className="mt-2 h-1 rounded-full bg-brand-border">
                  <div className={`h-full w-2/3 rounded-full ${item.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          aria-label="Financial health dashboard interface preview"
          className="landing-phone-main landing-hero-phone-main z-10 -mx-11 h-[305px] w-[168px] rounded-[2.1rem] border-[5px] border-[var(--landing-device-frame)] bg-brand-surface p-3 sm:-mx-6 sm:h-[400px] sm:w-[224px] lg:-mx-3 lg:h-[450px] lg:w-[252px]"
          role="img"
        >
          <div className="mx-auto h-1.5 w-12 rounded-full bg-brand-border-strong" />
          <div className="mt-4 flex justify-between">
            <span className="text-[9px] font-bold text-brand-text-strong">Stewardly</span>
            <span className="h-5 w-5 rounded-lg bg-brand-primary-soft" />
          </div>
          <p className="mt-4 text-[8px] font-semibold text-brand-text-muted">JULY OVERVIEW</p>
          <p className="mt-1 text-base font-bold text-brand-text-strong sm:text-lg">Financial health</p>
          <div className="mt-3 rounded-2xl border border-brand-primary/15 bg-brand-primary-soft p-3 sm:p-4">
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-[8px] font-semibold text-brand-primary-dark">Monthly balance</p>
                <p className="mt-1 text-base font-bold text-brand-text-strong sm:text-lg">$1,280</p>
              </div>
              <span className="rounded-lg bg-brand-surface px-2 py-1 text-[8px] font-bold text-brand-primary-dark">+12%</span>
            </div>
            <div className="mt-4 flex h-10 items-end gap-1 sm:h-14">
              {[35, 55, 44, 75, 62, 88, 72].map((height, index) => (
                <span
                  className={index === 5 ? 'flex-1 rounded-t bg-brand-primary' : 'flex-1 rounded-t bg-brand-primary/25'}
                  key={height}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-brand-border bg-brand-background/70 p-2.5">
              <p className="text-[7px] text-brand-text-muted">Income</p>
              <p className="mt-1 text-[10px] font-bold text-brand-primary-dark">$3,450</p>
            </div>
            <div className="rounded-xl border border-brand-border bg-brand-background/70 p-2.5">
              <p className="text-[7px] text-brand-text-muted">Expenses</p>
              <p className="mt-1 text-[10px] font-bold text-brand-text-strong">$2,170</p>
            </div>
          </div>
        </div>

        <div
          aria-label="Commitments calendar interface preview"
          className="landing-phone-side landing-hero-phone-right h-[245px] w-[136px] -translate-x-8 translate-y-8 rotate-6 rounded-[2rem] border-[5px] border-[var(--landing-device-frame)] bg-brand-surface p-3 sm:h-[325px] sm:w-[180px] sm:-translate-x-4 lg:h-[365px] lg:w-[202px] lg:translate-x-0"
          role="img"
        >
          <div className="mx-auto h-1.5 w-10 rounded-full bg-brand-border-strong" />
          <p className="mt-5 text-[8px] font-semibold text-brand-text-muted">UPCOMING</p>
          <p className="mt-1 text-sm font-bold text-brand-text-strong">Commitments</p>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[7px] text-brand-text-muted">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
            {[14, 15, 16, 17, 18, 19, 20].map((day) => (
              <span className={day === 17 ? 'rounded-md bg-brand-primary py-1 text-white' : 'py-1 text-brand-text'} key={day}>{day}</span>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {commitments.map((item) => (
              <div className={`flex justify-between gap-2 rounded-xl p-2.5 ${item.color}`} key={item.name}>
                <span className="text-[8px] font-semibold">{item.name}</span>
                <span className="text-[7px] text-brand-text-muted">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const header = headerRef.current
    const progress = progressRef.current
    const parallax = parallaxRef.current
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (!header || !progress || !parallax) {
      return
    }

    let frameId: number | null = null

    const updateScrollEffects = (): void => {
      frameId = null
      const scrollTop = window.scrollY
      const scrollRange = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      )
      const scrollProgress = Math.min(scrollTop / scrollRange, 1)

      header.toggleAttribute('data-scrolled', scrollTop > 20)
      progress.style.transform = `scaleX(${scrollProgress})`

      if (!prefersReducedMotion) {
        const parallaxOffset = Math.min(scrollTop * 0.045, 30)
        parallax.style.setProperty(
          '--landing-parallax-y',
          `${parallaxOffset}px`,
        )
      }
    }

    const scheduleUpdate = (): void => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateScrollEffects)
      }
    }

    updateScrollEffects()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])
  const whyCards: Array<{
    accent: 'gold' | 'green'
    eyebrow: string
    icon: WhyIconType
    text: string
    title: string
  }> = [
    {
      accent: 'green',
      eyebrow: 'See clearly',
      icon: 'clarity',
      title: 'Clarity over confusion',
      text: 'See where your money goes without fighting complex spreadsheets.',
    },
    {
      accent: 'gold',
      eyebrow: 'Think calmly',
      icon: 'calm',
      title: 'Calm by design',
      text: 'A clean experience built to help you think, not overwhelm you.',
    },
    {
      accent: 'green',
      eyebrow: 'Move with purpose',
      icon: 'purpose',
      title: 'Purposeful organization',
      text: 'Manage what you have today so you can make better decisions tomorrow.',
    },
  ]
  const steps = [
    {
      title: 'Create your categories',
      text: 'Separate your income and expenses into simple categories that match your real life.',
    },
    {
      title: 'Register your transactions',
      text: 'Add what comes in and what goes out, then understand your monthly balance clearly.',
    },
    {
      title: 'Track commitments',
      text: 'Prepare for upcoming bills and recurring financial responsibilities before they become stress.',
    },
    {
      title: 'Follow your progress',
      text: 'Use clean cards and summaries to see your financial life with more peace and confidence.',
    },
  ]
  const benefits = [
    'Know what you earn.',
    'Understand what you spend.',
    'Prepare for what is coming.',
    'Build better habits step by step.',
  ]
  const trustCards = [
    {
      title: 'Private by principle',
      text: 'Your financial records belong to your personal organization.',
    },
    {
      title: 'Clear by design',
      text: 'Simple language and focused tools keep you in control.',
      id: 'terms',
    },
    {
      title: 'Built with responsibility',
      text: 'A thoughtful foundation for calmer, more responsible money decisions.',
    },
  ]

  return (
    <div className="min-h-screen overflow-x-clip bg-brand-background text-brand-text transition-colors duration-300">
      <header className="landing-navbar sticky top-0 z-40 border-b border-brand-border/80 bg-brand-background/90 shadow-[0_8px_24px_rgba(31,41,51,0.06)] backdrop-blur-xl" ref={headerRef}>
        <nav
          aria-label="Public navigation"
          className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8"
        >
          <Link
            aria-label="Stewardly home"
            className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            to="/"
          >
            <BrandLogo className="[&_.brand-logo-copy]:hidden min-[400px]:[&_.brand-logo-copy]:flex" compact />
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <SectionLink sectionId="why-stewardly">Why Stewardly</SectionLink>
            <SectionLink sectionId="how-it-works">How it works</SectionLink>
            <SectionLink sectionId="benefits">Benefits</SectionLink>
          </div>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <ThemeToggle showLabel={false} />
            <Link
              className="inline-flex min-h-10 items-center px-3 text-sm font-bold hover:text-brand-primary-dark"
              to="/login"
            >
              Sign in
            </Link>
            <Link
              className="inline-flex min-h-10 items-center rounded-xl bg-brand-primary px-4 text-sm font-bold text-white transition hover:brightness-90"
              to="/login"
            >
              Get started
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <Link
              className="inline-flex min-h-10 items-center rounded-xl bg-brand-primary px-3 text-xs font-bold text-white transition hover:brightness-90 min-[360px]:text-sm"
              to="/login"
            >
              Get started
            </Link>
            <ThemeToggle showLabel={false} />
            <button
              aria-controls="mobile-navigation"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-border-strong bg-brand-surface text-brand-text-strong transition hover:border-brand-primary hover:bg-brand-primary-soft hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
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
        <div aria-hidden="true" className="landing-scroll-progress absolute inset-x-0 bottom-0 h-0.5">
          <span className="block h-full origin-left scale-x-0 bg-brand-primary" ref={progressRef} />
        </div>

        {isMobileMenuOpen ? (
          <div className="absolute inset-x-0 top-full border-b border-brand-border bg-brand-surface/98 shadow-[0_18px_40px_rgba(31,41,51,0.12)] backdrop-blur-xl md:hidden">
            <nav
              aria-label="Mobile navigation"
              className="mx-auto max-w-7xl px-4 py-4 sm:px-6"
              id="mobile-navigation"
            >
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
        <section className="landing-hero landing-section-depth relative border-b border-brand-border/70 px-4 pb-8 pt-12 text-center sm:px-6 sm:pt-16 lg:px-8 lg:pt-18">
          <div className="relative z-10 mx-auto max-w-4xl">
            <Reveal delay={0} variant="blur-in">
              <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-surface/75 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-brand-primary-dark shadow-sm backdrop-blur-sm sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                Money organization, without the noise
              </p>
            </Reveal>
            <Reveal delay={90} variant="fade-up">
              <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight text-brand-text-strong sm:text-5xl lg:text-6xl">
                Manage your money with clarity, calm and purpose.
              </h1>
            </Reveal>
            <Reveal delay={180} variant="fade-up">
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-brand-text-muted sm:text-lg">
                Stewardly helps you organize income, expenses and financial commitments without the noise of complex spreadsheets or overwhelming finance apps.
              </p>
            </Reveal>
            <Reveal delay={270} variant="scale-up">
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link className={primaryCta} to="/login">Get started</Link>
                <Link className={secondaryCta} to="/login">Sign in</Link>
              </div>
            </Reveal>
            <Reveal delay={350} variant="fade-up">
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-brand-text-muted">
                No complex spreadsheets. No noisy dashboards. Just a calmer way to understand your money.
              </p>
            </Reveal>
          </div>
          <Reveal className="landing-hero-mockups relative z-10" delay={440} variant="scale-up">
            <ProductMockups parallaxRef={parallaxRef} />
          </Reveal>
        </section>

        <section
          className="landing-mobile-flow landing-section-depth landing-depth-green w-full scroll-mt-24 border-b border-brand-border bg-brand-surface px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
          id="why-stewardly"
        >
          <div className="relative z-10 mx-auto max-w-7xl">
            <Reveal className="max-w-2xl" variant="fade-up">
              <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand-gold">A calmer approach</p>
              <h2 className="mt-3 text-3xl font-bold text-brand-text-strong sm:text-4xl">Why Stewardly?</h2>
            </Reveal>
            <Reveal className="max-w-2xl" delay={90} variant="fade-up">
              <p className="mt-5 text-base leading-8 text-brand-text-muted sm:text-lg">
                Because managing money should not feel confusing, noisy or stressful.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {whyCards.map((card, index) => (
                <Reveal delay={130 + index * 90} key={card.title} variant="scale-up">
                  <article className={`landing-elevated-card group h-full rounded-3xl border border-brand-border bg-brand-surface p-6 sm:p-7 ${card.accent === 'gold' ? 'border-t-2 border-t-brand-gold' : 'border-t-2 border-t-brand-primary'}`}>
                    <div className="flex items-center justify-between gap-4">
                      <WhyIcon type={card.icon} />
                      <span className="text-xs font-bold text-brand-text-muted">0{index + 1}</span>
                    </div>
                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.08em] text-brand-primary-dark">{card.eyebrow}</p>
                    <h3 className="mt-3 text-xl font-bold text-brand-text-strong">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-brand-text-muted">{card.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          className="landing-section-depth landing-depth-gold scroll-mt-24 border-b border-brand-border bg-brand-background px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
          id="how-it-works"
        >
          <div className="relative z-10 mx-auto max-w-7xl">
            <Reveal className="max-w-2xl" variant="blur-in">
              <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand-primary-dark">How it works</p>
              <h2 className="mt-3 text-3xl font-bold text-brand-text-strong sm:text-4xl">Start organizing in a few simple steps</h2>
            </Reveal>
            <div className="relative mt-12">
              <Reveal className="absolute left-[10%] right-[10%] top-7 hidden lg:block" delay={120} variant="fade-left">
                <div aria-hidden="true" className="h-px bg-gradient-to-r from-brand-primary/20 via-brand-gold/55 to-brand-primary/20" />
              </Reveal>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((step, index) => (
                  <Reveal delay={160 + index * 90} key={step.title} variant="fade-up">
                    <article className="landing-elevated-card relative h-full rounded-3xl border border-brand-border bg-brand-surface p-6 pt-8">
                      <span className="relative z-10 inline-flex h-12 min-w-12 items-center justify-center rounded-2xl border border-brand-primary/20 bg-brand-primary-soft px-3 text-sm font-bold text-brand-primary-dark shadow-sm">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="mt-6 text-lg font-bold text-brand-text-strong">{step.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-brand-text-muted">{step.text}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="landing-benefits landing-mobile-flow landing-section-depth w-full scroll-mt-24 border-b border-brand-primary/15 px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
          id="benefits"
        >
          <div className="relative z-10 mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
            <div className="w-full min-w-0 max-w-2xl">
              <Reveal className="w-full min-w-0" variant="fade-left">
                <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand-primary-dark">Built for everyday life</p>
                <h2 className="mt-3 break-words text-3xl font-bold text-brand-text-strong sm:text-4xl">Less financial noise. More peace to decide.</h2>
                <p className="mt-6 break-words text-base leading-8 text-brand-text sm:text-lg">
                  Stewardly is designed for people who want to stop guessing, stop depending on messy notes, and start building a calmer relationship with money.
                </p>
              </Reveal>
              <Reveal className="w-full min-w-0" delay={160} variant="fade-left">
                <div className="mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-brand-primary to-brand-gold" />
              </Reveal>
            </div>
            <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <Reveal className="w-full min-w-0" delay={80 + index * 80} key={benefit} variant="fade-right">
                  <article className="landing-check-card flex h-full min-h-28 w-full min-w-0 items-start gap-4 rounded-2xl border border-brand-primary/20 bg-brand-surface/90 p-5 backdrop-blur-sm">
                    <span aria-hidden="true" className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm ${index === 2 ? 'bg-brand-gold' : 'bg-brand-primary'}`}>✓</span>
                    <p className="min-w-0 break-words pt-1 font-bold leading-6 text-brand-text-strong">{benefit}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          className="landing-mobile-flow landing-section-depth landing-depth-green w-full scroll-mt-24 border-b border-brand-border bg-brand-surface px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
          id="privacy"
        >
          <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl">
            <div className="grid w-full min-w-0 grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <Reveal className="w-full min-w-0 max-w-2xl" variant="fade-left">
                <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand-gold">Trust and privacy</p>
                <h2 className="mt-3 break-words text-3xl font-bold text-brand-text-strong sm:text-4xl">Built for calm and responsible organization.</h2>
                <p className="mt-6 break-words text-base leading-8 text-brand-text-muted sm:text-lg">
                  Your financial organization should feel private, simple and under your control. Stewardly is being built with clarity, privacy and responsible money management in mind.
                </p>
              </Reveal>
              <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
                {trustCards.map((card, index) => (
                  <Reveal className="w-full min-w-0" delay={100 + index * 90} key={card.title} variant="scale-up">
                    <article className="landing-elevated-card h-full w-full min-w-0 rounded-3xl border border-brand-border bg-brand-background p-6" id={card.id}>
                      <span aria-hidden="true" className={`block h-1.5 w-10 rounded-full ${index === 1 ? 'bg-brand-gold' : 'bg-brand-primary'}`} />
                      <h3 className="mt-5 text-base font-bold text-brand-text-strong">{card.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-brand-text-muted">{card.text}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="landing-cta-band landing-section-depth w-full px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <Reveal className="landing-cta-reveal mx-auto w-full min-w-0 max-w-5xl" variant="scale-up">
            <div className="landing-final-cta relative mx-auto w-full min-w-0 max-w-5xl overflow-hidden rounded-3xl border border-brand-primary/25 px-6 py-12 text-center shadow-[0_28px_75px_rgba(20,45,32,0.2)] sm:px-10 sm:py-16">
              <div aria-hidden="true" className="landing-cta-glow absolute inset-0 pointer-events-none" />
              <div aria-hidden="true" className="absolute inset-x-[15%] top-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
              <Reveal className="relative" delay={80} variant="blur-in">
                <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand-gold">A simple first step</p>
                <h2 className="mx-auto mt-3 max-w-2xl break-words text-3xl font-bold text-white sm:text-4xl">Start with what you have today.</h2>
                <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#D8DFE3]">
                  You do not need a complicated system to begin. Stewardly helps you take the first step with clarity.
                </p>
              </Reveal>
              <Reveal className="relative" delay={220} variant="fade-up">
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link className={primaryCta} to="/login">Get started</Link>
                  <Link className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/35 px-6 py-3 text-sm font-bold text-white transition hover:border-white/60 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white" to="/login">Sign in</Link>
                </div>
              </Reveal>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="w-full border-t border-brand-border bg-brand-surface px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full min-w-0 max-w-7xl">
          <div className="flex min-w-0 flex-col gap-10 lg:flex-row lg:justify-between">
            <div className="min-w-0">
              <Link
                aria-label="Stewardly home"
                className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                to="/"
              >
                <BrandLogo showTagline />
              </Link>
            </div>
            <nav aria-label="Footer navigation" className="grid w-full min-w-0 grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:w-auto">
              <SectionLink sectionId="why-stewardly">Why Stewardly</SectionLink>
              <SectionLink sectionId="how-it-works">How it works</SectionLink>
              <SectionLink sectionId="benefits">Benefits</SectionLink>
              <SectionLink sectionId="privacy">Privacy</SectionLink>
              <SectionLink sectionId="terms">Terms</SectionLink>
              <Link className={sectionLink} to="/login">Sign in</Link>
            </nav>
          </div>
          <p className="mt-10 min-w-0 break-words border-t border-brand-border pt-6 text-xs leading-6 text-brand-text-muted">
            © 2026 Stewardly. Built to help people manage money with clarity, calm and purpose.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
