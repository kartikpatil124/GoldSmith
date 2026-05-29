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
  
  // Element Refs for animations & parallax
  const bgRef = useRef(null);
  const cloudBackRef = useRef(null);
  const cloudMiddleRef = useRef(null);
  const cloudFrontRef = useRef(null);
  const ringRef = useRef(null);
  const textBackRef = useRef(null);
  const textFrontRef = useRef(null);
  const ctaRef = useRef(null);
  const featuresRef = useRef(null);
  
  // Atmosphere Refs
  const raysRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    // ------------------------------------------------------------
    // 1. Initial State Configuration (Using GPU Accelerated Properties)
    // ------------------------------------------------------------
    gsap.set(bgRef.current, { opacity: 0, scale: 1.15, transformPerspective: 1000 });
    gsap.set([cloudBackRef.current, cloudMiddleRef.current, cloudFrontRef.current], { opacity: 0, scale: 1.08 });
    
    // Ring Start State (Step 3 requirements)
    gsap.set(ringRef.current, {
      opacity: 0,
      y: 400,
      scale: 0.7,
      rotation: -15,
      filter: 'blur(20px)',
      transformPerspective: 1000,
      force3D: true
    });
    
    // UI elements start state
    gsap.set([textBackRef.current, textFrontRef.current], { opacity: 0, scale: 0.95 });
    gsap.set(ctaRef.current, { opacity: 0, x: -60, transformPerspective: 1000 });
    gsap.set(featuresRef.current.children, { opacity: 0, x: 60, transformPerspective: 1000 });
    gsap.set([raysRef.current, glowRef.current], { opacity: 0 });

    // ------------------------------------------------------------
    // 2. Entrance Animation Timeline (GSAP Orchestrated Sequence)
    // ------------------------------------------------------------
    const mainTimeline = gsap.timeline();

    // Step 1: Background fades in (0.8s)
    mainTimeline.to(bgRef.current, {
      opacity: 1,
      scale: 1.1,
      duration: 0.8,
      ease: 'power2.out',
    });

    // Step 2: Cloud layers fade in (1s) + Atmosphere glow
    mainTimeline.to([cloudBackRef.current, cloudMiddleRef.current, cloudFrontRef.current], {
      opacity: 1,
      duration: 1,
      stagger: 0.15,
      ease: 'sine.out',
    }, '-=0.4');

    mainTimeline.to([raysRef.current, glowRef.current], {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.inOut',
    }, '-=0.8');

    // Step 3 & 4: Ring Reveal Animation (3.5s, Ease: power4.out, emerges from cloud layer)
    // We implement the Overshoot Effect inside the timeline
    mainTimeline.to(ringRef.current, {
      opacity: 1,
      // Target position overshoot by 30px vertically (-30px from center 0)
      y: -30, 
      scale: 1,
      rotation: 0,
      filter: 'blur(0px)',
      duration: 3.5,
      ease: 'power4.out',
    }, '-=0.4');

    // Step 4: Settle naturally back to center (0px)
    mainTimeline.to(ringRef.current, {
      y: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => {
        // Start infinite floating after reveal finishes (Step 5)
        startFloatingLoop();
      }
    }, '-=0.8');

    // Entrance of Hero Typography, CTA & Features (staggered during ring settle)
    mainTimeline.to([textBackRef.current, textFrontRef.current], {
      opacity: 1,
      scale: 1,
      duration: 2.0,
      ease: 'power3.out',
    }, '-=4.0');

    mainTimeline.to(ctaRef.current, {
      opacity: 1,
      x: 0,
      duration: 1.5,
      ease: 'power3.out',
    }, '-=3.2');

    mainTimeline.to(featuresRef.current.children, {
      opacity: 1,
      x: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power3.out',
    }, '-=2.8');

    // ------------------------------------------------------------
    // 3. Step 5: Continuous Floating Animation (Infinite Loop)
    // ------------------------------------------------------------
    let floatingTween;
    function startFloatingLoop() {
      floatingTween = gsap.to(ringRef.current, {
        y: '+=12', // move down by 12px from current settle point
        duration: 3, // 3s down, 3s back up = 6s total loop time
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        force3D: true,
      });
    }

    // ------------------------------------------------------------
    // 4. Mouse Move Parallax Effect (Stereoscopic 3D Depth)
    // ------------------------------------------------------------
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      
      // Calculate cursor offset percentage from center (-0.5 to 0.5)
      const xPercent = (clientX / window.innerWidth) - 0.5;
      const yPercent = (clientY / window.innerHeight) - 0.5;

      // Ring Parallax (max movement 25px)
      // If currently floating, we interpolate the cursor influence on top
      gsap.to(ringRef.current, {
        x: xPercent * 50, // max 25px left/right
        y: yPercent * 50 + (floatingTween ? parseFloat(gsap.getProperty(ringRef.current, 'y')) : 0), 
        rotationY: xPercent * 15, // luxury 3D tilt
        rotationX: -yPercent * 15,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      // Hero Text Parallax (middle speed)
      gsap.to([textBackRef.current, textFrontRef.current], {
        x: xPercent * 36, // max 18px
        y: yPercent * 36,
        duration: 1.0,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      // Clouds Parallax (max movement 15px)
      // Front clouds move faster, back clouds move slower
      gsap.to(cloudFrontRef.current, {
        x: xPercent * 30, // max 15px
        y: yPercent * 15,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      gsap.to(cloudMiddleRef.current, {
        x: xPercent * 20, // max 10px
        y: yPercent * 10,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      gsap.to(cloudBackRef.current, {
        x: xPercent * 12, // max 6px
        y: yPercent * 6,
        duration: 1.2,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      // Background Sky Parallax (max movement 8px)
      gsap.to(bgRef.current, {
        x: xPercent * 16, // max 8px
        y: yPercent * 8,
        duration: 1.5,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      // Volumetric Atmosphere Ray drift
      gsap.to(raysRef.current, {
        x: xPercent * 25,
        y: yPercent * 12,
        duration: 1.8,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Clean up event listeners and tweens on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (floatingTween) floatingTween.kill();
      mainTimeline.kill();
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[100vh] min-h-[650px] overflow-hidden bg-black select-none"
      style={{
        // Global typography & styling overrides
        '--font-display': "'Playfair Display', Georgia, serif",
        '--font-accent': "'Cormorant Garamond', Georgia, serif",
        '--font-body': "'Inter', sans-serif",
      }}
    >
      {/* ------------------------------------------------------------
          ATMOSPHERE EFFECTS & LAYERS
          ------------------------------------------------------------ */}

      {/* Layer 1: Background Sky (Sunset Sky) */}
      <div 
        ref={bgRef}
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 scale-110"
      >
        <img 
          src="/layers/sky-background.jpg" 
          alt="Cinematic Dreamy Sunset Sky" 
          className="w-full h-full object-cover"
        />
        {/* Soft dark vignette gradient to enhance central luxury focus */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-60"
          style={{
            background: 'radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.75) 100%)'
          }}
        />
      </div>

      {/* Volumetric Light Rays (Angled ambient shimmer) */}
      <div 
        ref={raysRef}
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40 z-1 pointer-events-none scale-105"
        style={{
          background: 'linear-gradient(115deg, rgba(255, 235, 180, 0.12) 0%, transparent 40%, rgba(255, 235, 180, 0.05) 60%, transparent 100%)',
          filter: 'blur(4px)',
        }}
      />

      {/* Atmospheric Fog / Cloud Glow */}
      <div 
        ref={glowRef}
        className="absolute top-[25%] left-[50%] -translate-x-[50%] w-[80vw] max-w-[800px] h-[35vh] rounded-full pointer-events-none z-1"
        style={{
          background: 'radial-gradient(circle, rgba(255, 218, 185, 0.15) 0%, rgba(201, 168, 76, 0.05) 50%, transparent 80%)',
          filter: 'blur(100px)',
        }}
      />

      {/* ------------------------------------------------------------
          3D DEPTH LAYERS & COMPONENTS
          ------------------------------------------------------------ */}

      {/* Layer 2: Cloud Back (Behind text & ring) */}
      <FloatingClouds layer="back" cloudRef={cloudBackRef} />

      {/* Layer 3: Cloud Middle (Behind text & ring) */}
      <FloatingClouds layer="middle" cloudRef={cloudMiddleRef} />

      {/* Layer 4: Text Back (POWERFUL. PURE.) (Z-index 15, Behind Ring) */}
      <HeroTextBack textBackRef={textBackRef} />

      {/* Layer 5: Luxury Diamond Ring (Z-index 20) */}
      <RingAnimation ringRef={ringRef} />

      {/* Layer 6: Text Front (Gentle) (Z-index 25, In Front of Ring) */}
      <HeroTextFront textFrontRef={textFrontRef} />

      {/* Layer 7: Cloud Front (Foreground Z-index 30, above text/ring) */}
      <FloatingClouds layer="front" cloudRef={cloudFrontRef} />

      {/* Sparkles Particle Layer (Four-point twinkling stars & dust) */}
      <Sparkles />

      {/* Translucent Glassmorphic Floating Bubbles Layer */}
      <Bubbles />

      {/* ------------------------------------------------------------
          UI / INTERACTIVE CONTENT OVERLAYS (Z-index 40)
          ------------------------------------------------------------ */}
      <div className="absolute inset-0 z-40 w-full h-full pointer-events-none flex flex-col justify-between p-6 sm:p-12 md:p-16 lg:p-20">
        
        {/* Empty header spacer matching navbar spacing */}
        <div className="h-10 pointer-events-none" />

        {/* Dynamic CTA & Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-end mt-auto w-full max-w-[1400px] mx-auto pb-4 sm:pb-8">
          
          {/* LEFT COLUMN: Luxurious Campaign CTA */}
          <div 
            ref={ctaRef}
            className="flex flex-col items-start text-left max-w-md pointer-events-auto"
          >
            <div className="w-12 h-[1px] bg-amber-400/60 mb-6" />
            <p className="font-body text-sm sm:text-base font-light leading-relaxed tracking-wider text-slate-200/90 mb-8 max-w-sm">
              Timeless jewelry that empowers your every day and celebrates your every moment.
            </p>
            
            {/* Elegant Luxury Shop Button */}
            <a 
              href="/shop" 
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-amber-500/10 hover:bg-amber-400/25 border border-amber-400/40 hover:border-amber-300 rounded-sm font-body text-xs font-semibold tracking-[0.2em] text-amber-100 uppercase transition-all duration-300 shadow-[0_0_20px_rgba(201,168,76,0.05)] hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] hover:-translate-y-[2px]"
            >
              <span>Shop Collection</span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-2 text-amber-300" />
              
              {/* Subtle shining border sweep highlight */}
              <div className="absolute inset-0 rounded-sm overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transition-all duration-1000 group-hover:left-[150%]" />
              </div>
            </a>
          </div>

          {/* RIGHT COLUMN: Three Premium Features */}
          <div 
            ref={featuresRef}
            className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col lg:items-end gap-4 w-full sm:w-auto pointer-events-auto lg:ml-auto"
          >
            {/* Feature 1 */}
            <div className="group flex flex-col items-start lg:items-end p-4 rounded-lg bg-black/35 hover:bg-black/45 border border-white/5 hover:border-amber-400/20 backdrop-blur-md transition-all duration-500 max-w-[280px] w-full shadow-lg">
              <div className="flex items-center gap-2 mb-2 lg:flex-row-reverse">
                <SparklesIcon size={14} className="text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
                <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-amber-100/90">Premium Quality</h4>
              </div>
              <p className="font-body text-[10px] sm:text-[11px] font-light text-slate-400 leading-normal lg:text-right">
                Crafted to last, made to shine.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group flex flex-col items-start lg:items-end p-4 rounded-lg bg-black/35 hover:bg-black/45 border border-white/5 hover:border-amber-400/20 backdrop-blur-md transition-all duration-500 max-w-[280px] w-full shadow-lg">
              <div className="flex items-center gap-2 mb-2 lg:flex-row-reverse">
                <Heart size={14} className="text-amber-400 group-hover:scale-110 transition-transform duration-300" />
                <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-amber-100/90">Hypoallergenic</h4>
              </div>
              <p className="font-body text-[10px] sm:text-[11px] font-light text-slate-400 leading-normal lg:text-right">
                Gentle on skin, allergen free.
              </p>
            </div>

            {/* Feature 3 */}
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
