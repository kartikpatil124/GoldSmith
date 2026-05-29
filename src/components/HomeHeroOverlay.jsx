import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Diamond, Leaf, Sparkles as LucideSparkles } from 'lucide-react';
import FloatingClouds from './FloatingClouds';
import RingAnimation from './RingAnimation';
import Sparkles from './Sparkles';
import Bubbles from './Bubbles';
import { HeroTextBack, HeroTextFront } from './HeroText';

export default function HomeHeroOverlay() {
  // ─── Refs ─────────────────────────────────────────────────────────────────
  const sectionRef     = useRef(null);
  const bgRef          = useRef(null);
  const cloudBackRef   = useRef(null);
  const cloudMiddleRef = useRef(null);
  const cloudFrontRef  = useRef(null);
  const ringRef        = useRef(null);
  const textBackRef    = useRef(null);
  const textFrontRef   = useRef(null);
  const ctaRef         = useRef(null);
  const featuresRef    = useRef(null);
  const brandsRef      = useRef(null);
  const glowRef        = useRef(null);

  useEffect(() => {
    // ── Safety: grab feature children ──────────────────────────────────────
    const featureItems = featuresRef.current
      ? Array.from(featuresRef.current.children)
      : [];

    // ── Initial hidden states (all GPU transform-based, no layout props) ───
    gsap.set(bgRef.current,         { opacity: 0, scale: 1.08 });
    gsap.set(cloudBackRef.current,  { opacity: 0 });
    gsap.set(cloudMiddleRef.current,{ opacity: 0 });
    gsap.set(cloudFrontRef.current, { opacity: 0 });
    gsap.set(glowRef.current,       { opacity: 0 });

    // Ring: starts below cloud line with blur & slight tilt
    gsap.set(ringRef.current, {
      opacity: 0,
      y: 260,
      scale: 0.78,
      rotation: -12,
      filter: 'blur(16px)',
      force3D: true,
    });

    gsap.set(textBackRef.current,  { opacity: 0, y: 16 });
    gsap.set(textFrontRef.current, { opacity: 0, y: 16 });
    gsap.set(ctaRef.current,       { opacity: 0, y: 24 });
    gsap.set(featureItems,         { opacity: 0, x: 20 });
    gsap.set(brandsRef.current,    { opacity: 0, y: 10 });

    // ── Master GSAP Timeline ────────────────────────────────────────────────
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    // 0.0s — Sky background fades in
    tl.to(bgRef.current, { opacity: 1, scale: 1, duration: 0.8 }, 0);

    // 0.2s — Soft glow behind ring area
    tl.to(glowRef.current, { opacity: 1, duration: 1.2 }, 0.2);

    // 0.3s — Back cloud appears
    tl.to(cloudBackRef.current,   { opacity: 0.62, duration: 0.9 }, 0.3);

    // 0.45s — Middle cloud appears
    tl.to(cloudMiddleRef.current, { opacity: 0.72, duration: 0.9 }, 0.45);

    // 0.6s — Ring rises from below clouds (3.5s journey, power4.out for luxury feel)
    tl.to(
      ringRef.current,
      {
        opacity: 1,
        y: -14,          // slight overshoot
        scale: 1,
        rotation: 0,
        filter: 'blur(0px)',
        duration: 1.6,
        ease: 'power4.out',
      },
      0.6
    );

    // 2.1s — Ring settles from overshoot to final y:0
    tl.to(
      ringRef.current,
      { y: 0, duration: 0.9, ease: 'power2.inOut' },
      2.1
    );

    // 2.2s — Typography fades in
    tl.to([textBackRef.current, textFrontRef.current], {
      opacity: 1, y: 0, duration: 1.0, stagger: 0.12,
    }, 1.4);

    // 2.4s — Front cloud fades in (hides only base of ring)
    tl.to(cloudFrontRef.current, { opacity: 0.68, duration: 1.0 }, 1.6);

    // 2.6s — CTA fades in
    tl.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.9 }, 1.9);

    // 2.8s — Feature cards slide in from right
    tl.to(featureItems, { opacity: 1, x: 0, duration: 0.8, stagger: 0.12 }, 2.0);

    // 3.2s — Brand logos
    tl.to(brandsRef.current, { opacity: 1, y: 0, duration: 0.8 }, 2.4);

    // 3.0s — Begin subtle ring float loop after settlement
    tl.call(() => {
      gsap.to(ringRef.current, {
        y: '+=8',
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        force3D: true,
      });
    }, [], 3.0);

    // ── Parallax Mouse Interaction (gsap.quickTo — single tween per property) ─
    const bgX    = gsap.quickTo(bgRef.current,          'x', { duration: 1.2, ease: 'power2.out' });
    const bgY    = gsap.quickTo(bgRef.current,          'y', { duration: 1.2, ease: 'power2.out' });
    const cbX    = gsap.quickTo(cloudBackRef.current,   'x', { duration: 1.4, ease: 'power2.out' });
    const cbY    = gsap.quickTo(cloudBackRef.current,   'y', { duration: 1.4, ease: 'power2.out' });
    const cmX    = gsap.quickTo(cloudMiddleRef.current, 'x', { duration: 1.0, ease: 'power2.out' });
    const cmY    = gsap.quickTo(cloudMiddleRef.current, 'y', { duration: 1.0, ease: 'power2.out' });
    const cfX    = gsap.quickTo(cloudFrontRef.current,  'x', { duration: 0.8, ease: 'power2.out' });
    const cfY    = gsap.quickTo(cloudFrontRef.current,  'y', { duration: 0.8, ease: 'power2.out' });
    const ringX  = gsap.quickTo(ringRef.current,        'x', { duration: 0.7, ease: 'power2.out' });
    const ringRY = gsap.quickTo(ringRef.current,        'rotationY', { duration: 0.8, ease: 'power2.out' });
    const ringRX = gsap.quickTo(ringRef.current,        'rotationX', { duration: 0.8, ease: 'power2.out' });
    const txtX   = gsap.quickTo([textBackRef.current, textFrontRef.current], 'x', { duration: 1.0, ease: 'power2.out' });
    const txtY   = gsap.quickTo([textBackRef.current, textFrontRef.current], 'y', { duration: 1.0, ease: 'power2.out' });

    const onMouseMove = (e) => {
      const nx = e.clientX / window.innerWidth  - 0.5; // -0.5 → 0.5
      const ny = e.clientY / window.innerHeight - 0.5;

      bgX(nx * 6);   bgY(ny * 4);    // sky: very subtle — max 3px
      cbX(nx * 8);   cbY(ny * 5);    // back cloud: max 4px
      cmX(nx * 14);  cmY(ny * 8);    // mid cloud: max 7px
      cfX(nx * 20);  cfY(ny * 10);   // front cloud: max 10px
      ringX(nx * 24);                 // ring x: max 12px
      ringRY(nx * 8);                 // subtle 3D tilt
      ringRX(-ny * 6);
      txtX(nx * 12); txtY(ny * 6);   // text: max 6px
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      tl.kill();
      gsap.killTweensOf([
        bgRef.current, cloudBackRef.current, cloudMiddleRef.current,
        cloudFrontRef.current, ringRef.current, textBackRef.current,
        textFrontRef.current, ctaRef.current, glowRef.current,
        brandsRef.current, ...featureItems,
      ]);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden select-none bg-[#3a1a5e]"
      style={{
        height: '100vh',
        minHeight: 650,
        isolation: 'isolate',
      }}
    >
      {/* ─────────────────────────────────────────────────────────────────
          LAYER 0 — Sky Background
      ───────────────────────────────────────────────────────────────── */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-[0] pointer-events-none will-change-transform"
        style={{ transform: 'translate3d(0,0,0)' }}
      >
        <img
          src="/layers/sky-background.jpg"
          alt="Dreamy purple sunset sky"
          className="w-full h-full object-cover object-center"
          draggable={false}
        />
        {/* Very gentle vignette — darkens edges, not center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(20, 0, 40, 0.45) 100%)',
          }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          LAYER 1 — Atmospheric Light Rays (subtle, no harsh bloom)
      ───────────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'linear-gradient(160deg, rgba(255,200,150,0.06) 0%, transparent 50%)',
        }}
      />

      {/* ─────────────────────────────────────────────────────────────────
          LAYER 2 — Radial glow behind the ring
      ───────────────────────────────────────────────────────────────── */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none z-[3]"
        style={{
          width: '50vw',
          height: '50vw',
          maxWidth: 600,
          maxHeight: 600,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -52%)',
          background:
            'radial-gradient(circle, rgba(255, 200, 220, 0.2) 0%, rgba(200, 150, 255, 0.08) 50%, transparent 75%)',
          filter: 'blur(50px)',
          borderRadius: '50%',
        }}
      />

      {/* ─────────────────────────────────────────────────────────────────
          LAYER 5 — Back Clouds
      ───────────────────────────────────────────────────────────────── */}
      <FloatingClouds layer="back" cloudRef={cloudBackRef} />

      {/* ─────────────────────────────────────────────────────────────────
          LAYER 10 — Middle Clouds
      ───────────────────────────────────────────────────────────────── */}
      <FloatingClouds layer="middle" cloudRef={cloudMiddleRef} />

      {/* ─────────────────────────────────────────────────────────────────
          LAYER 15 — Typography BEHIND ring (POWERFUL. PURE.)
      ───────────────────────────────────────────────────────────────── */}
      <HeroTextBack textRef={textBackRef} />

      {/* ─────────────────────────────────────────────────────────────────
          LAYER 20 — Ring (focal point)
      ───────────────────────────────────────────────────────────────── */}
      <RingAnimation ringRef={ringRef} />

      {/* ─────────────────────────────────────────────────────────────────
          LAYER 25 — Typography IN FRONT of ring (Gentle)
      ───────────────────────────────────────────────────────────────── */}
      <HeroTextFront textRef={textFrontRef} />

      {/* ─────────────────────────────────────────────────────────────────
          LAYER 30 — Front Cloud (hides only base of ring)
      ───────────────────────────────────────────────────────────────── */}
      <FloatingClouds layer="front" cloudRef={cloudFrontRef} />

      {/* ─────────────────────────────────────────────────────────────────
          LAYER 33 — Sparkles (around ring center)
      ───────────────────────────────────────────────────────────────── */}
      <Sparkles />

      {/* ─────────────────────────────────────────────────────────────────
          LAYER 35 — Floating Bubbles
      ───────────────────────────────────────────────────────────────── */}
      <Bubbles />

      {/* ─────────────────────────────────────────────────────────────────
          LAYER 40 — UI Overlay: CTA left, Features right
      ───────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-[40] pointer-events-none flex flex-col justify-between">
        {/* Spacer for nav height */}
        <div className="h-16 shrink-0" />

        {/* Main content row */}
        <div className="flex items-end justify-between w-full px-8 md:px-14 lg:px-20 pb-8 md:pb-12">

          {/* LEFT — CTA */}
          <div ref={ctaRef} className="pointer-events-auto max-w-[280px]">
            <p
              className="text-white/85 text-sm md:text-base font-light leading-relaxed mb-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Timeless jewelry that empowers<br />
              your every day and celebrates<br />
              your every moment.
            </p>

            <a
              href="/shop"
              className="group inline-flex items-center gap-3 px-7 py-3 rounded-full border border-white/40 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300 hover:border-white/70 hover:shadow-[0_0_24px_rgba(255,255,255,0.15)]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span>SHOP NOW</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </div>

          {/* RIGHT — Feature Cards */}
          <div
            ref={featuresRef}
            className="pointer-events-auto flex flex-col gap-3 items-end"
          >
            {[
              {
                icon: <LucideSparkles size={16} />,
                label: 'Premium Quality',
                desc: 'Crafted to last, made to shine.',
              },
              {
                icon: <Leaf size={16} />,
                label: 'Hypoallergenic',
                desc: 'Gentle on skin, perfect for all day wear.',
              },
              {
                icon: <Diamond size={16} />,
                label: 'Timeless Design',
                desc: 'Elegant pieces for every occasion.',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-md border border-white/10 bg-black/20 hover:bg-black/30 hover:border-white/20 transition-all duration-400 max-w-[240px] w-full"
              >
                <div className="shrink-0 w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white/80">
                  {f.icon}
                </div>
                <div>
                  <div
                    className="text-white text-[11px] font-semibold leading-tight"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {f.label}
                  </div>
                  <div
                    className="text-white/55 text-[10px] leading-snug mt-0.5"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {f.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM — "TRUSTED BY" brand logos bar */}
        <div
          ref={brandsRef}
          className="pointer-events-none w-full py-4 px-8 md:px-14 lg:px-20 flex flex-col items-center gap-3 border-t border-white/8"
          style={{ background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(6px)' }}
        >
          <span
            className="text-white/40 text-[9px] font-semibold uppercase tracking-[0.25em]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Trusted By
          </span>
          <div className="flex items-center gap-8 md:gap-14 flex-wrap justify-center">
            {['VOGUE', 'allure', 'GLAMOUR', 'BYRDIE', 'InStyle'].map((brand) => (
              <span
                key={brand}
                className="text-white/45 font-semibold tracking-wide select-none"
                style={{
                  fontFamily:
                    brand === 'allure'
                      ? "'Cormorant Garamond', serif"
                      : "'Playfair Display', Georgia, serif",
                  fontSize:
                    brand === 'GLAMOUR'
                      ? 'clamp(13px, 1.6vw, 20px)'
                      : 'clamp(11px, 1.3vw, 17px)',
                  fontStyle: brand === 'allure' ? 'italic' : 'normal',
                  fontWeight: brand === 'allure' ? 400 : 700,
                }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
