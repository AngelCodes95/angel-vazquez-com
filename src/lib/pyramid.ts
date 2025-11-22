/**
 * Pyramid geometry creation and calculations
 */

import type { PyramidGeometry, CollisionBounds } from '../types';

/**
 * Create pyramid geometry vertices based on size
 */
export function createPyramidGeometry(size: number): PyramidGeometry {
  const baseSize = size * 0.7;
  const apexHeight = size * 0.8;

  return {
    baseVertices: [
      { x: -baseSize, y: size / 2, z: -baseSize }, // front-left
      { x: baseSize, y: size / 2, z: -baseSize }, // front-right
      { x: baseSize, y: size / 2, z: baseSize }, // back-right
      { x: -baseSize, y: size / 2, z: baseSize }, // back-left
    ],
    apexVertex: { x: 0, y: -apexHeight, z: 0 },
  };
}

/**
 * Calculate canvas size needed for rotating pyramid
 * Accounts for diagonal dimension during rotation plus padding
 */
export function calculateCanvasSize(size: number): number {
  const baseSize = size * 0.7;
  const apexHeight = size * 0.8;

  // Diagonal of base when rotating
  const maxRotationDimension =
    Math.sqrt(baseSize * baseSize + baseSize * baseSize) + apexHeight;

  // 20% padding for safe rotation
  return Math.ceil(maxRotationDimension * 1.2);
}

/**
 * Calculate collision bounds for pyramid
 */
export function calculateCollisionBounds(size: number): CollisionBounds {
  const canvasSize = calculateCanvasSize(size);
  return {
    width: canvasSize,
    height: canvasSize,
  };
}

/**
 * Create small pyramid geometry for falling rain effect
 */
export function createSmallPyramidGeometry(size: number = 15): PyramidGeometry {
  return createPyramidGeometry(size);
}
