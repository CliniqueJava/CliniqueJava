import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import NotificationBell from '../components/NotificationBell'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Contact', href: '#contact' },
  { label: 'Help', href: '#help' },
]
//test
function Logo() {
  return (
    <a
      href="/"
      className="group inline-flex items-center gap-3 rounded-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-clinic-accent/70"
      aria-label="Go to home"
    >
      <span className="grid h-10 w-10 place-items-center rounded-full bg-clinic-accent/60 text-clinic-dark shadow-soft ring-1 ring-clinic-dark/10">
        <span className="text-lg font-semibold">C</span>
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold text-clinic-dark">Clinique</span>
        <span className="block text-xs text-clinic-dark/70 group-hover:text-clinic-dark">
          Patient portal
        </span>
      </span>
    </a>
  )
}

function Navbar() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-clinic-dark/10 bg-clinic-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-clinic-dark/80 transition hover:bg-clinic-accent/40 hover:text-clinic-dark focus:outline-none focus:ring-2 focus:ring-clinic-accent/70"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <NotificationBell />
            <button
              onClick={logout}
              className="inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-red-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Logout
            </button>
          </div>
        ) : (
          <a
            href="/auth/sign-in"
            className="inline-flex items-center justify-center rounded-full bg-clinic-secondary px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:brightness-105 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-clinic-accent/70"
          >
            Sign in
          </a>
        )}
      </div>
    </header>
  )
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-clinic-accent/50 px-3 py-1 text-xs font-semibold text-clinic-dark ring-1 ring-clinic-dark/10">
      {children}
    </span>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group rounded-3xl bg-white/90 p-7 shadow-soft ring-1 ring-clinic-dark/10 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-clinic-dark/20 bg-clinic-accent/20 shadow-inner">
        {icon}
      </div>
      <h3 className="text-base font-bold text-clinic-dark">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-clinic-dark/70">{desc}</p>
    </div>
  )
}

