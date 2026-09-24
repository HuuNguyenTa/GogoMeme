import React from 'react';
import peekingCatImg from '../../assets/decor/peeking-cat.png';
import peekingDogImg from '../../assets/decor/peeking-dog.png';
import mushroomLanternImg from '../../assets/decor/mushroom-lantern.png';
import pawFlowerTrailImg from '../../assets/decor/paw-flower-trail.png';
import puppyKittenGardenImg from '../../assets/decor/puppy-kitten-garden.png';
import sleepingCatMoonImg from '../../assets/decor/sleeping-cat-moon.png';
import '../../styles/decor.css';

const ASSET_MAP = {
  'peeking-cat': peekingCatImg,
  'peeking-dog': peekingDogImg,
  'mushroom-lantern': mushroomLanternImg,
  'paw-trail': pawFlowerTrailImg,
  'puppy-kitten': puppyKittenGardenImg,
  'sleeping-moon': sleepingCatMoonImg
};

/**
 * Reusable Decorative Asset Component
 * Embeds art-directed mascots, edge peekers, lanterns, and dividers with
 * responsive scaling, Day/Night mode lighting, and gentle idle motion.
 *
 * @param {string} asset - One of 'peeking-cat', 'peeking-dog', 'mushroom-lantern', 'paw-trail', 'puppy-kitten', 'sleeping-moon'
 * @param {string} variant - One of 'edge-left', 'edge-right', 'corner-bottom-left', 'corner-bottom-right', 'divider', 'anchor', 'floating-moon'
 * @param {number|string} [size] - Optional width or maxWidth in pixels or CSS units
 * @param {string} [className] - Additional class names
 * @param {object} [style] - Inline style overrides
 */
export default function DecorativeAsset({
  asset,
  variant = 'edge-left',
  size,
  className = '',
  style = {}
}) {
  const imgSrc = ASSET_MAP[asset];
  if (!imgSrc) return null;

  const inlineStyle = {
    ...style,
    ...(size ? { maxWidth: typeof size === 'number' ? `${size}px` : size } : {})
  };

  return (
    <div
      className={`decor-asset-wrap decor-asset-wrap--${variant} ${className}`}
      style={inlineStyle}
      aria-hidden="true"
    >
      <img
        src={imgSrc}
        alt=""
        loading="lazy"
        decoding="async"
        className="decor-asset-img"
      />
    </div>
  );
}

