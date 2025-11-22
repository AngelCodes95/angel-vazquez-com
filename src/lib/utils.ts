/**
 * Utility functions for random number generation, colors, and sizing
 */

import { COLOR_PALETTE } from '../types';

/**
 * Generate a random integer between min and max (inclusive)
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get a random color from the predefined color palette
 */
export function getRandomColor(): string {
  const index = getRandomInt(0, COLOR_PALETTE.length - 1);
  return COLOR_PALETTE[index];
}

/**
 * Calculate responsive pyramid size based on viewport dimensions
 * Size scales with screen size but stays within reasonable bounds
 */
export function calculatePyramidSize(): number {
  const minViewportDimension = Math.min(window.innerWidth, window.innerHeight);
  const responsiveSize = minViewportDimension * 0.06; // 6% of smaller dimension
  return Math.max(25, Math.min(80, responsiveSize)); // Clamp between 25px and 80px
}

/**
 * Generate a random velocity (positive or negative)
 */
export function getRandomVelocity(min: number, max: number): number {
  const magnitude = getRandomInt(min, max);
  return Math.random() > 0.5 ? magnitude : -magnitude;
}

/**
 * Generate a random rotation speed
 */
export function getRandomRotationSpeed(
  min: number = 0.005,
  max: number = 0.02
): number {
  return min + Math.random() * (max - min);
}
