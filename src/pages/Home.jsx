import React from 'react';
import ShowroomWalkthroughHero from '../components/home/ShowroomWalkthroughHero';
import LuxuryShowcaseSection from '../components/home/LuxuryShowcaseSection';
import ImageTrailSection from '../components/home/ImageTrailSection';
import CategoryWheelSection from '../components/home/CategoryWheelSection';
import HappyCustomersSection from '../components/home/HappyCustomersSection';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <ShowroomWalkthroughHero />
      <LuxuryShowcaseSection />
      <ImageTrailSection />
      <CategoryWheelSection />
      <HappyCustomersSection />
    </div>
  );
}