import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'Daily Problem',
    description: 'AI selects a problem matching your weak topics via vector search. Each comes with a personalized reason explaining why it matters for your growth.',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Smart Hints',
    description: 'Three progressive levels of AI hints — concept, approach, guidance — so you stay challenged without getting stuck.',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    title: 'Voice Mock Interviews',
    description: 'Speak naturally with an AI interviewer. Choose DSA, Behavioral, Resume-Based, or Mixed. Get scored on every answer with detailed feedback.',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: 'Resume Analyzer',
    description: 'Upload your PDF. AI extracts skills and experience, then generates tailored interview questions for your target role.',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    title: 'Smart Roadmap',
    description: 'Personalized study plan (30/60/90 days) based on your level, target role, and weak topics. Adaptive and actionable.',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 3v18" />
      </svg>
    ),
    title: 'Analytics & Streaks',
    description: 'Heatmaps, difficulty breakdowns, topic-wise weakness analysis, and daily streaks to keep you consistent.',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    title: 'AI Chat Assistant',
    description: 'Ask DSA questions in plain English. The assistant responds with explanations grounded in your problem bank.',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'LeetCode Sync',
    description: 'Sync your LeetCode submissions. Aggregate solve stats alongside built-in problems for one unified view.',
  },
];

export default function LandingPage() {
  const { token } = useAuth();
  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-surface-200/60 dark:border-surface-800/60 bg-white/70 dark:bg-surface-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 text-sm font-bold text-white shadow-sm">
              C
            </div>
            <span className="text-lg font-bold text-surface-900 dark:text-surface-100 tracking-tight">
              CodePrep<span className="text-primary-600">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-gradient-to-r from-primary-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-primary-600/20 hover:shadow-md hover:shadow-primary-600/30 hover:scale-[1.02] transition-all"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/8 via-purple-500/5 to-transparent dark:from-primary-500/12 dark:via-purple-500/8" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary-400/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-32 lg:py-40">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/30 px-4 py-1.5 text-xs font-semibold text-primary-700 dark:text-primary-300 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                AI-powered interview preparation
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-surface-900 dark:text-surface-100 leading-[1.1]">
                Master DSA &{' '}
                <span className="bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  ace your interviews
                </span>
              </h1>
              <p className="mt-6 text-lg text-surface-500 dark:text-surface-400 leading-relaxed max-w-lg">
                Practice curated problems with AI hints, train with voice-based mock interviews 
                that score your answers, analyze your resume, and follow a personalized roadmap.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Link
                  to="/register"
                  className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/35 transition-all"
                >
                  Start free
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 px-7 py-3 text-base font-semibold text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 hover:border-surface-400 dark:hover:border-surface-600 transition-all"
                >
                  Log in
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6 text-xs text-surface-400">
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Free forever
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  AI-powered
                </span>
              </div>
            </div>

            <div className="hidden lg:block animate-slide-up">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
                <div className="relative rounded-2xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900 shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-1.5 border-b border-surface-100 dark:border-surface-800 px-4 py-3">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                    <span className="ml-2 text-xs text-surface-400 font-medium">Dashboard — CodePrep AI</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-5 w-32 rounded bg-surface-100 dark:bg-surface-800" />
                      <div className="h-5 w-20 rounded bg-primary-100 dark:bg-primary-900/40" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-20 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200/50 dark:border-primary-700/30 p-3 flex flex-col justify-between">
                        <div className="h-2 w-12 rounded bg-primary-200 dark:bg-primary-700" />
                        <div className="h-6 w-10 rounded bg-primary-300 dark:bg-primary-600" />
                      </div>
                      <div className="h-20 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200/50 dark:border-purple-700/30 p-3 flex flex-col justify-between">
                        <div className="h-2 w-12 rounded bg-purple-200 dark:bg-purple-700" />
                        <div className="h-6 w-10 rounded bg-purple-300 dark:bg-purple-600" />
                      </div>
                      <div className="h-20 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200/50 dark:border-emerald-700/30 p-3 flex flex-col justify-between">
                        <div className="h-2 w-12 rounded bg-emerald-200 dark:bg-emerald-700" />
                        <div className="h-6 w-10 rounded bg-emerald-300 dark:bg-emerald-600" />
                      </div>
                    </div>
                    <div className="h-24 rounded-xl border border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50 p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary-500" />
                        <div className="h-3 w-40 rounded bg-surface-200 dark:bg-surface-700" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-surface-300" />
                        <div className="h-3 w-52 rounded bg-surface-200 dark:bg-surface-700" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <div className="h-3 w-36 rounded bg-surface-200 dark:bg-surface-700" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 flex-1 rounded-lg bg-surface-100 dark:bg-surface-800" />
                      <div className="h-8 w-20 rounded-lg bg-gradient-to-r from-primary-500 to-purple-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent dark:via-primary-500/5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">
              Features
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-100">
              Everything you need to crack the interview
            </h2>
            <p className="mt-4 text-surface-500 dark:text-surface-400 leading-relaxed">
              From daily practice to mock interviews — your complete AI-powered prep toolkit.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-16">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group relative rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 transition-all hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-0.5"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/30 dark:to-purple-900/30 text-primary-600 dark:text-primary-400 transition-all group-hover:from-primary-500 group-hover:to-purple-500 group-hover:text-white">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-surface-900 dark:text-surface-100 text-sm">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-y border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">
              How it works
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-100">
              From signup to interview-ready
            </h2>
            <p className="mt-4 text-surface-500 dark:text-surface-400">
              Three simple steps to level up your preparation.
            </p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-12 mt-16">
            <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-primary-500/40 via-purple-500/40 to-primary-500/40" />
            {[
              {
                step: '01',
                title: 'Practice Daily',
                desc: 'Solve the AI-selected daily problem, work through DSA challenges, and use 3-level hints when you\'re stuck.',
                gradient: 'from-primary-500 to-sky-500',
              },
              {
                step: '02',
                title: 'Train with Mock Interviews',
                desc: 'Upload your resume, choose an interview type, and practice with voice. Every answer is scored with detailed feedback.',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                step: '03',
                title: 'Track & Improve',
                desc: 'Monitor weak topics, follow your personalized roadmap, sync LeetCode stats, and maintain daily streaks.',
                gradient: 'from-emerald-500 to-teal-500',
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-800 dark:to-surface-900 border border-surface-200 dark:border-surface-700 shadow-sm">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-10 dark:opacity-20`} />
                  <span className={`relative text-lg font-bold bg-gradient-to-br ${item.gradient} bg-clip-text text-transparent`}>
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-6 font-semibold text-surface-900 dark:text-surface-100">{item.title}</h3>
                <p className="mt-2 text-sm text-surface-500 dark:text-surface-400 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="relative border-y border-surface-200 dark:border-surface-800">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-purple-600/10 dark:from-primary-500/15 dark:to-purple-500/15" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-100">
            Ready to level up?
          </h2>
          <p className="mt-4 text-surface-500 dark:text-surface-400 max-w-lg mx-auto">
            Join developers who are using CodePrep AI to prepare smarter and land their dream roles.
          </p>
          <div className="mt-8">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/35 hover:scale-[1.02] transition-all"
            >
              Get started — it's free
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-white dark:bg-surface-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 text-sm font-bold text-white">
                  C
                </div>
                <span className="text-lg font-bold text-surface-900 dark:text-surface-100 tracking-tight">
                  CodePrep<span className="text-primary-600">AI</span>
                </span>
              </Link>
              <p className="mt-3 text-sm text-surface-500 dark:text-surface-400 max-w-sm">
                AI-powered platform for DSA practice, mock interviews, resume analysis, and personalized roadmaps.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-3">Product</p>
              <ul className="space-y-2">
                <li><Link to="/register" className="text-sm text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Get started</Link></li>
                <li><Link to="/login" className="text-sm text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Log in</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-3">Tech</p>
              <ul className="space-y-2">
                <li><span className="text-sm text-surface-600 dark:text-surface-300">React + Express</span></li>
                <li><span className="text-sm text-surface-600 dark:text-surface-300">MongoDB + Pinecone</span></li>
                <li><span className="text-sm text-surface-600 dark:text-surface-300">OpenRouter AI</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-surface-200 dark:border-surface-800 text-center text-sm text-surface-400">
            CodePrep AI
          </div>
        </div>
      </footer>
    </div>
  );
}