function SectionTitle({ eyebrow, title, desc }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mb-3 flex justify-center">
        <Pill>{eyebrow}</Pill>
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-clinic-dark sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-clinic-dark/75 sm:text-base">{desc}</p>
    </div>
  )
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32">
      {/* Dynamic Background Blobs */}
      <div className="absolute right-0 top-0 -z-10 h-[50rem] w-[50rem] translate-x-1/3 -translate-y-1/4 rounded-full bg-clinic-accent/30 blur-[100px] mix-blend-multiply" />
      <div className="absolute right-0 bottom-0 -z-10 h-[40rem] w-[40rem] translate-x-1/4 translate-y-1/4 rounded-full bg-clinic-secondary/20 blur-[100px] mix-blend-multiply" />
      <div className="absolute left-0 top-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/20 blur-[80px] mix-blend-multiply" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* Left Text Column */}
          <div className="relative z-10 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-clinic-dark/10 bg-white/50 px-3 py-1.5 text-xs font-semibold text-clinic-dark backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clinic-secondary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-clinic-secondary"></span>
              </span>
              Intelligent Health Agent
            </div>

            <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-clinic-dark sm:text-7xl lg:text-[4.5rem] lg:leading-[1.1]">
              Instant care.<br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#1e6262] to-[#38958d]">
                Zero waiting.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-clinic-dark/70 sm:text-xl">
              Talk to our AI agent to describe your symptoms. Get immediate guidance, a clear summary, and orientation to the right specialist.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center flex-wrap">
              <Link
                to="/chat-agent"
                className="group relative inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#1e6262] px-8 text-base font-semibold text-white transition-all hover:bg-[#154646] hover:shadow-lg hover:shadow-[#1e6262]/30 focus:outline-none focus:ring-2 focus:ring-[#1e6262] focus:ring-offset-2"
              >
                Start Consultation
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
              <Link
                to="/doctors"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-[#1e6262] bg-white px-8 text-base font-semibold text-[#1e6262] transition-all hover:bg-[#1e6262] hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#1e6262]"
              >
                Book an Appointment
              </Link>
              <a
                href="#help"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-clinic-dark/10 bg-white/60 px-8 text-base font-semibold text-clinic-dark backdrop-blur-md transition-all hover:bg-white/80 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-clinic-dark/20"
              >
                How it works
              </a>
            </div>

            <div className="mt-10 flex items-center gap-4 sm:gap-6">
              <div className="flex -space-x-3">
                {['#e0f2fe', '#dcfce7', '#fef3c7', '#fee2e2'].map((color, i) => (
                  <div key={i} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-clinic-dark/50">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-clinic-dark/70">
                Trusted by <span className="font-bold text-clinic-dark">10,000+</span> patients
              </p>
            </div>
          </div>

          {/* Right Visuals - Glassmorphism Chat Mockup */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            {/* The main phone/chat card */}
            <div className="relative z-10 overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/40 shadow-2xl shadow-clinic-dark/10 backdrop-blur-xl">
              {/* Header */}
              <div className="border-b border-white/30 bg-white/50 px-6 py-5 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1e6262] to-[#38958d] text-white shadow-md">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-clinic-dark">Health Agent</h3>
                    <p className="text-xs font-medium text-clinic-secondary">Online • Ready to help</p>
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex h-[400px] flex-col gap-5 overflow-y-auto p-6 bg-gradient-to-b from-transparent to-white/20">
                {/* Agent Message */}
                <div className="flex w-[85%] gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1e6262] to-[#38958d] text-white shadow-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-white p-4 text-sm leading-relaxed text-clinic-dark shadow-sm ring-1 ring-black/5">
                    Hello! I'm your medical assistant. How can I help you today?
                  </div>
                </div>

                {/* User Message */}
                <div className="flex w-[85%] self-end justify-end gap-3">
                  <div className="rounded-2xl rounded-tr-none bg-[#1e6262] p-4 text-sm leading-relaxed text-white shadow-sm">
                    I've had a persistent headache for two days and feel slightly dizzy when standing up.
                  </div>
                </div>

                {/* Agent Message with Chips */}
                <div className="flex w-[85%] gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1e6262] to-[#38958d] text-white shadow-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-white p-4 text-sm leading-relaxed text-clinic-dark shadow-sm ring-1 ring-black/5">
                    I can help you understand this. Have you noticed any other symptoms like fever, nausea, or sensitivity to light?

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button className="rounded-full border border-clinic-dark/10 bg-clinic-bg px-3 py-1.5 text-xs font-semibold text-clinic-dark transition hover:bg-clinic-dark/5 hover:border-clinic-secondary">No fever</button>
                      <button className="rounded-full border border-clinic-dark/10 bg-clinic-bg px-3 py-1.5 text-xs font-semibold text-clinic-dark transition hover:bg-clinic-dark/5 hover:border-clinic-secondary">Mild nausea</button>
                      <button className="rounded-full border border-clinic-dark/10 bg-clinic-bg px-3 py-1.5 text-xs font-semibold text-clinic-dark transition hover:bg-clinic-dark/5 hover:border-clinic-secondary">No light sensitivity</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating decorative elements */}
            <div className="absolute -left-12 bottom-20 z-20 hidden animate-bounce rounded-2xl border border-white/40 bg-white/70 p-4 shadow-xl backdrop-blur-md sm:block" style={{ animationDuration: '3s' }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-clinic-dark">Secure & Private</p>
                  <p className="text-xs text-clinic-dark/60">End-to-end encrypted</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 top-32 z-20 hidden animate-bounce rounded-2xl border border-white/40 bg-white/70 p-4 shadow-xl backdrop-blur-md sm:block" style={{ animationDuration: '4s' }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e6262]/10 text-[#1e6262]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-clinic-dark">24/7 Availability</p>
                  <p className="text-xs text-clinic-dark/60">Always here to help</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="help" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionTitle
        eyebrow="Why choose us"
        title="Simple, secure, and respectful of your privacy"
        desc="A calm experience for patients, and a practical workspace for doctors—built to keep documents organized and appointments better prepared, on mobile and desktop."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <FeatureCard
          icon={
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-clinic-dark opacity-80">
              <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" />
            </svg>
          }
          title="Your medical documents, organized"
          desc="Store scanners, prescriptions, and lab results in one secure place—ready for your next consultation."
        />
        <FeatureCard
          icon={
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-clinic-dark opacity-80">
              <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
            </svg>
          }
          title="Prepare your visit"
          desc="Get a clear AI-assisted summary to help you remember key points and questions to discuss during your appointment."
        />
        <FeatureCard
          icon={
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-clinic-dark opacity-80">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" />
            </svg>
          }
          title="Doctor access when needed"
          desc="Doctors can review patient files, search and filter records, and access uploaded documents with their summaries."
        />
      </div>
    </section>
  )
}

function Services() {
  const services = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-clinic-dark opacity-80">
          <path d="M12 6v4" /><path d="M14 14h-4" /><path d="M14 18h-4" /><path d="M14 8h-4" /><path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2" /><path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18" />
        </svg>
      ),
      title: 'General consultation',
      desc: 'Care for acute concerns, prevention, and ongoing follow-up.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-clinic-dark opacity-80">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
        </svg>
      ),
      title: 'Chronic care follow-up',
      desc: 'Structured monitoring and continuity of care over time.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-clinic-dark opacity-80">
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" />
        </svg>
      ),
      title: 'Medical documents',
      desc: 'Upload and keep your key documents ready for appointments.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-clinic-dark opacity-80">
          <path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 1 0 0-14h-1" /><path d="M9 14h2" /><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
        </svg>
      ),
      title: 'Specialist orientation',
      desc: 'AI-assisted suggestion of an appropriate specialist (no diagnosis).',
    },
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
      <SectionTitle
        eyebrow="Services"
        title="Care centered on you"
        desc="From consultation to follow-up, we help you stay organized and supported throughout your care journey."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {services.map((s) => (
          <div
            key={s.title}
            className="group flex items-start gap-5 rounded-3xl bg-white/90 p-6 shadow-soft ring-1 ring-clinic-dark/10 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-clinic-dark/20 bg-clinic-accent/20 shadow-inner">
              {s.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-clinic-dark">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-clinic-dark/70">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <div className="rounded-3xl bg-white/80 p-8 shadow-soft ring-1 ring-clinic-dark/10 sm:p-10">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <Pill>Contact</Pill>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-clinic-dark sm:text-3xl">
              We’re here to help
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-clinic-dark/75 sm:text-base">
              Reach out for appointments, administrative questions, or portal support.
            </p>

            <div className="mt-6 space-y-3 text-sm text-clinic-dark/80">
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-xl bg-clinic-accent/60 ring-1 ring-clinic-dark/10" />
                <span>
                  <span className="font-semibold text-clinic-dark">Phone:</span> +33 (0)1 23 45 67 89
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-xl bg-clinic-accent/60 ring-1 ring-clinic-dark/10" />
                <span>
                  <span className="font-semibold text-clinic-dark">Email:</span> contact@clinique.example
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-xl bg-clinic-accent/60 ring-1 ring-clinic-dark/10" />
                <span>
                  <span className="font-semibold text-clinic-dark">Hours:</span> Mon–Fri, 9:00–18:00
                </span>
              </div>
            </div>
          </div>

          <form className="rounded-2xl bg-clinic-bg p-6 ring-1 ring-clinic-dark/10">
            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-clinic-dark">Full name</span>
                <input
                  className="h-11 rounded-xl border border-clinic-dark/10 bg-white/80 px-4 text-sm text-clinic-dark shadow-sm outline-none ring-0 placeholder:text-clinic-dark/40 focus:border-clinic-secondary"
                  placeholder="Your name"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-clinic-dark">Email</span>
                <input
                  type="email"
                  className="h-11 rounded-xl border border-clinic-dark/10 bg-white/80 px-4 text-sm text-clinic-dark shadow-sm outline-none placeholder:text-clinic-dark/40 focus:border-clinic-secondary"
                  placeholder="you@example.com"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-clinic-dark">Message</span>
                <textarea
                  rows={4}
                  className="resize-none rounded-xl border border-clinic-dark/10 bg-white/80 px-4 py-3 text-sm text-clinic-dark shadow-sm outline-none placeholder:text-clinic-dark/40 focus:border-clinic-secondary"
                  placeholder="How can we help?"
                />
              </label>
              <button
                type="button"
                className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-clinic-secondary px-5 text-sm font-semibold text-white shadow-soft transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-clinic-accent/70"
              >
                Send message
              </button>
              <p className="text-xs leading-relaxed text-clinic-dark/65">
                This form is a UI placeholder for now. We’ll connect it later when we implement the backend.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-clinic-dark/10 bg-clinic-dark">
      <div className="mx-auto max-w-6xl px-4 py-10 text-clinic-bg sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="text-sm font-semibold">Clinique</div>
            <div className="mt-1 text-xs text-clinic-bg/80">
              Calm, secure, professional care experience.
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="rounded-full px-4 py-2 text-clinic-bg/90 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-clinic-accent/70"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 h-px bg-white/10" />
        <div className="mt-6 text-xs text-clinic-bg/70">
          © {new Date().getFullYear()} Clinique. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default function HOME() {
  return (
    <div className="min-h-screen bg-clinic-bg text-clinic-dark">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

