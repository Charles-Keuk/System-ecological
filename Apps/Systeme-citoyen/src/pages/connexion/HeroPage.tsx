import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import {
  leafOutline,
  flashOutline,
  carOutline,
  batteryChargingOutline,
  analyticsOutline,
  gridOutline,
  arrowForwardOutline,
  chevronForwardOutline,
  menuOutline,
} from "ionicons/icons";

/* ═══════════════════════════════════════════════════════════════
   GLOBAL ANIMATION STYLES
═══════════════════════════════════════════════════════════════ */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root { --green:#3db87a; --forest:#0f3d38; --teal:#1a6b5a; --sand:#f5f0e8; }
  ion-content { --background:#ffffff; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideRight { from{opacity:0;transform:translateX(-50px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideLeft  { from{opacity:0;transform:translateX(50px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes scaleIn    { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
  @keyframes float      { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-14px) rotate(1.2deg)} 66%{transform:translateY(-7px) rotate(-1deg)} }
  @keyframes floatBadge { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
  @keyframes spinSlow   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes counterSpin{ from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  @keyframes blobMorph  { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} 50%{border-radius:50% 60% 30% 60%/40% 70% 60% 30%} 75%{border-radius:70% 30% 60% 40%/60% 40% 50% 70%} }
  @keyframes pulse      { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.08);opacity:.8} }
  @keyframes shimmer    { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes particleDrift{ 0%{transform:translateY(0) translateX(0) scale(1);opacity:.6} 50%{transform:translateY(-80px) translateX(20px) scale(1.2);opacity:1} 100%{transform:translateY(-160px) translateX(-10px) scale(.8);opacity:0} }
  @keyframes rotateOrbit{ from{transform:rotate(0deg) translateX(95px) rotate(0deg)} to{transform:rotate(360deg) translateX(95px) rotate(-360deg)} }
  @keyframes lineGrow   { from{width:0} to{width:100%} }
  @keyframes glowPulse  { 0%,100%{box-shadow:0 0 20px rgba(61,184,122,.3)} 50%{box-shadow:0 0 50px rgba(61,184,122,.7),0 0 80px rgba(61,184,122,.3)} }
  @keyframes navbarSlide{ from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes windBlade  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes gradientFlow{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes countUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  .reveal{opacity:0;transform:translateY(30px);transition:opacity .7s ease,transform .7s ease}
  .reveal.visible{opacity:1;transform:translateY(0)}
  .reveal-left{opacity:0;transform:translateX(-40px);transition:opacity .7s ease,transform .7s ease}
  .reveal-left.visible{opacity:1;transform:translateX(0)}
  .reveal-right{opacity:0;transform:translateX(40px);transition:opacity .7s ease,transform .7s ease}
  .reveal-right.visible{opacity:1;transform:translateX(0)}
  .reveal-scale{opacity:0;transform:scale(.9);transition:opacity .6s ease,transform .6s ease}
  .reveal-scale.visible{opacity:1;transform:scale(1)}

  .card-hover{transition:transform .3s ease,box-shadow .3s ease;cursor:pointer}
  .card-hover:hover{transform:translateY(-10px) scale(1.02);box-shadow:0 28px 60px rgba(15,61,56,.2) !important}

  .navbar-glass{backdrop-filter:blur(18px);background:rgba(15,61,56,.88) !important;box-shadow:0 4px 30px rgba(0,0,0,.25);transition:background .4s ease}

  .nav-link{position:relative;padding-bottom:2px}
  .nav-link::after{content:'';position:absolute;bottom:0;left:0;width:0;height:2px;background:var(--green);transition:width .3s ease}
  .nav-link:hover::after{width:100%}

  .btn-glow{animation:glowPulse 2.5s ease-in-out infinite}

  .particle{position:absolute;border-radius:50%;background:#3db87a;pointer-events:none;animation:particleDrift linear infinite}

  .progress-bar{height:3px;background:linear-gradient(90deg,var(--green),#7ae8b0);border-radius:999px;width:0;transition:width 1.4s ease}
  .progress-bar.active{width:100%}

  .gradient-bg{background:linear-gradient(-45deg,#0f3d38,#1a6b5a,#0f3d38,#104a3a);background-size:400% 400%;animation:gradientFlow 8s ease infinite}

  .delay-100{transition-delay:.1s !important}
  .delay-200{transition-delay:.2s !important}
  .delay-300{transition-delay:.3s !important}
  .delay-400{transition-delay:.4s !important}
  .delay-500{transition-delay:.5s !important}
`;

/* ═══════════════════════════════════════════════════════════════
   HOOK — Intersection Observer
═══════════════════════════════════════════════════════════════ */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale")
          .forEach((n) => n.classList.add("visible"));
        obs.disconnect();
      }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

/* ═══════════════════════════════════════════════════════════════
   HOOK — Animated counter
═══════════════════════════════════════════════════════════════ */
function useCounter(target: number, duration = 1800, active = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const frame = (now: number) => {
      const pct = Math.min((now - start) / duration, 1);
      setValue(Math.floor(pct * target));
      if (pct < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [active, target, duration]);
  return value;
}

/* ═══════════════════════════════════════════════════════════════
   FLOATING PARTICLES
═══════════════════════════════════════════════════════════════ */
const Particles: React.FC = () => {
  const list = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    bottom: `${Math.random() * 40}%`,
    size: `${4 + Math.random() * 7}px`,
    duration: `${5 + Math.random() * 7}s`,
    delay: `${Math.random() * 7}s`,
    opacity: 0.25 + Math.random() * 0.5,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {list.map((p) => (
        <div key={p.id} className="particle" style={{ left: p.left, bottom: p.bottom, width: p.size, height: p.size, opacity: p.opacity, animationDuration: p.duration, animationDelay: p.delay }} />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════ */
const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const scrollEvent = e as CustomEvent<{ scrollTop: number }>;
      setScrolled(scrollEvent.detail.scrollTop > 60);
    };
    document.addEventListener("ionScroll", handler);
    return () => document.removeEventListener("ionScroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-500 ${scrolled ? "navbar-glass" : "bg-transparent"}`}
      style={{ animation: "navbarSlide 0.7s ease forwards" }}
    >
    <div className="rg-logo">
      <div className="rg-logo-ring">
        <IonIcon icon={leafOutline} style={{ color:"#fff", fontSize:"20px" }} />
      </div>
      <span className="rg-logo-name">
        Eco<span className="rg-logo-accent">Alert</span>
      </span>
    </div>

      <div className="hidden md:flex items-center gap-8 text-white/80 text-sm font-medium">
        {["Services", "Mission", "Equipment", "Consulting", "Contact"].map((l, i) => (
          <a key={l} href={`#${l.toLowerCase()}`} className="nav-link hover:text-[#3db87a] transition-colors duration-200" style={{ animation: `fadeIn 0.6s ease ${0.1 * i + 0.3}s both` }}>
            {l}
          </a>
        ))}
      </div>

      <div style={{ animation: "fadeIn 0.8s ease 0.7s both" }} className="flex items-center">
        <IonButton size="small" className="hidden md:flex" style={{ "--background": "#3db87a", "--border-radius": "999px", "--padding-start": "20px", "--padding-end": "20px", fontWeight: "700" } as React.CSSProperties}>
           Log in
        </IonButton>
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <IonIcon icon={menuOutline} style={{ fontSize: "28px" }} />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0f3d38] border-t border-[#3db87a]/30 px-6 py-4 flex flex-col gap-4" style={{ animation: "fadeUp 0.3s ease forwards" }}>
          {["Services", "Mission", "Equipment", "Consulting", "Contact"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-white/80 text-sm font-medium hover:text-[#3db87a]" onClick={() => setMenuOpen(false)}>{l}</a>
          ))}
        </div>
      )}
    </nav>
  );
};

/* ═══════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════ */
const Hero: React.FC = () => {
  const [slide, setSlide] = useState(0);
  const [titleKey, setTitleKey] = useState(0);

  const slides = [
    { tag: "01", title: "Consulting\nServices", sub: "Our network of climate scientists and experts in sustainable development help our clients to operate exceptionally well in the field of sustainability.", cta: "Learn more" },
    { tag: "02", title: "Green\nEnergy",        sub: "We compile and manage investment portfolios of renewable resources and resilient infrastructure across the globe.", cta: "Discover" },
    { tag: "03", title: "ESG\nSolutions",       sub: "Building unique green paths and advanced social profiles, powered by our clients' vision and expertise.", cta: "Explore" },
  ];

  const goTo = useCallback((i: number) => {
    if (i === slide) return;
    setTitleKey((k) => k + 1);
    setSlide(i);
  }, [slide]);

  useEffect(() => {
    const t = setInterval(() => goTo((slide + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slide, goTo, slides.length]);

  const current = slides[slide];

  return (
    <section id="services" className="relative min-h-screen gradient-bg overflow-hidden flex flex-col">
      <Particles />

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] aspect-square" style={{ background: "radial-gradient(circle,rgba(61,184,122,.18) 0%,transparent 70%)", animation: "blobMorph 10s ease-in-out infinite" }} />
        <div className="absolute bottom-[-15%] left-[-10%] w-[50%] aspect-square" style={{ background: "radial-gradient(circle,rgba(61,184,122,.10) 0%,transparent 70%)", animation: "blobMorph 12s ease-in-out infinite", animationDelay: "-5s" }} />
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="dotgrid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#3db87a" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#dotgrid)" />
        </svg>
        <svg className="absolute right-[-5%] top-[5%] opacity-10" style={{ animation: "spinSlow 30s linear infinite", width: "55vw", height: "55vw" }} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="185" fill="none" stroke="#3db87a" strokeWidth="1.5" strokeDasharray="8 12" />
          <circle cx="200" cy="200" r="130" fill="none" stroke="#3db87a" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="200" cy="200" r="75" fill="none" stroke="#3db87a" strokeWidth="0.8" strokeDasharray="3 6" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col flex-1 pt-24 pb-16">
        <div className="flex flex-col md:flex-row items-center flex-1 px-8 md:px-16 gap-10">

          {/* ── LEFT TEXT ── */}
          <div className="flex-1 text-white">
            <p className="text-[#3db87a] text-xs font-bold tracking-[0.35em] uppercase mb-5" style={{ animation: "slideRight 0.7s ease 0.2s both" }}>
              ✦ Sustainability Experts
            </p>

            <div key={titleKey} style={{ animation: "fadeUp 0.5s ease forwards" }}>
              <h1 className="text-5xl md:text-7xl font-black leading-[1.0] mb-4 whitespace-pre-line" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {current.title}
              </h1>
            </div>

            <div className="h-[3px] rounded-full mb-6 bg-gradient-to-r from-[#3db87a] to-transparent" style={{ animation: "lineGrow 0.9s ease 0.35s both" }} />

            <div key={`sub-${titleKey}`} style={{ animation: "fadeUp 0.5s ease 0.15s both" }}>
              <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-md mb-8">{current.sub}</p>
            </div>

            <div style={{ animation: "fadeUp 0.6s ease 0.45s both" }}>
              <IonButton className="btn-glow" style={{ "--background": "#3db87a", "--border-radius": "999px", "--padding-start": "34px", "--padding-end": "34px", "--padding-top": "16px", "--padding-bottom": "16px", fontWeight: "700", letterSpacing: "0.04em", fontSize: "15px" } as React.CSSProperties}>
                {current.cta}
                <IonIcon icon={arrowForwardOutline} slot="end" />
              </IonButton>
            </div>

            {/* Indicators */}
            <div className="flex items-center gap-8 mt-10" style={{ animation: "fadeIn 0.8s ease 0.8s both" }}>
              {slides.map((s, i) => (
                <button key={s.tag} onClick={() => goTo(i)} className={`flex flex-col items-center gap-2 text-xs font-bold transition-all duration-300 ${i === slide ? "text-[#3db87a]" : "text-white/30 hover:text-white/60"}`}>
                  <div className="h-0.5 w-8 rounded-full transition-all duration-500" style={{ background: i === slide ? "#3db87a" : "rgba(255,255,255,0.2)", transform: i === slide ? "scaleX(1.6)" : "scaleX(1)" }} />
                  {s.tag}
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT CIRCLE ── */}
          <div className="relative flex-shrink-0 w-64 h-64 md:w-[420px] md:h-[420px]" style={{ animation: "scaleIn 0.9s ease 0.3s both" }}>
            {/* Glow */}
            <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle,rgba(61,184,122,.35) 0%,transparent 70%)", animation: "pulse 4s ease-in-out infinite" }} />
            {/* Outer dashed orbit */}
            <div className="absolute inset-[-16%] rounded-full border border-dashed border-[#3db87a]/30" style={{ animation: "spinSlow 22s linear infinite" }} />
            {/* Inner orbit */}
            <div className="absolute inset-[-5%] rounded-full border border-[#3db87a]/15" style={{ animation: "counterSpin 16s linear infinite" }} />
            {/* Orbit dot */}
            <div className="absolute w-5 h-5 rounded-full bg-[#3db87a] shadow-lg shadow-green-400/60" style={{ top: "50%", left: "50%", marginTop: "-10px", marginLeft: "-10px", animation: "rotateOrbit 6s linear infinite" }} />

            {/* Main circle */}
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#3db87a]/50 shadow-2xl relative z-10" style={{ background: "linear-gradient(145deg,#1a6b5a 0%,#0f3d38 60%,#3db87a22 100%)", animation: "float 7s ease-in-out infinite" }}>
              <svg viewBox="0 0 300 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="circleGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#3db87a" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#0f3d38" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3db87a" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#0f3d38" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <rect width="300" height="300" fill="#0f3d38" />
                <ellipse cx="150" cy="300" rx="200" ry="70" fill="url(#grassGrad)" />
                <circle cx="150" cy="150" r="150" fill="url(#circleGlow)" />
                {/* Globe rings */}
                <circle cx="150" cy="135" r="62" fill="none" stroke="#3db87a" strokeWidth="1.5" opacity="0.55" style={{ animation: "spinSlow 25s linear infinite", transformOrigin: "150px 135px" }} />
                <ellipse cx="150" cy="135" rx="26" ry="62" fill="none" stroke="#3db87a" strokeWidth="1" opacity="0.35" />
                <line x1="88" y1="135" x2="212" y2="135" stroke="#3db87a" strokeWidth="1" opacity="0.35" />
                <line x1="90" y1="108" x2="210" y2="108" stroke="#3db87a" strokeWidth="0.7" opacity="0.2" />
                <line x1="90" y1="162" x2="210" y2="162" stroke="#3db87a" strokeWidth="0.7" opacity="0.2" />
                {/* Trees */}
                <polygon points="75,188 48,240 102,240" fill="#3db87a" opacity="0.7" />
                <polygon points="75,210 52,246 98,246" fill="#3db87a" opacity="0.9" />
                <rect x="68" y="244" width="14" height="20" rx="3" fill="#1a6b5a" />
                <polygon points="225,192 204,238 246,238" fill="#3db87a" opacity="0.65" />
                <polygon points="225,212 207,244 243,244" fill="#3db87a" opacity="0.85" />
                <rect x="218" y="242" width="14" height="18" rx="3" fill="#1a6b5a" />
              </svg>
            </div>

            {/* Badge CO2 */}
            <div className="absolute -bottom-2 -left-8 bg-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 z-20" style={{ animation: "floatBadge 4s ease-in-out infinite" }}>
              <div className="w-9 h-9 rounded-full bg-[#0f3d38] flex items-center justify-center" style={{ animation: "pulse 3s ease-in-out infinite" }}>
                <IonIcon icon={leafOutline} style={{ color: "#3db87a", fontSize: "18px" }} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Carbon Offset</p>
                <p className="text-sm font-black text-[#0f3d38]">+2,400 t CO₂</p>
              </div>
            </div>

            {/* Badge RES */}
            <div className="absolute -top-2 -right-8 bg-[#0f3d38] border border-[#3db87a]/30 rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 z-20" style={{ animation: "floatBadge 5s ease-in-out infinite", animationDelay: "-2.5s" }}>
              <div className="w-9 h-9 rounded-full bg-[#3db87a] flex items-center justify-center">
                <IonIcon icon={flashOutline} style={{ color: "white", fontSize: "18px" }} />
              </div>
              <div>
                <p className="text-[10px] text-[#3db87a] font-semibold uppercase tracking-wider">RES Energy</p>
                <p className="text-sm font-black text-white">98% Clean</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   STAT COUNTER
═══════════════════════════════════════════════════════════════ */
const StatCounter: React.FC<{ target: number; suffix: string; label: string; active: boolean; delay: number }> = ({ target, suffix, label, active, delay }) => {
  const value = useCounter(target, 1800, active);
  return (
    <div className="reveal" style={{ transitionDelay: `${delay}s` }}>
      <p className="text-4xl font-black text-[#3db87a]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{value}{suffix}</p>
      <div className={`progress-bar my-2 ${active ? "active" : ""}`} style={{ transitionDelay: `${delay + 0.4}s` }} />
      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{label}</p>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MISSION
═══════════════════════════════════════════════════════════════ */
const Mission: React.FC = () => {
  const ref = useInView(0.15);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsActive, setStatsActive] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsActive(true); obs.disconnect(); } }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="mission" className="bg-white py-24 px-6 md:px-16 overflow-hidden" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="reveal text-[#3db87a] text-xs font-bold tracking-[0.35em] uppercase mb-3">✦ Who we are</p>
          <h2 className="reveal delay-100 text-4xl md:text-6xl font-black text-[#0f3d38]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Our Mission</h2>
          <div className="reveal delay-200 h-1 w-16 bg-[#3db87a] rounded-full mx-auto mt-4 mb-5" />
          <p className="reveal delay-300 text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
            At EcoAlert, we work towards cleaner and smarter cities by leveraging citizen participation and real-time data. Every day, we strive to build an efficient urban waste management ecosystem, bringing together engaged communities, intelligent technologies, and innovative solutions for a more sustainable and environmentally friendly future.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Animated windmill image */}
          <div className="reveal-left flex-shrink-0 w-full md:w-[400px] h-72 md:h-[360px] rounded-3xl overflow-hidden shadow-2xl relative">
            <svg viewBox="0 0 400 360" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="missionSky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a6b5a" />
                  <stop offset="100%" stopColor="#0f3d38" />
                </linearGradient>
              </defs>
              <rect width="400" height="360" fill="url(#missionSky)" />
              <ellipse cx="200" cy="360" rx="260" ry="65" fill="#3db87a" opacity="0.2" />
              {/* Stars */}
              {[30,70,120,180,240,310,360,40,200,290].map((x,i)=>(
                <circle key={i} cx={x} cy={20+i*8} r={0.8+i%2*0.6} fill="white" opacity={0.3+i%3*0.2} />
              ))}
              {/* Turbine 1 */}
              <g transform="translate(70,195)">
                <rect x="-3" y="0" width="6" height="90" rx="3" fill="white" opacity="0.8" />
                <g style={{ animation: "windBlade 2.4s linear infinite", transformOrigin: "0 0" }}>
                  <line x1="0" y1="0" x2="0" y2="-42" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
                  <line x1="0" y1="0" x2="36" y2="21" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
                  <line x1="0" y1="0" x2="-36" y2="21" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
                </g>
                <circle cx="0" cy="0" r="5" fill="#3db87a" />
              </g>
              {/* Turbine 2 (tall) */}
              <g transform="translate(200,175)">
                <rect x="-4" y="0" width="7" height="105" rx="3" fill="white" opacity="0.85" />
                <g style={{ animation: "windBlade 3.2s linear infinite", transformOrigin: "0 0" }}>
                  <line x1="0" y1="0" x2="0" y2="-50" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
                  <line x1="0" y1="0" x2="43" y2="25" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
                  <line x1="0" y1="0" x2="-43" y2="25" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
                </g>
                <circle cx="0" cy="0" r="6" fill="#3db87a" />
              </g>
              {/* Turbine 3 */}
              <g transform="translate(330,188)">
                <rect x="-3" y="0" width="6" height="88" rx="3" fill="white" opacity="0.8" />
                <g style={{ animation: "windBlade 1.9s linear infinite", transformOrigin: "0 0" }}>
                  <line x1="0" y1="0" x2="0" y2="-40" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
                  <line x1="0" y1="0" x2="34" y2="20" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
                  <line x1="0" y1="0" x2="-34" y2="20" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
                </g>
                <circle cx="0" cy="0" r="5" fill="#3db87a" />
              </g>
              {/* Globe */}
              <circle cx="200" cy="110" r="55" fill="none" stroke="#3db87a" strokeWidth="1.5" opacity="0.5" style={{ animation: "spinSlow 22s linear infinite", transformOrigin: "200px 110px" }} />
              <ellipse cx="200" cy="110" rx="22" ry="55" fill="none" stroke="#3db87a" strokeWidth="1" opacity="0.3" />
              <line x1="145" y1="110" x2="255" y2="110" stroke="#3db87a" strokeWidth="1" opacity="0.3" />
            </svg>
            {/* Shimmer */}
            <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ background: "linear-gradient(105deg,transparent 40%,rgba(61,184,122,.5) 50%,transparent 60%)", backgroundSize: "200% 100%", animation: "shimmer 3.5s infinite" }} />
          </div>

          {/* Text block */}
          <div className="reveal-right flex-1">
            <p className="text-gray-700 text-sm leading-8 mb-5">
              <span className="text-[#0f3d38] font-bold text-base">EcoAlert</span> is an intelligent application designed{" "}
              <span className="text-[#3db87a] font-semibold">to optimize urban waste collection through citizen participation and real-time data analysis.</span>. The system is based on a simple yet effective principle: citizens report the presence of waste, illegal dumping, or overflowing bins via the app by taking photos and sharing their location. 
            </p>
            <p className="text-gray-600 text-sm leading-8 mb-8">
              Thanks to optimization algorithms, EcoAlert enables waste collection services to plan more efficient routes, thereby reducing costs, travel time, and environmental impact. The system can also anticipate high-risk areas by leveraging historical data.
            </p>
            <div className="flex gap-10 flex-wrap" ref={statsRef}>
              <StatCounter target={120} suffix="+" label="Projects" active={statsActive} delay={0} />
              <StatCounter target={40}  suffix="+" label="Experts"  active={statsActive} delay={0.15} />
              <StatCounter target={15}  suffix="+" label="Neighbourhoods" active={statsActive} delay={0.3} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   EQUIPMENT
═══════════════════════════════════════════════════════════════ */
const equipmentData = [
  { icon: gridOutline, title: "Substations", desc: "Climergia is proud to be part of the ambitious efforts to transform power production and tackle the climate change challenges." },
  { icon: carOutline, title: "EV Chargers", desc: "Electromobility is the essential transformation of the way we commute towards a greener future. We supply state-of-the-art infrastructure." },
  { icon: batteryChargingOutline, title: "Storage Systems", desc: "Successful implementation of renewable energy projects requires energy storage facilities for the safety and resilience of the grid." },
];

const Equipment: React.FC = () => {
  const ref = useInView(0.15);
  return (
    <section id="equipment" className="bg-[#f5f0e8] py-24 px-6 md:px-16 overflow-hidden" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="reveal text-[#3db87a] text-xs font-bold tracking-[0.35em] uppercase mb-3">✦ Infrastructure Solutions</p>
          <h2 className="reveal delay-100 text-4xl md:text-6xl font-black text-[#0f3d38]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Green Energy Equipment</h2>
          <div className="reveal delay-200 h-1 w-16 bg-[#3db87a] rounded-full mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {equipmentData.map((e, i) => (
            <div key={e.title} className="reveal card-hover" style={{ transitionDelay: `${0.12 * i}s` }}>
              <IonCard className="rounded-3xl overflow-hidden m-0 h-full" style={{ "--background": "#ffffff", boxShadow: "0 4px 30px rgba(15,61,56,.08)" } as React.CSSProperties}>
                <IonCardContent className="p-8">
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 rounded-2xl bg-[#3db87a]/10" style={{ animation: `pulse 3s ease-in-out infinite`, animationDelay: `${i * 0.6}s` }} />
                    <div className="relative w-full h-full rounded-2xl bg-[#f0faf4] flex items-center justify-center border border-[#3db87a]/20">
                      <IonIcon icon={e.icon} style={{ color: "#3db87a", fontSize: "26px" }} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#0f3d38] mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{e.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">{e.desc}</p>
                  <button className="group flex items-center gap-2 text-[#3db87a] text-sm font-bold">
                    Read more
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                      <IonIcon icon={chevronForwardOutline} style={{ fontSize: "16px" }} />
                    </span>
                  </button>
                </IonCardContent>
              </IonCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   CONSULTING
═══════════════════════════════════════════════════════════════ */
const servicesData = [
  { icon: leafOutline, title: "ESG Consulting Services", desc: "We want to create a strong benefit from applicable innovations that improve sustainability and reduce costs." },
  { icon: flashOutline, title: "RES Investment & Green Transition Solutions", desc: "Our company is proficient in navigating the intricate landscape of renewable energy solutions." },
  { icon: analyticsOutline, title: "Technical Advisor for Grid Connections & Electromechanical Equipment", desc: "Climergia provides in-depth consulting services centered around the cost analysis of substations and high-voltage sectors." },
];

const Consulting: React.FC = () => {
  const ref = useInView(0.15);
  return (
    <section id="consulting" className="bg-white py-24 px-6 md:px-16 overflow-hidden" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="reveal text-[#3db87a] text-xs font-bold tracking-[0.35em] uppercase mb-3">✦ Expert Guidance</p>
          <h2 className="reveal delay-100 text-4xl md:text-6xl font-black text-[#0f3d38]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Consulting Services</h2>
          <div className="reveal delay-200 h-1 w-16 bg-[#3db87a] rounded-full mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicesData.map((s, i) => (
            <div
              key={s.title}
              className="reveal card-hover rounded-3xl p-8 flex flex-col gap-5 relative overflow-hidden"
              style={{ background: "linear-gradient(145deg,#0f3d38,#1a6b5a)", transitionDelay: `${0.12 * i}s`, boxShadow: "0 8px 40px rgba(15,61,56,.25)" }}
            >
              {/* Shimmer on hover */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "linear-gradient(105deg,transparent 40%,rgba(61,184,122,.12) 50%,transparent 60%)", backgroundSize: "200% 100%", animation: "shimmer 2.5s infinite" }} />
              {/* Deco circle */}
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full border-2 border-[#3db87a]/20" style={{ animation: `spinSlow ${14 + i * 6}s linear infinite` }} />
              {/* Icon */}
              <div className="relative w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20" style={{ animation: `pulse ${2.5 + i * 0.5}s ease-in-out infinite` }}>
                <IonIcon icon={s.icon} style={{ color: "#3db87a", fontSize: "26px" }} />
              </div>
              <h3 className="text-base font-bold text-white leading-snug" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{s.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed flex-1">{s.desc}</p>
              <button className="group flex items-center gap-2 text-[#3db87a] text-sm font-bold w-fit">
                Read more
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  <IonIcon icon={chevronForwardOutline} style={{ fontSize: "16px" }} />
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   CTA BANNER
═══════════════════════════════════════════════════════════════ */
const CTABanner: React.FC = () => {
  const ref = useInView(0.3);
  return (
    <section className="py-20 px-6 md:px-16 overflow-hidden bg-[#f5f0e8]" ref={ref}>
      <div className="max-w-4xl mx-auto reveal rounded-[2rem] p-14 text-center relative overflow-hidden" style={{ background: "linear-gradient(-45deg,#0f3d38,#1a6b5a,#0f3d38,#104a3a)", backgroundSize: "400% 400%", animation: "gradientFlow 7s ease infinite" }}>
        <Particles />
        <div className="relative z-10">
          <p className="text-[#3db87a] text-xs font-bold tracking-[0.35em] uppercase mb-4">✦ Let's work together</p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Step into a greener future with EcoAlert.</h2>
          <p className="text-white/60 text-sm max-w-md mx-auto mb-8 leading-relaxed">Join the growing number of communities already embracing smarter waste management with EcoAlert. Our platform empowers citizens and city services to collaborate efficiently, driving cleaner environments through real-time alerts and intelligent solutions.</p>
          <IonButton className="btn-glow" style={{ "--background": "#3db87a", "--border-radius": "999px", "--padding-start": "38px", "--padding-end": "38px", "--padding-top": "18px", "--padding-bottom": "18px", fontWeight: "700", fontSize: "16px" } as React.CSSProperties}>
            Start your Journey
            <IonIcon icon={arrowForwardOutline} slot="end" />
          </IonButton>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════ */
const Footer: React.FC = () => (
  <footer className="bg-[#0f3d38] py-12 px-8 md:px-16">
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#3db87a] flex items-center justify-center" style={{ animation: "pulse 3s ease-in-out infinite" }}>
              <IonIcon icon={leafOutline} style={{ color: "white", fontSize: "20px" }} />
            </div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>EcoAlert</span>
          </div>
          <p className="text-white/40 text-xs max-w-xs leading-relaxed">Building a greener tomorrow through renewable energy and sustainable consulting.</p>
        </div>
        {[
          { title: "Services", items: ["ESG Consulting", "RES Investment", "Grid Advisory"] },
          { title: "Company",  items: ["Mission", "Team", "Partners", "Careers"] },
          { title: "Contact",  items: ["info@climergia.gr", "+30 210 000 0000", "Athens, Greece"] },
        ].map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <p className="text-white text-sm font-bold uppercase tracking-widest">{col.title}</p>
            {col.items.map((item) => (
              <a key={item} href="#" className="text-white/40 text-xs hover:text-[#3db87a] transition-colors duration-200">{item}</a>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/30 text-xs">© {new Date().getFullYear()} EcoAlert. All rights reserved.</p>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Use", "Cookie Policy"].map((l) => (
            <a key={l} href="#" className="text-white/30 hover:text-[#3db87a] text-xs transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ═══════════════════════════════════════════════════════════════
   PAGE ASSEMBLY
═══════════════════════════════════════════════════════════════ */
const HomePage: React.FC = () => (
  <IonPage>
    <IonContent fullscreen scrollY scrollEvents>
      <style>{globalStyles}</style>
      <Navbar />
      <Hero />
      <Mission />
      <Equipment />
      <Consulting />
      <CTABanner />
      <Footer />
    </IonContent>
  </IonPage>
);

export default HomePage;
