import React from 'react';
import HomeHeroOverlay from '../components/HomeHeroOverlay';

export default function Home() {
  return (
    <div className="home-page bg-black min-h-screen">
      {/* 
        This is our premium, Awwwards-winning Home Hero Overlay 
        which coordinates all cloud parallax, transparent ring reveal,
        twinkling sparkles, ambient floating bubbles, and campaign typography.
      */}
      <HomeHeroOverlay />
    </div>
  );
}