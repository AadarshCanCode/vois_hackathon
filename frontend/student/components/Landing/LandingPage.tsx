import React, { useEffect, useMemo, useState } from 'react';
import { Shield, GraduationCap, BookOpen, Award, Target, Zap, CheckCircle, ArrowRight, Globe, Brain, Video, Menu, X } from 'lucide-react';
import { LoginForm } from '../Auth/LoginForm';
import { RegisterForm } from '../Auth/RegisterForm';

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  // auth modal flow (preserved from previous implementation)
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userType, setUserType] = useState<'student' | 'teacher' | null>(null);

  // interactive UI state
  const [showDemo, setShowDemo] = useState(false);
  const [email, setEmail] = useState('');
  const [emailMsg, setEmailMsg] = useState<string | null>(null);

  // testimonials carousel
  const testimonials = useMemo(
    () => [
      {
        name: 'Sarah Rodriguez',
        title: 'Security Analyst at TechCorp',
        quote:
          'Career Connect transformed my cybersecurity career. The hands-on labs made complex topics tangible.',
        initials: 'SR',
      },
      {
        name: 'Michael Johnson',
        title: 'Penetration Tester at SecureNet',
        quote:
          "The virtual labs are realistic. I practiced techniques safely and gained confidence for real engagements.",
        initials: 'MJ',
      },
      {
        name: 'Dr. Amanda Chen',
        title: 'Cybersecurity Professor',
        quote:
          'As an instructor I love how easy it is to create engaging content and track student progress.',
        initials: 'AC',
      },
    ],
    []
  );
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveTestimonial((p) => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  const handleGetStarted = (type: 'student' | 'teacher') => {
    setUserType(type);
    setShowLogin(true);
  };

  const submitEmail = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
      setEmailMsg('Please enter a valid email address');
      return;
    }
    setEmailMsg('Thanks! We\'ll keep you updated.');
    setEmail('');
    setTimeout(() => setEmailMsg(null), 4000);
  };

  // navbar mobile state
  const [mobileOpen, setMobileOpen] = useState(false);

  // close mobile menu on route change or resize (basic)
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 640) setMobileOpen(false);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (showLogin) {
    return (
      <LoginForm
        userType={userType}
        onToggleMode={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
        onBack={() => {
          setShowLogin(false);
          setUserType(null);
        }}
        onSuccess={onLogin}
      />
    );
  }

  if (showRegister) {
    return (
      <RegisterForm
        userType={userType}
        onToggleMode={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
        onBack={() => {
          setShowRegister(false);
          setUserType(null);
        }}
        onSuccess={onLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-900 text-slate-100">
      {/* Floating blurred shapes for depth */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-10 w-96 h-96 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -right-28 top-1/4 w-72 h-72 bg-gradient-to-br from-amber-500 to-red-500 opacity-12 rounded-full blur-2xl animate-blob animation-delay-2000" />
      </div>

      {/* Nav */}
      <header className="py-4 px-6 sticky top-0 z-40 backdrop-blur-sm bg-slate-900/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button aria-label="Home" className="flex items-center gap-3 focus:outline-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="p-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg shadow-md">
                <Shield className="h-6 w-6 text-slate-900" />
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold tracking-tight">Career Connect</div>
                <div className="text-xs text-slate-400">Cybersecurity · Labs · Certs</div>
              </div>
            </button>
          </div>

          {/* desktop links */}
          <nav className="hidden sm:flex items-center gap-6">
            <a className="text-slate-300 hover:text-white transition" href="#features">Features</a>
            <a className="text-slate-300 hover:text-white transition" href="#paths">Paths</a>
            <a className="text-slate-300 hover:text-white transition" href="#testimonials">Testimonials</a>
            <a className="text-slate-300 hover:text-white transition" href="/docs" aria-label="Docs">Docs</a>
            <div className="ml-2 inline-flex items-center text-sm text-slate-200 bg-white/5 px-3 py-1 rounded-full">
              <span className="font-semibold mr-2">Learners</span>
              <span className="text-xs text-slate-300">live</span>
            </div>
            <button onClick={() => handleGetStarted('student')} className="ml-3 px-4 py-2 rounded-md bg-gradient-to-r from-amber-500 to-rose-500 text-slate-900 font-semibold shadow hover:scale-105 transition-transform">Get Started</button>
          </nav>

          {/* mobile menu button */}
          <div className="sm:hidden">
            <button aria-expanded={mobileOpen} aria-controls="mobile-menu" onClick={() => setMobileOpen((s) => !s)} className="p-2 rounded-md bg-white/6">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* mobile nav panel */}
        {mobileOpen && (
          <div id="mobile-menu" className="sm:hidden mt-3 px-4 pb-4">
            <div className="flex flex-col gap-3">
              <a className="block px-3 py-2 rounded-md text-slate-200 hover:bg-white/5" href="#features" onClick={() => setMobileOpen(false)}>Features</a>
              <a className="block px-3 py-2 rounded-md text-slate-200 hover:bg-white/5" href="#paths" onClick={() => setMobileOpen(false)}>Paths</a>
              <a className="block px-3 py-2 rounded-md text-slate-200 hover:bg-white/5" href="#testimonials" onClick={() => setMobileOpen(false)}>Testimonials</a>
              <a className="block px-3 py-2 rounded-md text-slate-200 hover:bg-white/5" href="/docs" onClick={() => setMobileOpen(false)}>Docs</a>
              <button onClick={() => { setMobileOpen(false); handleGetStarted('student'); }} className="w-full text-left px-3 py-2 rounded-md bg-amber-500 text-slate-900 font-semibold">Get Started</button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Learn Cybersecurity with Hands-on Labs
              <span className="text-emerald-300 block mt-2">Practice. Build. Certify.</span>
            </h1>

            <p className="text-lg text-slate-300 mb-6 max-w-xl">
              Real-world simulations, AI-driven mentoring, and trackable learning paths to level up your career.
            </p>

            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => handleGetStarted('student')}
                className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-400 text-slate-900 rounded-lg font-semibold shadow hover:scale-[1.03] transition-transform"
              >
                <GraduationCap className="h-5 w-5" />
                Start Learning
              </button>

              <a
                className="ml-2 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                href="https://cybergame.sparkstudio.co.in/"
                target="_blank"
                rel="noreferrer"
              >
                Play Cyber Game
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* email signup */}
            <form onSubmit={submitEmail} className="mt-8 max-w-md">
              <label className="sr-only">Email</label>
              <div className="flex gap-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for early access"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/5 placeholder:text-slate-400 focus:outline-none"
                />
                <button className="px-4 py-3 rounded-lg bg-amber-500 text-slate-900 font-semibold">Notify me</button>
              </div>
              {emailMsg && <div className="mt-2 text-sm text-emerald-300">{emailMsg}</div>}
            </form>
          </div>

          {/* Hero visual / stats */}
          <div className="relative">
            <div className="bg-gradient-to-br from-indigo-700 to-emerald-600 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">Interactive Labs</div>
                  <div className="text-sm text-white/80">50+ realistic environments</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-extrabold">95%</div>
                  <div className="text-xs text-white/80">student satisfaction</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-white/10 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">10+</div>
                  <div className="text-xs text-white/80">Students</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-xs text-white/80">AI help</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">10+ Labs</div>
                  <div className="text-xs text-white/80">Industry-ready</div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-400">Try a quick simulation in the Cyber Game for a taste of our lab experience.</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Platform highlights</h2>
            <p className="text-slate-400 mt-2 max-w-2xl mx-auto">Everything you need to learn, practice, and prove your cybersecurity skills.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={<BookOpen />} title="Courses" copy="Structured curricula aligned to industry standards." />
            <FeatureCard icon={<Target />} title="Virtual Labs" copy="Realistic scenarios with guided tasks and auto-scoring." />
            <FeatureCard icon={<Brain />} title="AI Mentor" copy="Instant hints, exam review, and personalized recommendations." />
            <FeatureCard icon={<Award />} title="Certifications" copy="Showcaseable credentials employers trust." />
            <FeatureCard icon={<Zap />} title="Analytics" copy="Progress tracking and path suggestions." />
            <FeatureCard icon={<Globe />} title="Community" copy="Peer challenges, study groups, and expert AMAs." />
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section id="paths" className="py-16 px-6 bg-white/3">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Learning paths</h2>
            <p className="text-slate-300 mt-2">Tailored tracks depending on your experience and goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PathCard title="Beginner" badge="Start here" features={["Fundamentals", "Network basics", "Intro to pentesting"]} onApply={() => handleGetStarted('student')} />
            <PathCard title="Intermediate" badge="Most popular" features={["Pen testing", "Forensics", "Secure design"]} onApply={() => handleGetStarted('student')} />
            <PathCard title="Advanced" badge="Expert" features={["Red Team ops", "Cloud security", "Threat hunting"]} onApply={() => handleGetStarted('student')} />
          </div>
        </div>
      </section>

      {/* Testimonials (carousel) */}
      <section id="testimonials" className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Trusted by learners worldwide</h2>
          <p className="text-slate-400 mb-8">Hear from students and instructors who use Career Connect.</p>

          <div className="relative">
            <div className="bg-white/5 p-8 rounded-2xl">
              <div className="mb-4 flex justify-center">
                {[...Array(testimonials.length)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`mx-1 w-3 h-3 rounded-full transition ${i === activeTestimonial ? 'bg-emerald-400' : 'bg-white/30'}`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>

              <blockquote className="text-slate-200 italic">“{testimonials[activeTestimonial].quote}”</blockquote>
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-semibold">{testimonials[activeTestimonial].initials}</div>
                <div>
                  <div className="font-semibold">{testimonials[activeTestimonial].name}</div>
                  <div className="text-sm text-slate-400">{testimonials[activeTestimonial].title}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get hands-on?</h2>
          <p className="text-slate-400 mb-8">Start a free trial, join a cohort, or become an instructor — pick your path.</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => handleGetStarted('student')} className="px-6 py-3 bg-emerald-400 rounded-lg font-semibold text-slate-900">Start free trial</button>
            <button onClick={() => handleGetStarted('teacher')} className="px-6 py-3 border border-white/10 rounded-lg">Become an instructor</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-md">
              <Shield className="h-6 w-6 text-slate-900" />
            </div>
            <div>
              <div className="font-semibold">Career Connect</div>
              <div className="text-xs text-slate-400">© {new Date().getFullYear()} · All rights reserved</div>
            </div>
          </div>

          <div className="text-sm text-slate-400">Built for learners, instructors and hiring teams.</div>
        </div>
      </footer>

      {/* Demo modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-slate-900 rounded-xl max-w-3xl w-full overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-amber-400" />
                <div className="font-semibold">Platform demo</div>
              </div>
              <button onClick={() => setShowDemo(false)} className="text-slate-400 hover:text-white px-3">Close</button>
            </div>
            <div className="p-4">
              {/* lightweight embed (replace id if you have a hosted video) */}
              <div className="aspect-video w-full bg-black rounded">
                <iframe
                  title="Platform demo"
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Small UI subcomponents used by the landing page
const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; copy: string }> = ({ icon, title, copy }) => (
  <div className="bg-white/5 rounded-2xl p-6 hover:scale-[1.02] transition-transform shadow-sm">
    <div className="w-12 h-12 rounded-lg bg-white/6 flex items-center justify-center mb-4">{icon}</div>
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm text-slate-300">{copy}</p>
  </div>
);

const PathCard: React.FC<{ title: string; badge?: string; features: string[]; onApply: () => void }> = ({ title, badge, features, onApply }) => (
  <div className="bg-white/5 rounded-2xl p-6 flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{title}</h3>
        {badge && <span className="text-xs bg-amber-500 text-slate-900 px-3 py-1 rounded-full">{badge}</span>}
      </div>
      <ul className="mt-4 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-center text-slate-300 text-sm">
            <CheckCircle className="h-4 w-4 mr-2 text-emerald-300" />
            {f}
          </li>
        ))}
      </ul>
    </div>
    <div className="mt-6">
      <button onClick={onApply} className="w-full py-2 bg-emerald-400 text-slate-900 rounded-lg font-semibold">Choose</button>
    </div>
  </div>
);
