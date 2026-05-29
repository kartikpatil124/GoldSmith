import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, ShieldCheck, Heart, Sparkles as SparklesIcon } from 'lucide-react';
import RingAnimation from './RingAnimation';
import FloatingClouds from './FloatingClouds';
import Sparkles from './Sparkles';
import Bubbles from './Bubbles';
import { HeroTextBack, HeroTextFront } from './HeroText';

export default function HomeHeroOverlay() {
  const containerRef = useRef(null);

  const bgRef = useRef(null);
  const cloudBackRef = useRef(null);
  const cloudMiddleRef = useRef(null);
  const cloudFrontRef = useRef(null);
  const ringRef = useRef(null);
  const textBackRef = useRef(null);
  const textFrontRef = useRef(null);
  const ctaRef = useRef(null);
  const featuresRef = useRef(null);
  const raysRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const featureItems = featuresRef.current
      ? Array.from(featuresRef.current.children)
      : [];

    gsap.set(bgRef.current, { opacity: 0, scale: 1.12, x: 0, y: 0 });
    gsap.set([cloudBackRef.current, cloudMiddleRef.current, cloudFrontRef.current], {
      opacity: 0,
      scale: 1.04,
      x: 0,
      y: 0,
    });

    gsap.set(ringRef.current, {
      opacity: 0,
      y: 180,
      scale: 0.82,
      rotation: -10,
      filter: 'blur(14px)',
      force3D: true,
    });

    gsap.set([textBackRef.current, textFrontRef.current], {
      opacity: 0,
      scale: 0.98,
      x: 0,
      y: 0,
    });

    gsap.set(ctaRef.current, { opacity: 0, y: 20 });
    gsap.set(featureItems, { opacity: 0, y: 20 });
    gsap.set([raysRef.current, glowRef.current], { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.to(bgRef.current, { opacity: 1, scale: 1, duration: 0.8 }, 0)
      .to(
        [raysRef.current, glowRef.current],
        { opacity: 1, duration: 1.0 },
        0.15
      )
      .to(
        [cloudBackRef.current, cloudMiddleRef.current],
        { opacity: 1, duration: 0.9, stagger: 0.12 },
        0.2
      )
      .to(
        ringRef.current,
        {
          opacity: 1,
          y: -18,
          scale: 1,
          rotation: 0,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power4.out',
        },
        0.45
      )
      .to(
        [textBackRef.current, textFrontRef.current],
        { opacity: 1, duration: 0.9, stagger: 0.05 },
        0.8
      )
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8 }, 1.05)
      .to(featureItems, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 1.1)
      .to(
        cloudFrontRef.current,
        { opacity: 0.78, duration: 0.8 },
        1.2
      )
      .to(
        ringRef.current,
        {
          y: 0,
          duration: 0.7,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.to(ringRef.current, {
              y: '+=10',
              duration: 3.2,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              force3D: true,
            });
          },
        },
        1.9
      );

    const bgX = gsap.quickTo(bgRef.current, 'x', { duration: 0.9, ease: 'power2.out' });
    const bgY = gsap.quickTo(bgRef.current, 'y', { duration: 0.9, ease: 'power2.out' });

    const cloudBackX = gsap.quickTo(cloudBackRef.current, 'x', { duration: 1.1, ease: 'power2.out' });
    const cloudBackY = gsap.quickTo(cloudBackRef.current, 'y', { duration: 1.1, ease: 'power2.out' });

    const cloudMidX = gsap.quickTo(cloudMiddleRef.current, 'x', { duration: 0.8, ease: 'power2.out' });
    const cloudMidY = gsap.quickTo(cloudMiddleRef.current, 'y', { duration: 0.8, ease: 'power2.out' });

    const cloudFrontX = gsap.quickTo(cloudFrontRef.current, 'x', { duration: 0.6, ease: 'power2.out' });
    const cloudFrontY = gsap.quickTo(cloudFrontRef.current, 'y', { duration: 0.6, ease: 'power2.out' });

    const ringX = gsap.quickTo(ringRef.current, 'x', { duration: 0.6, ease: 'power2.out' });
    const ringY = gsap.quickTo(ringRef.current, 'y', { duration: 0.6, ease: 'power2.out' });
    const ringRotY = gsap.quickTo(ringRef.current, 'rotationY', { duration: 0.7, ease: 'power2.out' });
    const ringRotX = gsap.quickTo(ringRef.current, 'rotationX', { duration: 0.7, ease: 'power2.out' });

    const textX = gsap.quickTo([textBackRef.current, textFrontRef.current], 'x', { duration: 0.9, ease: 'power2.out' });
    const textY = gsap.quickTo([textBackRef.current, textFrontRef.current], 'y', { duration: 0.9, ease: 'power2.out' });

    const raysX = gsap.quickTo(raysRef.current, 'x', { duration: 1.0, ease: 'power2.out' });
    const raysY = gsap.quickTo(raysRef.current, 'y', { duration: 1.0, ease: 'power2.out' });

    const handleMouseMove = (e) => {
      const xPercent = e.clientX / window.innerWidth - 0.5;
      const yPercent = e.clientY / window.innerHeight - 0.5;

      bgX(xPercent * 10);
      bgY(yPercent * 8);

      cloudBackX(xPercent * 8);
      cloudBackY(yPercent * 5);

      cloudMidX(xPercent * 14);
      cloudMidY(yPercent * 8);

      cloudFrontX(xPercent * 22);
      cloudFrontY(yPercent * 12);

      ringX(xPercent * 32);
      ringY(yPercent * 22);
      ringRotY(xPercent * 10);
      ringRotX(-yPercent * 8);

      textX(xPercent * 18);
      textY(yPercent * 12);

      raysX(xPercent * 18);
      raysY(yPercent * 10);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      tl.kill();
      gsap.killTweensOf([
        bgRef.current,
        cloudBackRef.current,
        cloudMiddleRef.current,
        cloudFrontRef.current,
        ringRef.current,
        textBackRef.current,
        textFrontRef.current,
        ctaRef.current,
        raysRef.current,
        glowRef.current,
      ]);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[650px] overflow-hidden bg-black select-none"
      style={{
        '--font-display': "'Playfair Display', Georgia, serif",
        '--font-accent': "'Cormorant Garamond', Georgia, serif",
        '--font-body': "'Inter', sans-serif",
      }}
    >
      <div
        ref={bgRef}
        className="absolute inset-0 z-[0] pointer-events-none will-change-transform"
        style={{ transform: 'translate3d(0,0,0)' }}
      >
        <img
          src="/layers/sky-background.jpg"
          alt="Cinematic Dreamy Sunset Sky"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-60"
          style={{
            background:
              'radial-gradient(circle at center, transparent 28%, rgba(0, 0, 0, 0.76) 100%)',
          }}
        />
      </div>

      <div
        ref={raysRef}
        className="absolute inset-0 z-[1] pointer-events-none mix-blend-screen opacity-35 scale-105"
        style={{
          background:
            'linear-gradient(115deg, rgba(255, 235, 180, 0.10) 0%, transparent 40%, rgba(255, 235, 180, 0.05) 60%, transparent 100%)',
          filter: 'blur(4px)',
        }}
      />

      <div
        ref={glowRef}
        className="absolute top-[24%] left-1/2 -translate-x-1/2 w-[78vw] max-w-[800px] h-[34vh] rounded-full pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 218, 185, 0.14) 0%, rgba(201, 168, 76, 0.05) 50%, transparent 80%)',
          filter: 'blur(95px)',
        }}
      />

      <FloatingClouds layer="back" cloudRef={cloudBackRef} />
      <FloatingClouds layer="middle" cloudRef={cloudMiddleRef} />
      <HeroTextBack textBackRef={textBackRef} />
      <RingAnimation ringRef={ringRef} />
      <HeroTextFront textFrontRef={textFrontRef} />
      <FloatingClouds layer="front" cloudRef={cloudFrontRef} />

      <Sparkles />
      <Bubbles />

      <div className="absolute inset-0 z-[40] w-full h-full pointer-events-none flex flex-col justify-between p-6 sm:p-12 md:p-16 lg:p-20">
        <div className="h-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-end mt-auto w-full max-w-[1400px] mx-auto pb-4 sm:pb-8">
          <div
            ref={ctaRef}
            className="flex flex-col items-start text-left max-w-md pointer-events-auto"
          >
            <div className="w-12 h-px bg-amber-400/60 mb-6" />
            <p className="font-body text-sm sm:text-base font-light leading-relaxed tracking-wider text-slate-200/90 mb-8 max-w-sm">
              Timeless jewelry that empowers your every day and celebrates your every moment.
            </p>

            <a
              href="/shop"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-amber-500/10 hover:bg-amber-400/20 border border-amber-400/35 hover:border-amber-300 rounded-sm font-body text-xs font-semibold tracking-[0.2em] text-amber-100 uppercase transition-all duration-300 shadow-[0_0_20px_rgba(201,168,76,0.05)] hover:shadow-[0_0_30px_rgba(201,168,76,0.28)] hover:-translate-y-[2px]"
            >
              <span>Shop Collection</span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-2 text-amber-300" />
              <div className="absolute inset-0 rounded-sm overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transition-all duration-1000 group-hover:left-[150%]" />
              </div>
            </a>
          </div>

          <div
            ref={featuresRef}
            className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col lg:items-end gap-4 w-full sm:w-auto pointer-events-auto lg:ml-auto"
          >
            <div className="group flex flex-col items-start lg:items-end p-4 rounded-lg bg-black/35 hover:bg-black/45 border border-white/5 hover:border-amber-400/20 backdrop-blur-md transition-all duration-500 max-w-[280px] w-full shadow-lg">
              <div className="flex items-center gap-2 mb-2 lg:flex-row-reverse">
                <SparklesIcon size={14} className="text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
                <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-amber-100/90">Premium Quality</h4>
              </div>
              <p className="font-body text-[10px] sm:text-[11px] font-light text-slate-400 leading-normal lg:text-right">
                Crafted to last, made to shine.
              </p>
            </div>

            <div className="group flex flex-col items-start lg:items-end p-4 rounded-lg bg-black/35 hover:bg-black/45 border border-white/5 hover:border-amber-400/20 backdrop-blur-md transition-all duration-500 max-w-[280px] w-full shadow-lg">
              <div className="flex items-center gap-2 mb-2 lg:flex-row-reverse">
                <Heart size={14} className="text-amber-400 group-hover:scale-110 transition-transform duration-300" />
                <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-amber-100/90">Hypoallergenic</h4>
              </div>
              <p className="font-body text-[10px] sm:text-[11px] font-light text-slate-400 leading-normal lg:text-right">
                Gentle on skin, allergen free.
              </p>
            </div>

            <div className="group flex flex-col items-start lg:items-end p-4 rounded-lg bg-black/35 hover:bg-black/45 border border-white/5 hover:border-amber-400/20 backdrop-blur-md transition-all duration-500 max-w-[280px] w-full shadow-lg">
              <div className="flex items-center gap-2 mb-2 lg:flex-row-reverse">
                <ShieldCheck size={14} className="text-amber-400 group-hover:translate-y-[-1px] transition-transform duration-300" />
                <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-amber-100/90">Timeless Design</h4>
              </div>
              <p className="font-body text-[10px] sm:text-[11px] font-light text-slate-400 leading-normal lg:text-right">
                Elegant pieces for every occasion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
