import React from 'react';
import Silk from '../ui/Silk';
import './SilkSection.css';

export default function SilkSection() {
  return (
    <section className="silk-section-container">
      {/* Dynamic Silk Canvas Shader Background */}
      <div className="silk-bg-wrapper">
        <Silk
          speed={3.5}
          scale={1.1}
          color="#B89767"
          noiseIntensity={1.0}
          rotation={0.3}
        />
      </div>
    </section>
  );
}
