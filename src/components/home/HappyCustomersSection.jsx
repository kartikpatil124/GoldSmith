import React from 'react';
import DomeGallery from '../ui/DomeGallery';
import main1Img from '../../../images/main1.png';
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
import './HappyCustomersSection.css';

const CUSTOMER_IMAGES = [
  { src: main1Img, alt: 'Imperial Diamond Collection Patron' },
  { src: img2, alt: 'Solitaire Ring Unveiling' },
  { src: img3, alt: '22K Gold Bangle Custom Order' },
  { src: img4, alt: 'Artisan Diamond Drop Earrings' },
  { src: img5, alt: 'Colombian Emerald Master Suite' },
  { src: img6, alt: 'Royal Bridal Heritage Set' },
  { src: img7, alt: 'Gemstone Sapphire Pendant' },
  { src: img8, alt: 'Multi-Strand Pearl & Diamond Necklace' },
  { src: img9, alt: 'Handcrafted Bespoke Bangle' },
  { src: img10, alt: 'Custom Cut Diamond Earring' },
  { src: img11, alt: 'Goldsmith Atelier Heritage Piece' },
  { src: img12, alt: 'Bespoke Engagement Ring' },
  { src: img13, alt: 'Goldsmiths Signature Creation' },
];

export default function HappyCustomersSection() {
  return (
    <section className="happy-customers-section">
      {/* Floating Centered Header Overlay */}
      <div className="happy-customers-header">
        <span className="happy-customers-tag">COMMUNITY & PATRONAGE</span>
        <h2 className="happy-customers-title">Happy Customers Gallery</h2>
        <p className="happy-customers-subtitle">
          Drag in 3D to explore real customer moments, bespoke bridal unveilings, and celebrity heritage creations. Click any portrait to enlarge.
        </p>
      </div>

      {/* 3D React Bits DomeGallery Canvas */}
      <div className="happy-customers-dome-wrapper">
        <DomeGallery
          images={CUSTOMER_IMAGES}
          grayscale={false}
          overlayBlurColor="#0A0806"
          openedImageWidth="340px"
          openedImageHeight="460px"
          imageBorderRadius="20px"
          openedImageBorderRadius="24px"
          fit={0.6}
          minRadius={500}
        />
      </div>
    </section>
  );
}
