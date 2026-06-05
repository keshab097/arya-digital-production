import { useState, useRef, useEffect, ReactNode } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
  useMotionValueEvent,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, ArrowUp, X, Menu, Plus, ChevronDown,
  Phone, Mail, MapPin, Linkedin, Instagram, Facebook, Youtube, Star,
  BarChart3, Video, Palette, Code2, GraduationCap, Camera, Mic, Sparkles,
  Search, ClipboardList, Hammer, LineChart, RefreshCw,
  Stethoscope, Home, Hotel, Landmark, Plane, Briefcase, Dumbbell,
  ShoppingCart, Cloud, Bed, Building2, HeartHandshake, Coffee, Mountain,
} from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;
// Relevant, full-color placeholder media. [CONFIRM] swap for real shoot files / client assets.
//  photo() -> topical color photos (loremflickr, deterministic via lock)
//  face()  -> real portrait faces for avatars (pravatar)
//  logo()  -> real full-color brand logos (Simple Icons CDN)
const photo = (tags: string, w: number, h: number, lock: number) =>
  `https://loremflickr.com/${w}/${h}/${tags}?lock=${lock}`;
const face = (n: number, size = 160) => `https://i.pravatar.cc/${size}?img=${n}`;
const logo = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

/* ============================================================
   Shared primitives
   ============================================================ */
function Reveal({
  children, className = '', delay = 0, y = 16,
}: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  if (reduced) return <div ref={ref} className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, tone = 'muted', className = '' }:
  { children: ReactNode; tone?: 'muted' | 'saffron' | 'on-dark'; className?: string }) {
  const color = tone === 'saffron' ? 'var(--saffron)'
    : tone === 'on-dark' ? 'var(--on-dark-soft)' : 'var(--slate-soft)';
  return <span className={`eyebrow ${className}`} style={{ color }}>{children}</span>;
}

function CountUp({ to, suffix = '', duration = 1.5 }:
  { to: number; suffix?: string; duration?: number }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduced) { setVal(to); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to, duration]);
  return <span ref={ref} className="font-mono">{val}{suffix}</span>;
}

/* ============================================================
   S0. Announcement bar
   ============================================================ */
