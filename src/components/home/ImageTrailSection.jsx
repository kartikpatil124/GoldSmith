import React from 'react';
import ImageTrail from '../ui/ImageTrail';
import img2 from '../../../images/ChatGPT Image Jul 26, 2026, 12_18_39 AM.png';
import img3 from '../../../images/ChatGPT Image Jul 26, 2026, 12_18_43 AM.png';
import img4 from '../../../images/ChatGPT Image Jul 26, 2026, 12_18_46 AM.png';
import img5 from '../../../images/ChatGPT Image Jul 26, 2026, 12_22_37 AM.png';
import img6 from '../../../images/ChatGPT Image Jul 27, 2026, 12_01_57 AM.png';
import img7 from '../../../images/ChatGPT Image Jul 27, 2026, 12_01_59 AM.png';
import img8 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_01 AM.png';
import img9 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_03 AM.png';
import img10 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_05 AM.png';
import img11 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_08 AM.png';
import img12 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_10 AM.png';
import img13 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_12 AM.png';
import main1Img from '../../../images/main1.png';
import './ImageTrailSection.css';

const TRAIL_IMAGES = [
  main1Img, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13
];

export default function ImageTrailSection() {
  return (
    <section className="image-trail-section">
      {/* Full-bleed section canvas wrapper for borderless image trail */}
      <div className="image-trail-full-wrapper">
        <ImageTrail items={TRAIL_IMAGES} variant={1} />
      </div>

      {/* Centered header content floating over full section */}
      <div className="image-trail-header">
        <span className="image-trail-tag">INTERACTIVE GALLERY</span>
        <h2 className="image-trail-title">The Artisan Archive</h2>
      </div>
    </section>
  );
}
