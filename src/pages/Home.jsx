import React, { useState, useEffect } from 'react';
import ShowroomWalkthroughHero from '../components/home/ShowroomWalkthroughHero';
import LuxuryShowcaseSection from '../components/home/LuxuryShowcaseSection';
import ImageTrailSection from '../components/home/ImageTrailSection';
import CategoryWheelSection from '../components/home/CategoryWheelSection';
import HappyCustomersSection from '../components/home/HappyCustomersSection';
import './Home.css';

export default function Home() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 769 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 769);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="home-page">
      {/* First Section (Kept on both mobile and desktop) */}
      <ShowroomWalkthroughHero />

      {/* Subsequent Sections (Rendered on Big Screen / Desktop Only) */}
      {isDesktop && (
        <>
          <LuxuryShowcaseSection />
          <ImageTrailSection />
          <CategoryWheelSection />
          <HappyCustomersSection />
        </>
      )}
    </div>
  );
}