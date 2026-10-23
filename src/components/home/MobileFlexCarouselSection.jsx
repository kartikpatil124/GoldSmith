import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import FlexCarousel from '../ui/FlexCarousel';
import api, { getProductImage, getMediaUrl } from '../../utils/api';
import { products as fallbackProducts, formatPrice } from '../../data/products';
import './MobileFlexCarouselSection.css';

// High-resolution atelier jewellery photography assets for crisp WebGL rendering
import img1 from '../../../images/main1.png';
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

const LOCAL_GALLERY_IMAGES = [
  img1, img2, img3, img4, img5, img6,
  img7, img8, img9, img10, img11, img12
];

export default function MobileFlexCarouselSection() {
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState(() => fallbackProducts.slice(0, 12));
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch live products from backend with graceful fallback
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await api.get('/products?limit=12');
        const list = res?.success && res.data?.products ? res.data.products : res?.products;
        if (list && list.length >= 4) {
          setProductsList(list.slice(0, 12));
        }
      } catch (err) {
        // Fallback already pre-seeded
      }
    };
    fetchCatalog();
  }, []);

  // Format product items strictly adhering to FlexCarousel specifications
  const carouselItems = useMemo(() => {
    return productsList.map((p, idx) => {
      const rawImg = getProductImage(p);
      const remoteImg = rawImg ? getMediaUrl(rawImg) : null;
      // Use remote image if valid; otherwise use local high-res curated imagery
      const finalSrc = remoteImg && !remoteImg.includes('undefined')
        ? remoteImg
        : LOCAL_GALLERY_IMAGES[idx % LOCAL_GALLERY_IMAGES.length];

      const priceText = p.price ? formatPrice(p.price) : 'Price on Request';
      const categoryText = p.category || 'Atelier Collection';

      return {
        src: finalSrc,
        alt: p.name || `Jewellery Piece ${idx + 1}`,
        title: p.name || 'High Jewellery Masterpiece',
        slug: p.slug || p._id || p.id,
        id: p._id || p.id || idx
      };
    });
  }, [productsList]);

  const activeItem = carouselItems[activeIndex] || carouselItems[0];

  const handleSelectProduct = (index, item) => {
    if (item && (item.slug || item.id)) {
      navigate(`/product/${item.slug || item.id}`);
    }
  };

  return (
    <section className="mfc-section" aria-label="Liquid Lens Jewellery Gallery">
      {/* Ambient background lighting */}
      <div className="mfc-ambient-glow" aria-hidden="true" />

      {/* Luxury Section Header */}
      <div className="mfc-header">
        <span className="mfc-eyebrow">
          <span className="mfc-eyebrow-dot" />
          LIQUID REFRACTION
        </span>
        <h2 className="mfc-title">Prism Gallery</h2>
        <p className="mfc-subtitle">
          Glide through the fluid optical lens to unveil bespoke handcrafted treasures
        </p>
      </div>

      {/* Interactive WebGL FlexCarousel Container */}
      <div className="mfc-carousel-container">
        <FlexCarousel
          items={carouselItems}
          preset="ribbon"
          tilt={0}
          bend={0.38}
          reach={0.36}
          curl="twist"
          dispersion={0.42}
          roundness={1}
          intro="rise"
          cardHeight={0.44}
          centerRatio={0.39}
          gap={10}
          squeeze={0.15}
          radius={14}
          fit="portrait"
          focusOnClick={true}
          captions={true}
          captureWheel={false}
          onChange={(index, item) => setActiveIndex(index)}
          onSelect={handleSelectProduct}
        />
      </div>

      {/* Interactive Floating Action Bar */}
      {activeItem && (
        <div className="mfc-action-bar">
          <button
            type="button"
            className="mfc-explore-btn"
            onClick={() => handleSelectProduct(activeIndex, activeItem)}
            aria-label={`View details for ${activeItem.title}`}
          >
            <span>Explore Masterpiece</span>
            <svg
              className="mfc-btn-arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
