import React from 'react';
import ScrollExpand from '../ui/ScrollExpand';
import main1Img from '../../../images/main1.png';
import './CinematicScrollRevealSection.css';

/*
  Cinematic Scroll Image Reveal Section
  ─────────────────────────────────────────────────────────────
  Scroll-driven expanding frame showcasing main1.png with an
  intimate starting focal crop on the neck & diamond necklace
  unfolding smoothly to full-bleed edge-to-edge campaign display.
*/

export default function CinematicScrollRevealSection() {
  return (
    <section className="cinematic-scroll-reveal-section">
      <ScrollExpand
        mediaSrc={main1Img}
        alt="Royal Atelier Diamond Necklace Reveal"
        startWidth="82vw"
        startHeight="40vh"
        startRadius={34}
        endRadius={0}
        mediaZoom={1.38}
        focalPosition="center 38%"
        scrollDistanceVh={170}
        holdDistanceVh={45}
        subtitle="ROYAL ATELIER"
        title="The Imperial Diamond Masterpiece"
        tagline="SCROLL TO REVEAL"
      />
    </section>
  );
}
