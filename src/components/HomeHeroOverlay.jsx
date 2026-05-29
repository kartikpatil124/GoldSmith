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

  useEffect(() => {
    const featureItems = featuresRef.current
      ? Array.from(featuresRef.current.children)
      : [];

    // ── Initial hidden states ──────────────────────────────────────────────
    gsap.set(bgRef.current,          { opacity: 0, scale: 1.06 });
    gsap.set(cloudBackRef.current,   { opacity: 0 });
    gsap.set(cloudMiddleRef.current, { opacity: 0 });
    gsap.set(cloudFrontRef.current,  { opacity: 0 });

    gsap.set(ringRef.current, {
      opacity: 0,
      y: 280,
      scale: 0.75,
      rotation: -10,
      filter: 'blur(20px)',
      force3D: true,
    });

    gsap.set(textBackRef.current,  { opacity: 0, y: 20 });
    gsap.set(textFrontRef.current, { opacity: 0, y: 20 });
    gsap.set(ctaRef.current,       { opacity: 0, y: 20 });
    gsap.set(featureItems,         { opacity: 0, x: 16 });
    gsap.set(brandsRef.current,    { opacity: 0, y: 8 });

    // ── Master Timeline ────────────────────────────────────────────────────
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    // 0.0 – Sky
    tl.to(bgRef.current, { opacity: 1, scale: 1, duration: 0.9 }, 0);

    // 0.3 – Back cloud
    tl.to(cloudBackRef.current,   { opacity: 0.65, duration: 0.9 }, 0.3);

    // 0.45 – Mid cloud
    tl.to(cloudMiddleRef.current, { opacity: 0.78, duration: 0.9 }, 0.45);

    // 0.6 – Ring rises from cloud floor with luxury power4.out
    tl.to(ringRef.current, {
      opacity: 1,
      y: -12,
      scale: 1,
      rotation: 0,
      filter: 'blur(0px)',
      duration: 1.7,
      ease: 'power4.out',
    }, 0.6);

    // 2.1 – Ring settles at y:0 (final resting position)
    tl.to(ringRef.current, { y: 0, duration: 0.8, ease: 'power2.inOut' }, 2.1);

    // 1.3 – Typography fades in
    tl.to(textBackRef.current,  { opacity: 1, y: 0, duration: 1.0 }, 1.3);
    tl.to(textFrontRef.current, { opacity: 1, y: 0, duration: 1.0 }, 1.45);

    // 1.7 – Front cloud closes over ring base
    tl.to(cloudFrontRef.current, { opacity: 0.72, duration: 1.0 }, 1.7);

    // 2.0 – UI elements
    tl.to(ctaRef.current,  { opacity: 1, y: 0, duration: 0.9 }, 2.0);
    tl.to(featureItems,    { opacity: 1, x: 0, duration: 0.8, stagger: 0.1 }, 2.1);
    tl.to(brandsRef.current, { opacity: 1, y: 0, duration: 0.8 }, 2.5);

    // 3.0 – Continuous subtle float (ring breathes)
    tl.call(() => {
      gsap.to(ringRef.current, {
        y: '+=8',
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        force3D: true,
      });
    }, [], 3.0);

    // ── Parallax (quickTo — single tween per property, no new tweens per frame) ─
    const bgX  = gsap.quickTo(bgRef.current,          'x', { duration: 1.4, ease: 'power2.out' });
    const bgY  = gsap.quickTo(bgRef.current,          'y', { duration: 1.4, ease: 'power2.out' });
    const cbX  = gsap.quickTo(cloudBackRef.current,   'x', { duration: 1.6, ease: 'power2.out' });
    const cbY  = gsap.quickTo(cloudBackRef.current,   'y', { duration: 1.6, ease: 'power2.out' });
    const cmX  = gsap.quickTo(cloudMiddleRef.current, 'x', { duration: 1.1, ease: 'power2.out' });
    const cmY  = gsap.quickTo(cloudMiddleRef.current, 'y', { duration: 1.1, ease: 'power2.out' });
    const cfX  = gsap.quickTo(cloudFrontRef.current,  'x', { duration: 0.9, ease: 'power2.out' });
    const cfY  = gsap.quickTo(cloudFrontRef.current,  'y', { duration: 0.9, ease: 'power2.out' });
    const rkX  = gsap.quickTo(ringRef.current,        'x', { duration: 0.7, ease: 'power2.out' });
    const rkRY = gsap.quickTo(ringRef.current,        'rotationY', { duration: 0.8, ease: 'power2.out' });
    const rkRX = gsap.quickTo(ringRef.current,        'rotationX', { duration: 0.8, ease: 'power2.out' });
    const txX  = gsap.quickTo([textBackRef.current, textFrontRef.current], 'x', { duration: 1.1, ease: 'power2.out' });
    const txY  = gsap.quickTo([textBackRef.current, textFrontRef.current], 'y', { duration: 1.1, ease: 'power2.out' });

    const onMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth)  - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      bgX(nx * 6);    bgY(ny * 4);
      cbX(nx * 9);    cbY(ny * 5);
      cmX(nx * 15);   cmY(ny * 8);
      cfX(nx * 22);   cfY(ny * 10);
      rkX(nx * 26);
      rkRY(nx * 7);   rkRX(-ny * 5);
      txX(nx * 14);   txY(ny * 7);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      tl.kill();
      gsap.killTweensOf([
        bgRef.current, cloudBackRef.current, cloudMiddleRef.current,
        cloudFrontRef.current, ringRef.current, textBackRef.current,
        textFrontRef.current, ctaRef.current, brandsRef.current, ...featureItems,
      ]);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden select-none"
      style={{ height: '100vh', minHeight: 640, background: '#2a0a4e' }}
    >
      {/* ── LAYER 0 – Sky Background (NO dark vignette — let the vivid sky show) ── */}
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
        {/* Extremely subtle edge darkening — keeps corners from blowing out */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 55%, rgba(10,0,25,0.30) 100%)',
          }}
        />
      </div>

      {/* ── LAYER 5 – Back Clouds ── */}
      <FloatingClouds layer="back" cloudRef={cloudBackRef} />

      {/* ── LAYER 10 – Middle Clouds ── */}
      <FloatingClouds layer="middle" cloudRef={cloudMiddleRef} />

      {/* ── LAYER 15 – POWERFUL. / PURE. (behind ring) ── */}
      <HeroTextBack textRef={textBackRef} />

      {/* ── LAYER 20 – Ring ── */}
      <RingAnimation ringRef={ringRef} />

      {/* ── LAYER 25 – Gentle (in front of ring) ── */}
      <HeroTextFront textRef={textFrontRef} />

      {/* ── LAYER 30 – Front Cloud (hides ring base) ── */}
      <FloatingClouds layer="front" cloudRef={cloudFrontRef} />

      {/* ── LAYER 33 – Sparkles ── */}
      <Sparkles />

      {/* ── LAYER 35 – Bubbles ── */}
      <Bubbles />

      {/* ──────────────────────────────────────────────────────────────────────
          LAYER 40 – UI: CTA (bottom-left) + Features (bottom-right) + Brands
      ────────────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-[40] pointer-events-none flex flex-col">

        {/* Spacer for header */}
        <div className="shrink-0" style={{ height: 'var(--header-height, 72px)' }} />

        {/* Main body — fills remaining space */}
        <div className="flex-1 flex flex-col justify-end">

          {/* CTA + Features row — pinned to bottom */}
          <div className="flex items-end justify-between w-full px-8 md:px-12 lg:px-16 pb-6">

            {/* ── BOTTOM LEFT: Tagline + Shop Now button ── */}
            <div ref={ctaRef} className="pointer-events-auto max-w-[260px]">
              <p
                className="mb-5 leading-relaxed"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(12px, 1.1vw, 15px)',
                  color: 'rgba(255,255,255,0.82)',
                  fontWeight: 300,
                }}
              >
                Timeless jewelry that empowers<br />
                your every day and celebrates<br />
                your every moment.
              </p>

              <a
                href="/shop"
                className="group inline-flex items-center gap-3 pointer-events-auto"
                style={{
                  padding: '10px 26px',
                  border: '1.5px solid rgba(255,255,255,0.6)',
                  borderRadius: '9999px',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.95)',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  backdropFilter: 'blur(4px)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.9)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
                }}
              >
                <span>SHOP NOW</span>
                <ArrowRight size={13} style={{ transition: 'transform 0.3s' }} />
              </a>
            </div>

            {/* ── BOTTOM RIGHT: Three feature items (icon + text, no card bg) ── */}
            <div
              ref={featuresRef}
              className="pointer-events-auto flex flex-col gap-4 items-start"
              style={{ maxWidth: 220 }}
            >
              {[
                {
                  icon: (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ),
                  title: 'Premium Quality',
                  desc: 'Crafted to last, made to shine.',
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  ),
                  title: 'Hypoallergenic',
                  desc: 'Gentle on skin, perfect for all day wear.',
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
                    </svg>
                  ),
                  title: 'Timeless Design',
                  desc: 'Elegant pieces for every occasion.',
                },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  {/* Small circle icon — matching the reference */}
                  <div
                    className="shrink-0 flex items-center justify-center rounded-full"
                    style={{
                      width: 32,
                      height: 32,
                      border: '1.5px solid rgba(255,255,255,0.35)',
                      background: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.95)',
                        marginBottom: 2,
                      }}
                    >
                      {f.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.62)',
                        lineHeight: 1.45,
                      }}
                    >
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── BOTTOM BAR: "TRUSTED BY" brands ── */}
          <div
            ref={brandsRef}
            className="pointer-events-none w-full"
            style={{
              padding: '14px 0 16px',
              borderTop: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(0,0,0,0.16)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* TRUSTED BY label */}
            <p
              className="text-center mb-3"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.28em',
                color: 'rgba(255,255,255,0.38)',
                textTransform: 'uppercase',
              }}
            >
              TRUSTED BY
            </p>

            {/* Brand logos — styled to match the reference */}
            <div
              className="flex items-center justify-center flex-wrap"
              style={{ gap: '32px' }}
            >
              {[
                { name: 'VOGUE',   font: "'Playfair Display', serif", size: 'clamp(14px, 1.5vw, 19px)', weight: 700, style: 'normal' },
                { name: 'allure',  font: "'Cormorant Garamond', serif", size: 'clamp(14px, 1.5vw, 20px)', weight: 400, style: 'italic' },
                { name: 'GLAMOUR', font: "'Playfair Display', serif", size: 'clamp(15px, 1.7vw, 22px)', weight: 700, style: 'normal' },
                { name: 'BYRDIE',  font: "'Inter', sans-serif",        size: 'clamp(12px, 1.3vw, 17px)', weight: 700, style: 'normal', spacing: '0.18em' },
                { name: 'InStyle', font: "'Playfair Display', serif", size: 'clamp(14px, 1.5vw, 19px)', weight: 400, style: 'italic' },
              ].map((b) => (
                <span
                  key={b.name}
                  style={{
                    fontFamily: b.font,
                    fontSize: b.size,
                    fontWeight: b.weight,
                    fontStyle: b.style,
                    letterSpacing: b.spacing || '0.04em',
                    color: 'rgba(255,255,255,0.45)',
                    userSelect: 'none',
                  }}
                >
                  {b.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