const ANNOUNCEMENTS = [
  'Booking new engagements for Q3 2026',
  'New: Generative engine optimization (GEO) services',
  'Hiring: Senior SEO Strategist, Kathmandu',
];
function AnnouncementBar() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem('arya-announce-hidden') === '1') setHidden(true);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % ANNOUNCEMENTS.length), 6000);
    return () => clearInterval(t);
  }, []);
  if (hidden) return null;
  return (
    <div className="bg-ink-deep relative z-[60]" style={{ height: 36 }}>
      <div className="max-w-[1400px] mx-auto h-full px-6 flex items-center justify-center">
        <div className="flex-1 text-center overflow-hidden h-full relative">
          <AnimatePresence mode="wait">
            <motion.a
              key={i}
              href="/contact/"
              className="absolute inset-0 flex items-center justify-center gap-2 text-on-dark-soft hover:text-on-dark"
              style={{ fontSize: 12, letterSpacing: '0.02em' }}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {ANNOUNCEMENTS[i]} <ArrowRight size={13} className="text-saffron" />
            </motion.a>
          </AnimatePresence>
        </div>
        <button
          aria-label="Dismiss announcement"
          onClick={() => { setHidden(true); sessionStorage.setItem('arya-announce-hidden', '1'); }}
          className="text-on-dark-soft hover:text-on-dark ml-4"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   S1. Header
   ============================================================ */
const PILLARS = [
  { name: 'Digital Marketing', href: '/digital-marketing/', subs: [['SEO', '/digital-marketing/seo/'], ['Paid Ads', '/digital-marketing/paid-ads/'], ['Social Media', '/digital-marketing/social-media/']] },
  { name: 'Production', href: '/production/', subs: [['Video', '/production/video/'], ['Photography', '/production/photography/'], ['Podcasts', '/production/podcasts/']] },
  { name: 'Branding', href: '/branding/', subs: [['Strategy', '/branding/strategy/'], ['Identity', '/branding/identity/'], ['Guidelines', '/branding/guidelines/']] },
  { name: 'Training', href: '/training/', subs: [['Courses', '/training/courses/'], ['Workshops', '/training/workshops/'], ['Corporate', '/training/corporate/']] },
  { name: 'Web', href: '/web/', subs: [['Design', '/web/design/'], ['Development', '/web/development/'], ['E-commerce', '/web/ecommerce/']] },
  { name: 'Studio Rental', href: '/studio-rental/', subs: [['By the hour', '/studio-rental/'], ['By the day', '/studio-rental/'], ['Podcast booth', '/studio-rental/']] },
];
const NAV = [
  { label: 'Services', href: '/services/', mega: true },
  { label: 'Work', href: '/work/' },
  { label: 'Industries', href: '/industries/' },
  { label: 'About', href: '/about/' },
  { label: 'Insights', href: '/blog/' },
  { label: 'Contact', href: '/contact/' },
];
const SOCIALS = [
  { Icon: Linkedin, href: 'https://linkedin.com/company/aryadigitalproduction', label: 'LinkedIn' },
  { Icon: Instagram, href: 'https://instagram.com/aryadigitalproduction', label: 'Instagram' },
  { Icon: Facebook, href: 'https://facebook.com/aryadigitalproduction', label: 'Facebook' },
  { Icon: Youtube, href: 'https://youtube.com/@aryadigitalproduction', label: 'YouTube' },
];

function Logo({ onDark = true }: { onDark?: boolean }) {
  return (
    <a href="/" aria-label="Arya Digital Production home" className="inline-flex items-end font-display leading-none"
      style={{ color: onDark ? '#fff' : 'var(--ink)', fontSize: 26 }}>
      ARYA<span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--saffron)', marginLeft: 3, marginBottom: 4 }} />
    </a>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  return (
    <header
      className="sticky top-0 z-50 transition-colors duration-300"
      style={{
        background: scrolled ? 'var(--ink-deep)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(231,226,216,0.1)' : '1px solid transparent',
      }}
    >
      {/* Top utility row */}
      <div
        className="hidden lg:block overflow-hidden transition-all duration-300"
        style={{ height: scrolled ? 0 : 32, opacity: scrolled ? 0 : 1, borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-[1400px] mx-auto h-8 px-6 flex items-center justify-between" style={{ fontSize: 12 }}>
          <div className="flex items-center gap-4 text-on-dark-soft">
            <span><span className="text-on-dark">EN</span> <span className="opacity-50">|</span> नेपाली</span>
            <a href="tel:+97714000000" className="hover:text-on-dark">+977 1 4XXXXXX</a>
            <a href="mailto:hello@aryadigitalproduction.com" className="hover:text-on-dark">hello@aryadigitalproduction.com</a>
          </div>
          <div className="flex items-center gap-3 text-on-dark-soft">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a key={label} href={href} aria-label={label} className="hover:text-saffron"><Icon size={15} /></a>
            ))}
          </div>
        </div>
      </div>

      {/* Main row */}
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between" style={{ height: 72 }}>
          <Logo />
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            {NAV.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.mega && setServicesOpen(true)}
                onMouseLeave={() => item.mega && setServicesOpen(false)}
              >
                <a href={item.href}
                  className="inline-flex items-center gap-1 px-3 py-2 font-medium text-on-dark hover:text-white"
                  style={{ fontSize: 15 }}>
                  {item.label}
                  {item.mega && <ChevronDown size={14} style={{ opacity: 0.6 }} />}
                </a>
                <AnimatePresence>
                  {item.mega && servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="fixed left-0 right-0 top-[auto] mt-2"
                    >
                      <div className="max-w-[1400px] mx-auto px-6">
                        <div className="bg-paper rounded-[20px] shadow-card-hover border border-mist p-8" style={{ width: '60%' }}>
                          <div className="grid grid-cols-3 gap-8">
                            {PILLARS.map((p) => (
                              <div key={p.name}>
                                <a href={p.href} className="font-display text-ink" style={{ fontSize: 20 }}>{p.name}</a>
                                <ul className="mt-3 space-y-2">
                                  {p.subs.map(([s, h]) => (
                                    <li key={s}><a href={h} className="text-slate hover:text-ink" style={{ fontSize: 14 }}>{s}</a></li>
                                  ))}
                                </ul>
                                <a href={p.href} className="link-arrow mt-3 inline-flex" style={{ fontSize: 12 }}>
                                  Explore <ArrowRight size={13} className="arrow" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
          <div className="hidden lg:block">
            <a href="/contact/" className="btn btn-primary" style={{ height: 44 }} data-cursor>
              Start a project <ArrowRight size={16} className="arrow" />
            </a>
          </div>
          <button className="lg:hidden text-white p-2" aria-label="Open menu" aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}>
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[70] bg-ink-deep lg:hidden flex flex-col"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between h-[72px] px-6 border-b border-white/10">
              <Logo />
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="text-white p-2"><X size={26} /></button>
            </div>
            <nav className="flex-1 px-6 py-8 flex flex-col gap-1 overflow-y-auto" aria-label="Mobile">
              {NAV.map((item) => (
                <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                  className="font-display text-white py-2" style={{ fontSize: 32 }}>{item.label}</a>
              ))}
            </nav>
            <div className="px-6 py-6 border-t border-white/10 text-on-dark-soft space-y-3" style={{ fontSize: 14 }}>
              <div><span className="text-white">EN</span> <span className="opacity-50">|</span> नेपाली</div>
              <a href="tel:+97714000000" className="block">+977 1 4XXXXXX</a>
              <a href="mailto:hello@aryadigitalproduction.com" className="block">hello@aryadigitalproduction.com</a>
              <a href="/contact/" className="btn btn-primary w-full justify-center mt-2">Start a project <ArrowRight size={16} className="arrow" /></a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ============================================================
   S2. Hero
   ============================================================ */
const BUILDING = [
  'the new Mountain Helicopters site',
  'the Angel Fertility growth program',
  'the Global IME local SEO rebuild',
];
function Hero() {
  const reduced = useReducedMotion();
  const [b, setB] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setB((v) => (v + 1) % BUILDING.length), 4000);
    return () => clearInterval(t);
  }, []);
  const lines: ReactNode[] = [
    'Digital solutions',
    'for digital',
    <span key="np" className="text-saffron">नेपाल<span style={{ fontSize: '1.3em' }}>.</span></span>,
  ];
  return (
    <section className="relative bg-ink-deep grain overflow-hidden" aria-labelledby="hero-h1"
      style={{ minHeight: 720, height: '100vh' }}>
      {/* duotone place photo, bottom-right 40% */}
      <div aria-hidden data-placeholder="true" className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width: '48%', height: '66%',
          backgroundImage: `url(${photo('kathmandu,nepal,temple', 900, 900, 3)})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.4, filter: 'saturate(1.1) contrast(1.05)',
          maskImage: 'linear-gradient(to top left, #000 22%, transparent 78%)',
          WebkitMaskImage: 'linear-gradient(to top left, #000 22%, transparent 78%)',
        }} />
      <div className="relative max-w-[1400px] mx-auto px-6 h-full flex flex-col justify-center" style={{ paddingTop: 80 }}>
        <div className="flex items-center gap-2 mb-7">
          <Eyebrow tone="saffron" className="font-mono inline-flex items-center gap-2" >
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--saffron)', display: 'inline-block' }} />
            KATHMANDU
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--saffron)', display: 'inline-block' }} />
            NEPAL
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--saffron)', display: 'inline-block' }} />
            EST. 2018
          </Eyebrow>
        </div>

        <h1 id="hero-h1" className="font-display h1-hero text-white" style={{ maxWidth: 1100 }}
          aria-label="Digital solutions for digital Nepal.">
          {lines.map((ln, i) => (
            <span key={i} className="block overflow-hidden" aria-hidden>
              <motion.span
                className="block"
                initial={reduced ? false : { y: 36, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: EASE, delay: reduced ? 0 : 0.15 + i * 0.08 }}
              >
                {ln}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="text-on-dark body-lg mt-8" style={{ maxWidth: 640 }}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.5 }}
        >
          Fifteen disciplines, one senior team, one address in New Baneshwor, Kathmandu. We build the SEO, the ads, the video, the brand, and the measurement that proves any of it worked.
        </motion.p>

        <motion.div className="flex flex-wrap items-center gap-4 mt-12"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.6 }}
        >
          <a href="/contact/" className="btn btn-primary" data-cursor>Start a project <ArrowRight size={18} className="arrow" /></a>
          <a href="/work/" className="btn btn-outline-light" data-cursor>See selected work</a>
        </motion.div>

        <div className="flex flex-wrap items-center justify-between gap-6 mt-24">
          <div className="flex items-center gap-3 text-on-dark-soft" style={{ fontSize: 14 }}>
            <span className="relative flex" style={{ width: 8, height: 8 }}>
              <span className="absolute inline-flex w-full h-full rounded-full bg-saffron opacity-70" style={{ animation: reduced ? 'none' : 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }} />
              <span className="relative inline-flex rounded-full" style={{ width: 8, height: 8, background: 'var(--saffron)' }} />
            </span>
            <span className="text-on-dark-soft">Currently building</span>
            <span className="text-on-dark relative h-5 overflow-hidden" style={{ minWidth: 280 }}>
              <AnimatePresence mode="wait">
                <motion.span key={b} className="absolute left-0"
                  initial={reduced ? false : { y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }} exit={reduced ? undefined : { y: -16, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}>
                  {BUILDING[b]}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
          <a href="#positioning" className="hidden md:flex items-center gap-2 text-on-dark-soft hover:text-on-dark" style={{ fontSize: 13 }}>
            <span>Scroll to explore</span>
            <motion.span animate={reduced ? {} : { y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
              <ChevronDown size={16} className="text-saffron" />
            </motion.span>
          </a>
        </div>
      </div>
      <style>{`@keyframes ping{75%,100%{transform:scale(2.2);opacity:0}}`}</style>
    </section>
  );
}

/* ============================================================
   S3. Services marquee
   ============================================================ */
const TICKER = ['SEO', 'PAID MEDIA', 'SOCIAL', 'CONTENT', 'VIDEO PRODUCTION', 'PHOTOGRAPHY', 'PODCASTS', 'MOTION', 'BRANDING', 'WEB', 'TRAINING', 'STUDIO RENTAL'];
function Marquee() {
  const seq = (
    <div className="flex items-center shrink-0">
      {TICKER.map((t) => (
        <span key={t} className="flex items-center shrink-0">
          <span className="font-display italic" style={{ fontSize: 'clamp(36px,5vw,64px)', color: 'rgba(11,20,55,0.8)', paddingInline: 28 }}>{t}</span>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--saffron)' }} />
        </span>
      ))}
    </div>
  );
  return (
    <section className="bg-surface overflow-hidden border-y border-mist" aria-label="Services" style={{ height: 96 }}>
      <div className="marquee h-full items-center" aria-hidden>
        {seq}{seq}
      </div>
    </section>
  );
}

/* ============================================================
   S4. Positioning statement (word-by-word reveal)
   ============================================================ */
const POSITIONING = `A Nepali brand doesn't lose because the strategy was wrong. It loses because seven vendors owned seven pieces of the work and none of them owned the outcome. We built Arya so the SEO team can walk down the hall to the video team, so the ad spend gets briefed by the analytics lead, and so the person who pitched you is the person on the call six months later. One agency. One address. One number to call when something breaks.`;
function Word({ word, index, total, progress }:
  { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total;
  const end = Math.min(1, start + 1.5 / total);
  const opacity = useTransform(progress, [start, end], [0.22, 1]);
  return <motion.span style={{ opacity }}>{word}{' '}</motion.span>;
}
function Positioning() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.5'] });
  const words = POSITIONING.split(' ');
  return (
    <section id="positioning" className="bg-paper" style={{ paddingBlock: 'clamp(80px,12vw,160px)' }} aria-labelledby="pos-eyebrow">
      <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Eyebrow tone="saffron" className="font-mono" >WHAT WE DO</Eyebrow>
            <div id="pos-eyebrow" style={{ width: 48, height: 2, background: 'var(--saffron)', marginTop: 12 }} />
          </div>
        </div>
        <div className="lg:col-span-8">
          {reduced ? (
            <p ref={ref} className="font-display editorial text-ink">{POSITIONING}</p>
          ) : (
            <p ref={ref} className="font-display editorial text-ink">
              {words.map((w, i) => <Word key={i} word={w} index={i} total={words.length} progress={scrollYProgress} />)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   S5. Services bento
   ============================================================ */
function BentoArrow() {
  return <ArrowUpRight className="text-saffron transition-transform duration-200 group-hover:translate-x-2 group-hover:-translate-y-1" size={22} />;
}
function ServicesBento() {
  return (
    <section className="bg-surface" style={{ paddingBlock: 'clamp(80px,12vw,160px)' }} aria-labelledby="bento-h2">
      <div className="max-w-[1400px] mx-auto px-6">
        <Reveal className="mb-12">
          <Eyebrow className="font-mono">SERVICES</Eyebrow>
          <h2 id="bento-h2" className="font-display h2-section text-ink mt-3" style={{ maxWidth: 720 }}>Built for compounding, not campaigns.</h2>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-5">
          {/* A — Digital Marketing */}
          <a href="/digital-marketing/" data-cursor className="group lg:col-span-7 bg-ink rounded-[20px] p-8 flex flex-col text-white shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1.5" style={{ minHeight: 420 }}>
            <div className="flex items-start justify-between">
              <span className="font-mono text-saffron" style={{ fontSize: 13 }}>01</span>
              <BarChart3 className="text-saffron" size={26} />
            </div>
            <div className="mt-auto">
              <h3 className="font-display" style={{ fontSize: 34, letterSpacing: '-0.01em' }}>Digital Marketing</h3>
              <p className="text-on-dark-soft mt-2" style={{ maxWidth: 460 }}>Search, paid media, and social that compounds, ranked and measured to how Nepal actually buys.</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {['SEO', 'Paid Ads', 'Email', '+12 more'].map((s) => (
                  <span key={s} className="pill" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>{s}</span>
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-6"><BentoArrow /></div>
          </a>

          {/* B — Video Production (image-led) */}
          <a href="/production/video/" data-cursor className="group lg:col-span-5 rounded-[20px] overflow-hidden relative shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1.5" style={{ minHeight: 420 }}>
            <img data-placeholder="true" src={photo('film,camera,cinema', 800, 900, 11)} width={800} height={900} loading="lazy" alt="Film production still" className="work-image absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,11,34,0.9), rgba(6,11,34,0.15) 55%, transparent)' }} />
            <div className="relative h-full p-8 flex flex-col text-white" style={{ minHeight: 420 }}>
              <div className="flex items-start justify-between">
                <span className="font-mono text-saffron" style={{ fontSize: 13 }}>02</span>
                <Video className="text-saffron" size={26} />
              </div>
              <div className="mt-auto">
                <h3 className="font-display" style={{ fontSize: 30, letterSpacing: '-0.01em' }}>Video Production</h3>
                <p className="text-on-dark-soft mt-2">Brand films, reels, and TVCs shot in-house, board to final cut.</p>
                <div className="flex justify-end mt-4"><ArrowUpRight className="text-saffron group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform duration-200" size={22} /></div>
              </div>
            </div>
          </a>

          {/* C — Branding (saffron border) */}
          <a href="/branding/" data-cursor className="group lg:col-span-4 bg-paper rounded-[20px] p-7 flex flex-col transition-all duration-200 hover:-translate-y-1.5" style={{ minHeight: 320, border: '1.5px solid var(--saffron)' }}>
            <div className="flex items-start justify-between">
              <span className="font-mono text-saffron" style={{ fontSize: 13 }}>03</span>
              <Palette className="text-saffron" size={24} />
            </div>
            <div className="mt-auto">
              <h3 className="font-display text-ink" style={{ fontSize: 26 }}>Branding</h3>
              <p className="text-slate mt-2" style={{ fontSize: 15 }}>Names, logos, and systems that hold up across every screen and shopfront.</p>
              <div className="flex flex-wrap gap-2 mt-4">{['Strategy', 'Identity', 'Packaging'].map((s) => <span key={s} className="pill bg-mist text-ink">{s}</span>)}</div>
            </div>
            <div className="flex justify-end mt-4"><BentoArrow /></div>
          </a>

          {/* D — Web (code texture) */}
          <a href="/web/" data-cursor className="group lg:col-span-4 rounded-[20px] p-7 flex flex-col bg-white shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:shadow-card-hover overflow-hidden relative" style={{ minHeight: 320 }}>
            <div aria-hidden className="absolute top-0 right-0 left-0 font-mono select-none" style={{ fontSize: 11, color: 'rgba(11,20,55,0.06)', padding: 16, lineHeight: 1.5 }}>
              {'<section class="hero">\n  <h1>{brand}</h1>\n  <Cta>Start</Cta>\n</section>'}
            </div>
            <div className="flex items-start justify-between relative">
              <span className="font-mono text-saffron" style={{ fontSize: 13 }}>04</span>
              <Code2 className="text-saffron" size={24} />
            </div>
            <div className="mt-auto relative">
              <h3 className="font-display text-ink" style={{ fontSize: 26 }}>Web Design &amp; Development</h3>
              <p className="text-slate mt-2" style={{ fontSize: 15 }}>Fast, search-ready sites and stores built to convert, not just to look good.</p>
            </div>
            <div className="flex justify-end mt-4 relative"><BentoArrow /></div>
          </a>

          {/* E — Training (cream) */}
          <a href="/training/" data-cursor className="group lg:col-span-4 bg-cream rounded-[20px] p-7 flex flex-col transition-all duration-200 hover:-translate-y-1.5" style={{ minHeight: 320 }}>
            <div className="flex items-start justify-between">
              <span className="font-mono text-saffron-deep" style={{ fontSize: 13 }}>05</span>
              <GraduationCap className="text-ink" size={24} />
            </div>
            <div className="mt-auto">
              <h3 className="font-display text-ink" style={{ fontSize: 26 }}>Training</h3>
              <p className="text-slate mt-2" style={{ fontSize: 15 }}>Workshops and courses that leave your team able to run the playbook in-house.</p>
              <div className="flex flex-wrap gap-2 mt-4">{['Courses', 'Workshops', 'Corporate'].map((s) => <span key={s} className="pill" style={{ background: 'rgba(180,83,9,0.12)', color: 'var(--saffron-deep)' }}>{s}</span>)}</div>
            </div>
            <div className="flex justify-end mt-4"><BentoArrow /></div>
          </a>

          {/* F — Photography & Podcasts (split) */}
          <a href="/production/" data-cursor className="group lg:col-span-5 rounded-[20px] overflow-hidden flex shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1.5" style={{ minHeight: 280 }}>
            <div className="w-1/2 relative overflow-hidden">
              <img data-placeholder="true" src={photo('photography,studio,camera', 500, 600, 12)} width={500} height={600} loading="lazy" alt="Photography studio" className="work-image absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="w-1/2 bg-ink-soft p-6 flex flex-col text-white">
              <div className="flex items-start justify-between">
                <span className="font-mono text-saffron" style={{ fontSize: 13 }}>06</span>
                <div className="flex gap-2"><Camera className="text-saffron" size={20} /><Mic className="text-saffron" size={20} /></div>
              </div>
              <div className="mt-auto">
                <h3 className="font-display" style={{ fontSize: 24 }}>Photography &amp; Podcasts</h3>
                <p className="text-on-dark-soft mt-1" style={{ fontSize: 14 }}>Stills and audio, captured in studio.</p>
              </div>
            </div>
          </a>

          {/* G — Studio Rental (floor-plan svg) */}
          <a href="/studio-rental/" data-cursor className="group lg:col-span-4 bg-ink-soft rounded-[20px] p-7 flex flex-col text-white relative overflow-hidden transition-all duration-200 hover:-translate-y-1.5" style={{ minHeight: 280 }}>
            <svg aria-hidden className="absolute bottom-3 right-3 opacity-25" width="120" height="100" viewBox="0 0 120 100" fill="none" stroke="var(--saffron)" strokeWidth="1.5">
              <rect x="4" y="4" width="112" height="92" rx="3" /><line x1="60" y1="4" x2="60" y2="96" /><line x1="60" y1="50" x2="116" y2="50" /><circle cx="32" cy="50" r="14" />
            </svg>
            <div className="flex items-start justify-between relative">
              <span className="font-mono text-saffron" style={{ fontSize: 13 }}>07</span>
              <Mic className="text-saffron" size={24} />
            </div>
            <div className="mt-auto relative">
              <h3 className="font-display" style={{ fontSize: 26 }}>Studio Rental</h3>
              <p className="text-on-dark-soft mt-2" style={{ fontSize: 15 }}>A wired, lit, sound-treated studio in New Baneshwor. By the hour or the day.</p>
            </div>
          </a>

          {/* H — AI & Analytics (sparkline) */}
          <a href="/digital-marketing/analytics/" data-cursor className="group lg:col-span-3 bg-white rounded-[20px] p-7 flex flex-col shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1.5" style={{ minHeight: 280 }}>
            <div className="flex items-start justify-between">
              <span className="font-mono text-saffron" style={{ fontSize: 13 }}>08</span>
              <Sparkles className="text-saffron" size={24} />
            </div>
            <svg aria-hidden className="my-3" width="100%" height="44" viewBox="0 0 160 44" fill="none" preserveAspectRatio="none">
              <motion.path d="M0 38 L25 30 L50 33 L75 20 L100 24 L130 9 L160 4" stroke="var(--saffron)" strokeWidth="2"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE }} />
            </svg>
            <div className="mt-auto">
              <h3 className="font-display text-ink" style={{ fontSize: 24 }}>AI &amp; Analytics</h3>
              <p className="text-slate mt-1" style={{ fontSize: 14 }}>GA4, GTM, and AI-assisted reporting.</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   S6. Services scroll-pinned deep-dive
   ============================================================ */
const PANELS = [
  { k: 'SEO that compounds.', copy: 'Technical foundations, content that earns links, and local signals tuned for Kathmandu search.', bullets: ['Technical and on-page audits', 'Content built around real demand', 'Local pack and map ranking'], href: '/digital-marketing/seo/' },
  { k: 'Paid media that respects budget.', copy: 'Tight account structures, ruthless creative testing, and spend briefed by the analytics lead.', bullets: ['Google, Meta, TikTok, LinkedIn', 'Creative testing every cycle', 'Spend mapped to pipeline'], href: '/digital-marketing/paid-ads/' },
  { k: 'Social that sounds like you.', copy: 'A voice that fits the brand and a cadence the feed rewards, shot and edited in-house.', bullets: ['Channel-native content', 'In-house production', 'Community management'], href: '/digital-marketing/social-media/' },
  { k: 'Video that fits the feed.', copy: 'Vertical-first films and reels engineered for the first three seconds, not the festival circuit.', bullets: ['9:16 and 16:9 cuts', 'Hook-first editing', 'Studio or on location'], href: '/production/video/' },
  { k: 'Brand that holds together.', copy: 'Identity systems with the rules, type, and color to stay consistent across every touchpoint.', bullets: ['Logo and identity', 'Type and color systems', 'Usage guidelines'], href: '/branding/' },
];
function PanelVisual({ i }: { i: number }) {
  if (i === 0) return (
    <svg viewBox="0 0 320 200" className="w-full h-full" fill="none">
      {[0, 1, 2, 3].map((g) => <line key={g} x1="20" y1={40 + g * 40} x2="300" y2={40 + g * 40} stroke="rgba(255,255,255,0.08)" />)}
      <motion.path d="M20 170 C 90 165, 120 130, 170 110 S 250 50, 300 30" stroke="var(--saffron)" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: EASE }} />
      <circle cx="300" cy="30" r="5" fill="var(--saffron)" />
    </svg>
  );
  if (i === 1) return (
    <div className="w-full max-w-sm bg-white rounded-xl p-4 text-left shadow-card">
      <div className="pill bg-cream text-ink mb-2">Ad</div>
      <p className="text-ink font-semibold" style={{ fontSize: 16 }}>Heli Tours from Kathmandu</p>
      <p className="text-forest" style={{ fontSize: 13 }}>aryaclient.com/everest-heli</p>
      <p className="text-slate mt-1" style={{ fontSize: 13 }}>Sunrise Everest flights, small groups, instant booking. Reserve a window seat today.</p>
    </div>
  );
  if (i === 2) return (
    <div className="relative" style={{ width: 200, height: 200 }}>
      {[0, 1, 2].map((c) => (
        <div key={c} className="absolute bg-white rounded-xl shadow-card-hover" style={{ width: 150, height: 180, left: c * 18, top: c * 10, transform: `rotate(${(c - 1) * 5}deg)`, zIndex: 3 - c }}>
          <div className="bg-ink-soft rounded-t-xl" style={{ height: 110 }} />
          <div className="p-3"><div className="bg-mist rounded" style={{ height: 8, width: '80%' }} /><div className="bg-mist rounded mt-2" style={{ height: 8, width: '55%' }} /></div>
        </div>
      ))}
    </div>
  );
  if (i === 3) return (
    <div className="bg-ink-soft rounded-2xl border border-white/10 relative flex items-center justify-center" style={{ width: 150, height: 266 }}>
      <motion.div className="rounded-full bg-saffron flex items-center justify-center" style={{ width: 54, height: 54 }} animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--ink)"><path d="M8 5v14l11-7z" /></svg>
      </motion.div>
    </div>
  );
  return (
    <div className="text-center">
      <div className="font-display text-white" style={{ fontSize: 64 }}>ARYA<span className="text-saffron">.</span></div>
      <div className="flex gap-2 justify-center mt-4">{['var(--ink)', 'var(--saffron)', 'var(--cream)', 'var(--surface)'].map((c, n) => <span key={n} style={{ width: 36, height: 36, borderRadius: 8, background: c, border: '1px solid rgba(255,255,255,0.2)' }} />)}</div>
      <p className="font-mono text-on-dark-soft mt-4" style={{ fontSize: 12 }}>Instrument Serif / Inter</p>
    </div>
  );
}
function ServicesDeepDive() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.max(0, Math.min(PANELS.length - 1, Math.floor(v * PANELS.length))));
  });
  const barWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  if (reduced) {
    return (
      <section className="bg-ink-deep" aria-label="Services in depth">
        {PANELS.map((p, i) => (
          <div key={i} className="max-w-[1400px] mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-center border-b border-white/5">
            <div><span className="font-mono text-saffron" style={{ fontSize: 13 }}>{String(i + 1).padStart(2, '0')} / 05</span>
              <h3 className="font-display text-white mt-3" style={{ fontSize: 40 }}>{p.k}</h3>
              <p className="text-on-dark-soft mt-3" style={{ maxWidth: 440 }}>{p.copy}</p>
            </div>
            <div className="bg-ink-soft rounded-2xl h-64 flex items-center justify-center"><PanelVisual i={i} /></div>
          </div>
        ))}
      </section>
    );
  }
  return (
    <section ref={ref} className="bg-ink-deep relative" style={{ height: `${PANELS.length * 100}vh` }} aria-label="Services in depth">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="absolute top-0 left-0 z-20" style={{ height: 3, background: 'var(--saffron)', width: barWidth }} />
        <div className="absolute top-8 right-8 z-20 font-mono text-on-dark-soft" style={{ fontSize: 13 }}>
          <span className="text-saffron">{String(active + 1).padStart(2, '0')}</span> / 05
        </div>
        {PANELS.map((p, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-300" style={{ opacity: active === i ? 1 : 0, pointerEvents: active === i ? 'auto' : 'none' }}>
            <div className="max-w-[1400px] mx-auto px-6 h-full grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <Eyebrow tone="saffron" className="font-mono">SERVICE 0{i + 1}</Eyebrow>
                <h3 className="font-display text-white mt-4" style={{ fontSize: 'clamp(36px,5vw,64px)', lineHeight: 1.02, letterSpacing: '-0.02em' }}>{p.k}</h3>
                <p className="text-on-dark body-lg mt-5" style={{ maxWidth: 460 }}>{p.copy}</p>
                <ul className="mt-6 space-y-2">
                  {p.bullets.map((b) => <li key={b} className="flex items-center gap-3 text-on-dark-soft"><span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--saffron)' }} />{b}</li>)}
                </ul>
                <a href={p.href} className="link-arrow mt-7 inline-flex">Explore {p.k.split(' ')[0]} <ArrowRight size={15} className="arrow" /></a>
              </div>
              <div className="hidden lg:flex items-center justify-center h-[60vh]">
                <div className="bg-ink-soft rounded-[20px] border border-white/10 w-full h-full max-w-lg flex items-center justify-center p-10"><PanelVisual i={i} /></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   S7. Why Arya (sticky illustration + scrolling items)
   ============================================================ */
const WHY = [
  ['Senior strategists run the work.', 'The person who pitches you is the person on your monthly call. No bait-and-switch to a junior the moment the contract is signed.'],
  ['Production and marketing under one roof.', 'Need a film for the campaign you are running? The film team is in the next room. No vendor handoffs, no duplicated briefs.'],
  ['Local search and global tooling.', 'We know how Nepalis search, where they click, and how Daraz and Esewa change the funnel. We also run the full stack: Semrush, Ahrefs, GA4, GTM, HubSpot, and the ads managers.'],
  ['Measurement is the first deliverable.', 'Every engagement starts with GA4, GSC, GTM, and conversion tracking audited. No reporting on numbers you cannot trust.'],
  ['Built for Nepal, working with Australia.', 'The client list spans Kathmandu to Sydney. Time-zone-friendly handoffs, English-first deliverables, the same standard either way.'],
  ['We say no to the wrong fit.', 'We turn down roughly 4 in 10 inbound projects when we do not see a path to results. You will know in the first call whether this is the right team.'],
];
function WhyArya() {
  return (
    <section className="bg-paper" style={{ paddingBlock: 'clamp(72px,10vw,120px)' }} aria-labelledby="why-h2">
      <div className="max-w-[1400px] mx-auto px-6">
        <Reveal className="mb-14">
          <Eyebrow className="font-mono">WHY ARYA</Eyebrow>
          <h2 id="why-h2" className="font-display h2-section text-ink mt-3" style={{ maxWidth: 760 }}>Six reasons clients stay past the first contract.</h2>
        </Reveal>
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 order-2 lg:order-1">
            {WHY.map(([t, d], i) => (
              <Reveal key={i} delay={0.04 * i}>
                <div className="grid grid-cols-[auto_1fr] gap-6 py-7" style={{ borderTop: i === 0 ? 'none' : '1px solid var(--mist)' }}>
                  <span className="font-mono text-saffron" style={{ fontSize: 20 }}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-semibold text-ink" style={{ fontSize: 24, letterSpacing: '-0.01em' }}>{t}</h3>
                    <p className="text-slate mt-2 body-lg">{d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="lg:sticky lg:top-28 rounded-[20px] overflow-hidden relative" style={{ aspectRatio: '4/5' }}>
              <img data-placeholder="true" src={photo('creative,office,team', 800, 1000, 21)} width={800} height={1000} loading="lazy" alt="The Arya team at work in the New Baneshwor studio" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,11,34,0.55), transparent 50%)' }} />
              <div className="absolute bottom-5 left-5"><span className="pill bg-saffron text-ink font-mono">New Baneshwor, Kathmandu</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   S8. Featured work
   ============================================================ */
function FeaturedWork() {
  return (
    <section className="bg-ink" style={{ paddingBlock: 'clamp(80px,12vw,160px)' }} aria-labelledby="feat-h2">
      <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-12 gap-10 items-center">
        <Reveal className="lg:col-span-7">
          <div className="relative rounded-[20px] overflow-hidden group" style={{ aspectRatio: '4/5', maxHeight: 640 }}>
            <img data-placeholder="true" src={photo('helicopter,himalaya,mountain', 900, 1100, 8)} width={900} height={1100} loading="lazy" alt="Mountain Helicopters Nepal case study" className="work-image absolute inset-0 w-full h-full object-cover" />
            <div className="absolute top-5 left-5"><span className="pill bg-saffron text-ink font-mono">Featured Case Study</span></div>
          </div>
        </Reveal>
        <Reveal className="lg:col-span-5" delay={0.1}>
          <Eyebrow tone="saffron" className="font-mono">CASE STUDY · 01</Eyebrow>
          <p className="font-mono text-on-dark-soft mt-3" style={{ fontSize: 13, letterSpacing: '0.08em' }}>MOUNTAIN HELICOPTERS NEPAL</p>
          <h2 id="feat-h2" className="font-display text-white mt-3" style={{ fontSize: 'clamp(28px,3.6vw,44px)', lineHeight: 1.08, letterSpacing: '-0.02em' }}>
            From referral-only to ranked for "heli tour everest" in 8 months.
          </h2>
          <div className="space-y-4 mt-6 text-on-dark-soft body-lg" style={{ maxWidth: 480 }}>
            <p>A premium charter operator with no organic presence and a booking pipeline that lived entirely on word of mouth. The work started with a technical rebuild and a content map around real route demand.</p>
            <p>Nine months of publishing, internal linking, and page-speed work moved the high-intent terms that drive bookings, not vanity keywords. <span className="text-on-dark">[CONFIRM]</span> specific figures with the client before launch.</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-7">
            {['+340% organic sessions', '+187% booking inquiries', '8 mo timeline'].map((m) => (
              <span key={m} className="pill" style={{ border: '1px solid var(--saffron)', color: 'var(--saffron)', fontFamily: 'var(--font-mono)' }}>{m}</span>
            ))}
          </div>
          <a href="/work/mountain-helicopters/" className="link-arrow mt-7 inline-flex">Read the full case study <ArrowRight size={15} className="arrow" /></a>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   S9. Work grid
   ============================================================ */
const FILTERS = ['All', 'Branding', 'Web', 'SEO', 'Paid Media', 'Video', 'Photography'];
const WORKS: [string, string, string, string, string, number][] = [
  ['Angel Fertility', 'Growth Program', 'SEO', 'angel-fertility', 'clinic,medical,baby', 31],
  ['Global IME', 'Local SEO Rebuild', 'SEO', 'global-ime', 'bank,building,city', 32],
  ['Newa Foods', 'Packaging Rebrand', 'Branding', 'newa-foods', 'food,packaging,product', 33],
  ['Thamel Mobility', 'E-commerce Build', 'Web', 'thamel-mobility', 'scooter,street,kathmandu', 34],
  ['Everest Labs', 'Launch Film', 'Video', 'everest-labs', 'studio,product,technology', 35],
  ['Pashupati Tea', 'Brand Photography', 'Photography', 'pashupati-tea', 'tea,plantation,green', 36],
  ['Sagarmatha Bank', 'Paid Acquisition', 'Paid Media', 'sagarmatha-bank', 'finance,office,city', 37],
  ['Gokarna Resort', 'Website & Booking', 'Web', 'gokarna-resort', 'resort,hotel,pool', 38],
  ['Solu Coffee', 'Identity System', 'Branding', 'solu-coffee', 'coffee,cafe,beans', 39],
];
function WorkGrid() {
  const [filter, setFilter] = useState('All');
  return (
    <section className="bg-surface" style={{ paddingBlock: 'clamp(72px,10vw,120px)' }} aria-labelledby="work-h2">
      <div className="max-w-[1400px] mx-auto px-6">
        <Reveal className="mb-8">
          <Eyebrow className="font-mono">MORE WORK</Eyebrow>
          <h2 id="work-h2" className="font-display h2-section text-ink mt-3">Recent projects, by discipline.</h2>
        </Reveal>
        <Reveal className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} data-cursor className="pill transition-colors" style={{
              padding: '8px 16px',
              background: filter === f ? 'var(--saffron)' : 'transparent',
              color: filter === f ? 'var(--ink)' : 'var(--slate)',
              border: filter === f ? '1px solid var(--saffron)' : '1px solid var(--mist)',
            }}>{f}</button>
          ))}
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORKS.filter((w) => filter === 'All' || w[2] === filter).map(([client, title, disc, slug, tags, lock]) => (
            <a key={slug} href={`/work/${slug}/`} data-cursor className="group block">
              <div className="relative rounded-[16px] overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <img data-placeholder="true" src={photo(tags, 640, 480, lock)} width={640} height={480} loading="lazy" alt={`${client} ${title}`} className="work-image absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04]" />
                <div className="absolute inset-0 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(6,11,34,0.7), transparent 60%)' }}>
                  <span className="link-arrow text-white"><span className="text-saffron">View</span> <ArrowRight size={15} className="arrow text-saffron" /></span>
                </div>
              </div>
              <div className="mt-4">
                <Eyebrow className="font-mono">{client}</Eyebrow>
                <h3 className="font-semibold text-ink mt-1" style={{ fontSize: 20 }}>{title}</h3>
              </div>
            </a>
          ))}
        </div>
        <div className="text-center mt-12"><a href="/work/" className="link-arrow">Browse the full portfolio <ArrowRight size={15} className="arrow" /></a></div>
      </div>
    </section>
  );
}

/* ============================================================
   S10. Industries
   ============================================================ */
const INDUSTRIES: [string, string, any, string][] = [
  ['Healthcare', '6 clinics, +210% avg leads', Stethoscope, 'healthcare'],
  ['Real Estate', '14 launches taken to sold out', Home, 'real-estate'],
  ['Hotels', 'Direct bookings up 96%', Hotel, 'hotels'],
  ['Banking & Finance', 'Compliance-safe campaigns', Landmark, 'finance'],
  ['Travel & Tourism', 'Peak-season demand captured', Plane, 'travel'],
  ['Education', '9 institutes, full pipelines', GraduationCap, 'education'],
  ['Professional Services', 'Qualified leads, lower CPL', Briefcase, 'professional-services'],
  ['Fitness', 'Memberships up 130%', Dumbbell, 'fitness'],
  ['E-commerce', 'ROAS held above 4x', ShoppingCart, 'ecommerce'],
  ['SaaS', 'Trials to paid, tracked', Cloud, 'saas'],
  ['Hospitality', 'Covers filled midweek', Bed, 'hospitality'],
  ['Government', 'Public awareness at scale', Building2, 'government'],
  ['Non-profit', 'Donations up, cost down', HeartHandshake, 'non-profit'],
  ['F&B', 'Footfall from local search', Coffee, 'food-and-beverage'],
  ['Trekking & Adventure', 'Ranked for route terms', Mountain, 'trekking'],
];
function Industries() {
  return (
    <section className="bg-paper" style={{ paddingBlock: 'clamp(72px,10vw,120px)' }} aria-labelledby="ind-h2">
      <div className="max-w-[1400px] mx-auto px-6">
        <Reveal className="mb-12">
          <Eyebrow className="font-mono">INDUSTRIES</Eyebrow>
          <h2 id="ind-h2" className="font-display h2-section text-ink mt-3">We've shipped for fifteen.</h2>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-mist border border-mist rounded-[16px] overflow-hidden">
          {INDUSTRIES.map(([name, stat, Icon, slug]) => (
            <a key={slug} href={`/industries/${slug}/`} data-cursor className="group bg-paper p-6 transition-colors duration-200 hover:bg-cream">
              <Icon className="text-ink group-hover:text-saffron transition-colors" size={24} />
              <h3 className="font-semibold text-ink mt-4" style={{ fontSize: 18 }}>{name}</h3>
              <p className="text-slate-soft mt-1" style={{ fontSize: 13 }}>{stat}</p>
              <span className="sr-only">[CONFIRM stat]</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   S11. Proof band
   ============================================================ */
const STATS: [number, string, string][] = [
  [120, '+', 'PROJECTS DELIVERED'],
  [45, '', 'ACTIVE CLIENTS'],
  [8, '', 'YEARS IN KATHMANDU'],
  [15, '', 'SERVICE DISCIPLINES'],
];
function ProofBand() {
  return (
    <section className="bg-ink-deep" style={{ paddingBlock: 96 }} aria-label="By the numbers">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
        {STATS.map(([n, suf, label]) => (
          <div key={label}>
            <div className="font-mono text-white" style={{ fontSize: 'clamp(48px,8vw,96px)', lineHeight: 1, fontWeight: 500 }}>
              <CountUp to={n} suffix={suf} />
            </div>
            <p className="eyebrow text-saffron mt-3">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   S12. Process
   ============================================================ */
const STEPS: [string, string, string, any][] = [
  ['Audit', 'Week 1-2', 'GA4, GSC, ads, social, site code. We document where you are before we suggest where to go.', Search],
  ['Strategy', 'Week 3', 'A 90-day plan with named owners, deliverable dates, and the metrics we are judged on. You approve before any work ships.', ClipboardList],
  ['Build', 'Week 4-10', 'Senior strategist on the account, in-house specialists on the work. Weekly Loom updates, monthly calls.', Hammer],
  ['Measure', 'Week 11', 'GA4, GSC, ads platform, CRM. We report against the metrics we promised, not the ones that look good.', LineChart],
  ['Compound', 'Week 12+', 'Quarterly review. We double down on what worked, kill what did not, and renew the plan.', RefreshCw],
];
function Process() {
  return (
    <section className="bg-surface" style={{ paddingBlock: 'clamp(80px,11vw,140px)' }} aria-labelledby="proc-h2">
      <div className="max-w-[1400px] mx-auto px-6">
        <Reveal className="mb-14">
          <Eyebrow className="font-mono">HOW WE WORK</Eyebrow>
          <h2 id="proc-h2" className="font-display h2-section text-ink mt-3">The 90-day shape of an engagement.</h2>
        </Reveal>
        <div className="relative">
          <div className="hidden lg:block absolute left-0 right-0" style={{ top: 34, borderTop: '1px dashed var(--saffron)', opacity: 0.5 }} />
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-6 relative overflow-x-auto no-scrollbar snap-x">
            {STEPS.map(([t, wk, d, Icon], i) => (
              <Reveal key={t} delay={i * 0.06} className="snap-start min-w-[230px] lg:min-w-0">
                <div className="font-display text-saffron bg-surface inline-block pr-4 relative" style={{ fontSize: 56, lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</div>
                <Icon className="text-ink mt-4" size={28} strokeWidth={1.6} />
                <h3 className="font-semibold text-ink mt-3" style={{ fontSize: 22 }}>{t}</h3>
                <p className="text-slate mt-2" style={{ fontSize: 15, lineHeight: 1.55 }}>{d}</p>
                <p className="font-mono text-slate-soft mt-3" style={{ fontSize: 12 }}>{wk}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   S13. Tools & stack
   ============================================================ */
// [label, Simple Icons slug | null]. null = brand has no Simple Icons logo (trademark
// removals like Ahrefs, LinkedIn, Adobe), so it renders as a clean wordmark instead.
const STACK: [string, [string, string | null][]][] = [
  ['SEO', [['Semrush', 'semrush'], ['Ahrefs', null], ['Screaming Frog', null], ['Search Console', 'googlesearchconsole'], ['Surfer', null]]],
  ['Paid Media', [['Google Ads', 'googleads'], ['Meta Ads Manager', 'meta'], ['TikTok Ads', 'tiktok'], ['LinkedIn Campaign Manager', null], ['Microsoft Advertising', null]]],
  ['Analytics', [['GA4', 'googleanalytics'], ['Google Tag Manager', 'googletagmanager'], ['Looker Studio', 'looker'], ['Hotjar', 'hotjar'], ['Microsoft Clarity', null]]],
  ['Production', [['Adobe Creative Suite', null], ['DaVinci Resolve', 'davinciresolve'], ['Cinema 4D', 'cinema4d'], ['Figma', 'figma'], ['Webflow', 'webflow']]],
  ['CRM & Automation', [['HubSpot', 'hubspot'], ['Mailchimp', 'mailchimp'], ['Klaviyo', null], ['Zapier', 'zapier'], ['n8n', 'n8n']]],
];
function Tools() {
  return (
    <section className="bg-paper" style={{ paddingBlock: 96 }} aria-labelledby="stack-h2">
      <div className="max-w-[1400px] mx-auto px-6">
        <Reveal className="mb-12">
          <Eyebrow className="font-mono">THE STACK</Eyebrow>
          <h2 id="stack-h2" className="font-display h2-section text-ink mt-3">We run the same tools the best agencies do.</h2>
        </Reveal>
        <div className="space-y-px bg-mist border border-mist rounded-[16px] overflow-hidden">
          {STACK.map(([cat, tools]) => (
            <div key={cat} className="bg-paper grid sm:grid-cols-[180px_1fr] gap-4 p-6 items-center">
              <p className="font-mono text-slate-soft" style={{ fontSize: 12, letterSpacing: '0.08em' }}>{cat.toUpperCase()}</p>
              <div className="flex flex-wrap gap-2">
                {tools.map(([t, slug]) => (
                  <span key={t} className="pill border border-mist text-ink transition-colors duration-200 hover:bg-cream inline-flex items-center gap-2" style={{ padding: '7px 14px', fontSize: 13 }}>
                    {slug && <img src={logo(slug)} alt="" width={16} height={16} loading="lazy" style={{ width: 16, height: 16, objectFit: 'contain' }} />}
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   S14. Testimonials
   ============================================================ */
const TESTIMONIALS = [
  { q: 'They rebuilt our category pages and organic became our top booking channel inside two quarters. The same strategist has been on every call since.', name: 'Anjana Shrestha', role: 'Marketing Lead, Himalayan Co', metric: '+187% organic', face: 12 },
  { q: 'The launch film hit 1.2M views and actually moved pre-orders. One team briefed the ads off the same footage. No handoffs.', name: 'Bikash Gurung', role: 'Founder, Everest Labs', metric: '1.2M views', face: 33 },
  { q: 'Cost per lead dropped 43% in a quarter and the monthly report finally made sense to our board. They report on what they promised.', name: 'Sita Maharjan', role: 'Head of Growth, Sagarmatha Bank', metric: '-43% CPL', face: 45 },
  { q: 'We are based in Sydney and never felt the distance. English-first, on time, and senior people on the work the whole way through.', name: 'Daniel Pradhan', role: 'Director, Pradhan & Co', metric: 'AU client', face: 60 },
  { q: 'They turned down a piece of work because it would not have moved the number. That is when I knew they were the right team.', name: 'Reema Karki', role: 'CMO, Angel Fertility', metric: 'Straight read', face: 5 },
];
function Testimonials() {
  const [active, setActive] = useState(0);
  const t = TESTIMONIALS[active];
  return (
    <section className="bg-ink" style={{ paddingBlock: 'clamp(72px,10vw,120px)' }} aria-labelledby="test-h2">
      <div className="max-w-[1400px] mx-auto px-6">
        <Reveal className="mb-12">
          <Eyebrow tone="saffron" className="font-mono">WHAT CLIENTS SAY</Eyebrow>
          <h2 id="test-h2" className="font-display h2-section text-white mt-3">We let them write the kicker.</h2>
        </Reveal>
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.figure key={active}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: EASE }}
                className="bg-ink-soft rounded-[20px] p-8 lg:p-10 border border-white/10">
                <blockquote className="font-display text-white" style={{ fontSize: 'clamp(24px,2.6vw,32px)', lineHeight: 1.25 }}>"{t.q}"</blockquote>
                <figcaption className="flex items-center justify-between gap-4 mt-8">
                  <div className="flex items-center gap-3">
                    <img data-placeholder="true" src={face(t.face, 112)} width={56} height={56} loading="lazy" alt="" className="rounded-full object-cover" style={{ width: 56, height: 56 }} />
                    <div>
                      <p className="text-white font-semibold" style={{ fontSize: 18 }}>{t.name}</p>
                      <p className="text-on-dark-soft" style={{ fontSize: 14 }}>{t.role}</p>
                    </div>
                  </div>
                  <span className="pill" style={{ border: '1px solid var(--saffron)', color: 'var(--saffron)', fontFamily: 'var(--font-mono)' }}>{t.metric}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="lg:col-span-5 space-y-2">
            {TESTIMONIALS.map((item, i) => (
              <button key={i} onClick={() => setActive(i)} data-cursor className="w-full text-left flex items-center gap-3 p-4 rounded-xl transition-colors"
                style={{ background: active === i ? 'rgba(255,255,255,0.06)' : 'transparent', borderLeft: active === i ? '3px solid var(--saffron)' : '3px solid transparent' }}>
                <img data-placeholder="true" src={face(item.face, 80)} width={40} height={40} loading="lazy" alt="" className="rounded-full object-cover" style={{ width: 40, height: 40 }} />
                <span className="truncate" style={{ color: active === i ? '#fff' : 'var(--on-dark-soft)', fontSize: 14 }}>
                  <span className="font-semibold">{item.name}</span> <span className="opacity-70">· {item.role.split(',')[1]}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   S15. Awards / recognition
   ============================================================ */
const AWARDS: [string, string | null][] = [
  ['Google Partner', 'google'],
  ['Meta Business Partner', 'meta'],
  ['HubSpot Partner', 'hubspot'],
  ['IAA Nepal', null],
  ['The Kathmandu Post', null],
  ['Nepali Times', null],
];
function Awards() {
  return (
    <section className="bg-surface" style={{ paddingBlock: 64 }} aria-label="Recognized by">
      <div className="max-w-[1400px] mx-auto px-6">
        <p className="eyebrow text-slate-soft text-center mb-8">RECOGNIZED BY</p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {AWARDS.map(([a, slug]) => (
            <span key={a} data-placeholder="true" className="inline-flex items-center gap-2 font-display text-ink" style={{ fontSize: 20 }}>
              {slug && <img src={logo(slug)} alt="" width={24} height={24} loading="lazy" style={{ width: 24, height: 24, objectFit: 'contain' }} />}
              {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   S16. Team
   ============================================================ */
const TEAM: [string, string, string, number][] = [
  ['Aarav Sharma', 'Founder & Strategy Lead', 'SEO, analytics, measurement', 15],
  ['Priya Koirala', 'Creative Director', 'Branding, art direction', 24],
  ['Bibek Thapa', 'Head of Production', 'Film, motion, studio', 51],
  ['Sneha Rai', 'Performance Lead', 'Paid media, CRO', 32],
];
function Team() {
  return (
    <section className="bg-paper" style={{ paddingBlock: 'clamp(72px,10vw,120px)' }} aria-labelledby="team-h2">
      <div className="max-w-[1400px] mx-auto px-6">
        <Reveal className="mb-3"><Eyebrow className="font-mono">THE TEAM</Eyebrow></Reveal>
        <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <h2 id="team-h2" className="font-display h2-section text-ink">Senior-led. Twenty-two strong.</h2>
          <p className="text-slate body-lg" style={{ maxWidth: 420 }}>The people on the pitch are the people on the work. Here are some of them.</p>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map(([name, title, spec, faceNum]) => (
            <Reveal key={name}>
              <div className="group">
                <div className="relative rounded-[16px] overflow-hidden grain" style={{ aspectRatio: '3/4' }}>
                  <img data-placeholder="true" src={face(faceNum, 400)} width={600} height={800} loading="lazy" alt={`${name}, ${title}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                </div>
                <h3 className="font-semibold text-ink mt-4" style={{ fontSize: 19 }}>{name}</h3>
                <p className="eyebrow text-slate-soft mt-1">{title}</p>
                <p className="text-slate mt-2" style={{ fontSize: 14 }}>{spec}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center"><a href="/about/" className="link-arrow">Meet the whole team <ArrowRight size={15} className="arrow" /></a></div>
      </div>
    </section>
  );
}

/* ============================================================
   S17. Insights
   ============================================================ */
const POSTS: [string, string, string, string, string, string, number][] = [
  ['Why most Nepali e-commerce SEO fails in the first 90 days (and the fix)', 'SEO', '8 min', 'May 28, 2026', 'ecommerce,laptop,shopping', 'nepali-ecommerce-seo', 41],
  ['The Meta Ads creative test we run for every new client', 'Paid Media', '6 min', 'May 14, 2026', 'social,marketing,phone', 'meta-ads-creative-test', 42],
  ["What changed in Google's local pack for Kathmandu in 2026", 'SEO', '5 min', 'Apr 30, 2026', 'kathmandu,street,map', 'kathmandu-local-pack-2026', 43],
];
function Insights() {
  return (
    <section className="bg-surface" style={{ paddingBlock: 96 }} aria-labelledby="ins-h2">
      <div className="max-w-[1400px] mx-auto px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <Eyebrow className="font-mono">INSIGHTS</Eyebrow>
            <h2 id="ins-h2" className="font-display h2-section text-ink mt-3">Notes from the agency.</h2>
          </div>
          <a href="/blog/" className="link-arrow">Read more from the team <ArrowRight size={15} className="arrow" /></a>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {POSTS.map(([title, cat, read, date, tags, slug, lock]) => (
            <Reveal key={slug}>
              <a href={`/blog/${slug}/`} data-cursor className="group block">
                <div className="relative rounded-[16px] overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <img data-placeholder="true" src={photo(tags, 640, 360, lock)} width={640} height={360} loading="lazy" alt={title} className="work-image absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03]" />
                </div>
                <Eyebrow tone="saffron" className="font-mono mt-4 block">{cat}</Eyebrow>
                <h3 className="font-semibold text-ink mt-2 line-clamp-2" style={{ fontSize: 21, lineHeight: 1.25 }}>{title}</h3>
                <p className="text-slate-soft mt-3" style={{ fontSize: 13 }}>{read} read · {date}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   S18. FAQ + FAQPage handled in index.html schema
   ============================================================ */
const FAQS = [
  ['How much does a digital marketing engagement cost in Nepal?', 'Most retainers run between NPR 40,000 and NPR 300,000 per month, set by scope and the channels in play. Project work like a website, a brand, or a film is quoted as a fixed price after a short scoping call. You get a clear number before anything starts.'],
  ['Do you work with brands outside Nepal?', 'Yes. Roughly a third of the client list is based in Australia and the wider diaspora. Deliverables are English-first and handoffs are scheduled around your time zone.'],
  ['How long until I see SEO results?', 'Early movement on long-tail and local terms usually shows in 8 to 12 weeks. Competitive head terms take 6 to 9 months of consistent content and technical work. Anyone promising page one in 30 days is selling you something.'],
  ['What is the difference between SEO and Google Ads, and do I need both?', 'SEO compounds and keeps working after you stop paying. Ads buy instant, controllable traffic that stops when the budget does. Most brands run ads for immediate demand while SEO builds, then rebalance once organic carries the load.'],
  ['Can you run our social media without our internal team?', 'Yes. Strategy, content, shooting, scheduling, and community management can all sit with us. If you have an internal lead, we plug in around them instead of duplicating the work.'],
  ['Do you build websites, or only run marketing on existing ones?', 'Both. We design and build sites and stores on Webflow, WordPress, or custom code, and we run marketing on whatever platform you already have. Measurement is set up correctly either way.'],
  ['What happens in the first 30 days after we sign?', 'Week one is a full audit of analytics, search, ads, and site. Weeks two and three produce a 90-day plan with named owners and dates. By week four the first deliverables are shipping and tracking is live.'],
  ['How do you measure success, and what reports do I get?', 'Against the metrics agreed in the plan, not vanity numbers. You get a live dashboard plus a monthly call walking through GA4, Search Console, ad platforms, and CRM data in plain language.'],
];
function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-paper" style={{ paddingBlock: 'clamp(72px,10vw,120px)' }} aria-labelledby="faq-h2">
      <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Eyebrow className="font-mono">FAQ</Eyebrow>
            <h2 id="faq-h2" className="font-display h2-section text-ink mt-3">Common questions, answered honestly.</h2>
            <p className="text-slate body-lg mt-4">If your question is not here, the first call answers it. No script, no sales theatre.</p>
          </div>
        </div>
        <div className="lg:col-span-8">
          {FAQS.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ borderTop: '1px solid var(--mist)' }}>
                <button onClick={() => setOpen(isOpen ? null : i)} data-cursor aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-6 text-left py-6">
                  <span className="font-medium text-ink" style={{ fontSize: 18 }}>{q}</span>
                  <Plus size={20} className="text-saffron shrink-0 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div key="c" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} style={{ overflow: 'hidden' }}>
                      <p className="text-slate pb-6" style={{ fontSize: 16, lineHeight: 1.6, maxWidth: 620 }}>{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   S19. Newsletter / lead magnet
   ============================================================ */
function Newsletter() {
  const [sent, setSent] = useState(false);
  return (
    <section className="bg-cream" style={{ paddingBlock: 96 }} aria-labelledby="nl-h2">
      <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Eyebrow tone="saffron" className="font-mono" style={{ color: 'var(--saffron-deep)' } as any}>FREE</Eyebrow>
          <h2 id="nl-h2" className="font-display text-ink mt-3" style={{ fontSize: 'clamp(32px,4.4vw,56px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>The Nepal Digital Marketing Benchmarks 2026.</h2>
          <p className="text-slate body-lg mt-5" style={{ maxWidth: 520 }}>32 pages. Industry-by-industry CPM, CPL, organic traffic, and conversion benchmarks across healthcare, real estate, e-commerce, hospitality, and 11 more verticals. No email gate, just opt-in to the monthly note.</p>
        </div>
        <form className="bg-paper rounded-[12px] p-8" style={{ border: '1.5px solid var(--ink)' }} onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <div className="space-y-4">
            <div>
              <label className="eyebrow text-slate-soft block mb-2" htmlFor="nl-name">First name</label>
              <input id="nl-name" type="text" className="w-full bg-surface rounded-md px-4 py-3 text-ink" style={{ border: '1px solid var(--mist)', fontSize: 15 }} />
            </div>
            <div>
              <label className="eyebrow text-slate-soft block mb-2" htmlFor="nl-email">Email</label>
              <input id="nl-email" type="email" required className="w-full bg-surface rounded-md px-4 py-3 text-ink" style={{ border: '1px solid var(--mist)', fontSize: 15 }} />
            </div>
            <div>
              <label className="eyebrow text-slate-soft block mb-2" htmlFor="nl-size">Company size</label>
              <select id="nl-size" className="w-full bg-surface rounded-md px-4 py-3 text-ink" style={{ border: '1px solid var(--mist)', fontSize: 15 }}>
                <option>1-10</option><option>11-50</option><option>51-200</option><option>200+</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-full justify-center" data-cursor>Send me the benchmarks <ArrowRight size={16} className="arrow" /></button>
            {sent && <p className="text-forest" style={{ fontSize: 13 }}>Thanks, check your inbox shortly. [CONFIRM: wire to ESP]</p>}
            <p className="text-slate-soft" style={{ fontSize: 12 }}>Monthly note. No spam. Unsubscribe in one click.</p>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ============================================================
   S20. Final CTA
   ============================================================ */
function FinalCTA() {
  return (
    <section className="bg-ink-deep grain relative" style={{ paddingBlock: 'clamp(96px,14vw,160px)' }} aria-labelledby="cta-h2">
      <div className="max-w-[1400px] mx-auto px-6 text-center relative">
        <Eyebrow tone="saffron" className="font-mono">START THE CONVERSATION</Eyebrow>
        <h2 id="cta-h2" className="font-display text-white mt-4 mx-auto" style={{ fontSize: 'clamp(36px,6vw,72px)', lineHeight: 1.0, letterSpacing: '-0.02em', maxWidth: 900 }}>Tell us what you're trying to ship.</h2>
        <p className="text-on-dark-soft body-lg mt-6 mx-auto" style={{ maxWidth: 600 }}>Brief us. We'll respond within one business day with a frank read on whether we're the right team for the work. If we're not, we'll point you to someone who is.</p>
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <a href="/contact/" className="btn btn-primary" data-cursor>Start a project <ArrowRight size={18} className="arrow" /></a>
          <a href="mailto:hello@aryadigitalproduction.com" className="btn btn-outline-light" data-cursor>Email us</a>
        </div>
        <p className="text-on-dark-soft mt-10 font-mono" style={{ fontSize: 13 }}>+977 1 4XXXXXX · hello@aryadigitalproduction.com · Okharbot Marg, New Baneshwor</p>
      </div>
    </section>
  );
}

/* ============================================================
   S21. Footer
   ============================================================ */
const FOOT_COLS = [
  ['Digital Marketing', ['SEO', 'Paid Ads', 'Social Media', 'Content', 'Email', 'WhatsApp', 'Influencer']],
  ['Production', ['Video', 'Reels', 'Photography', 'Podcasts', 'Motion', 'Animation', 'Music']],
  ['More services', ['Branding', 'Web Design', 'Training', 'Studio Rental', 'AI Marketing', 'Analytics']],
  ['Company', ['About', 'Team', 'Careers', 'Press', 'Contact', 'Portfolio', 'Case Studies']],
];
function Footer() {
  return (
    <footer className="bg-ink-deep text-on-dark-soft relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-4" style={{ fontSize: 14, lineHeight: 1.6 }}>Digital solutions for digital Nepal.</p>
            <address className="not-italic mt-4 space-y-1" style={{ fontSize: 14 }}>
              <p className="text-on-dark">Arya Digital Production</p>
              <p>Okharbot Marg, New Baneshwor, Kathmandu</p>
              <p><a href="tel:+97714000000" className="hover:text-on-dark">+977 1 4XXXXXX</a></p>
              <p><a href="mailto:hello@aryadigitalproduction.com" className="hover:text-on-dark">hello@aryadigitalproduction.com</a></p>
            </address>
            <div className="flex gap-3 mt-4">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} className="w-9 h-9 grid place-items-center rounded-full bg-white/8 hover:bg-saffron hover:text-ink transition-colors"><Icon size={16} /></a>
              ))}
            </div>
          </div>
          {FOOT_COLS.map(([head, links]) => (
            <div key={head as string}>
              <h3 className="text-on-dark font-semibold mb-4" style={{ fontSize: 14 }}>{head}</h3>
              <ul className="space-y-2.5" style={{ fontSize: 14 }}>
                {(links as string[]).map((l) => <li key={l}><a href="/services/" className="hover:text-on-dark">{l}</a></li>)}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-on-dark font-semibold mb-4" style={{ fontSize: 14 }}>Stay close</h3>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" required aria-label="Email" placeholder="Email" className="min-w-0 flex-1 bg-white/8 rounded-md px-3 py-2.5 text-white placeholder-white/40" style={{ border: '1px solid rgba(255,255,255,0.15)', fontSize: 14 }} />
              <button className="btn btn-primary" style={{ height: 'auto', padding: '0 14px' }} aria-label="Subscribe"><ArrowRight size={16} /></button>
            </form>
            <p className="mt-4" style={{ fontSize: 14 }}><span className="text-on-dark">EN</span> <span className="opacity-50">|</span> नेपाली</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(245,158,11,0.3)', marginTop: 48 }} />
        {/* Watermark */}
        <div aria-hidden className="font-display select-none leading-none mt-8" style={{ fontSize: 'clamp(120px,30vw,320px)', color: 'rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>ARYA</div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8" style={{ fontSize: 13 }}>
          <p>© 2026 Arya Digital Production. All rights reserved.</p>
          <p className="flex items-center gap-3">
            <a href="/privacy/" className="hover:text-on-dark">Privacy</a><span className="opacity-40">·</span>
            <a href="/terms/" className="hover:text-on-dark">Terms</a><span className="opacity-40">·</span>
            <a href="/sitemap.xml" className="hover:text-on-dark">Sitemap</a><span className="opacity-40">·</span>
            <a href="/cookies/" className="hover:text-on-dark">Cookies</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   S22. Floating elements + custom cursor
   ============================================================ */
function CustomCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);
    const dot = ref.current!;
    const move = (e: MouseEvent) => { dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; };
    const over = (e: MouseEvent) => { if ((e.target as HTMLElement).closest('a,button,[data-cursor]')) dot.classList.add('cursor-dot--active'); };
    const out = (e: MouseEvent) => { if ((e.target as HTMLElement).closest('a,button,[data-cursor]')) dot.classList.remove('cursor-dot--active'); };
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', over); document.removeEventListener('mouseout', out); };
  }, [reduced]);
  if (!enabled) return null;
  return <div ref={ref} className="cursor-dot" aria-hidden />;
}

function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"
            className="fixed right-5 z-40 w-11 h-11 rounded-full grid place-items-center text-white backdrop-blur"
            style={{ bottom: 88, background: 'rgba(6,11,34,0.8)' }}>
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
      <a href="https://wa.me/97714000000" aria-label="Chat on WhatsApp" data-cursor
        className="lg:hidden fixed right-5 bottom-5 z-40 w-14 h-14 rounded-full grid place-items-center text-white shadow-card-hover" style={{ background: 'var(--saffron)' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.2 7.2 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3A2.8 2.8 0 0 0 6.5 9a4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c.6.3 1.1.4 1.5.5a3.6 3.6 0 0 0 1.6.1 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" /></svg>
      </a>
    </>
  );
}

/* ============================================================
   App
   ============================================================ */
export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <AnnouncementBar />
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <Positioning />
        <ServicesBento />
        <ServicesDeepDive />
        <WhyArya />
        <FeaturedWork />
        <WorkGrid />
        <Industries />
        <ProofBand />
        <Process />
        <Tools />
        <Testimonials />
        <Awards />
        <Team />
        <Insights />
        <FAQ />
        <Newsletter />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingActions />
      <CustomCursor />
    </>
  );
}
