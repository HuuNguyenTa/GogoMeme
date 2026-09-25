import React from 'react';
import PixelPet from './PixelPet';
import './pixel-pets.css';

export default function PixelPetsOverlay() {
  return (
    <div className="pixel-pets-overlay" aria-hidden="true">
      <PixelPet kind="dog" lane="left" />
      <PixelPet kind="cat" lane="right" />
    </div>
  );
}
