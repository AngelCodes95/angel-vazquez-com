/**
 * 3D geometry transformations and projections
 */

import type { Point3D, Point2D } from '../types';

/**
 * Project 3D coordinates to 2D screen coordinates using orthographic projection
 * No perspective distortion - maintains consistent size regardless of depth
 */
export function project3D(
  x: number,
  y: number,
  z: number,
  canvasSize: number
): Point2D {
  const centerOffset = canvasSize / 2;
  return {
    x: x + centerOffset,
    y: y + centerOffset,
  };
}

/**
 * Rotate a 3D point around the Y-axis (horizontal spinning)
 */
export function rotateAroundY(
  x: number,
  y: number,
  z: number,
  angleRadians: number
): Point3D {
  const cosAngle = Math.cos(angleRadians);
  const sinAngle = Math.sin(angleRadians);

  return {
    x: x * cosAngle + z * sinAngle,
    y: y,
    z: -x * sinAngle + z * cosAngle,
  };
}

/**
 * Rotate a 3D point around the X-axis (vertical tilting)
 */
export function rotateAroundX(
  x: number,
  y: number,
  z: number,
  angleRadians: number
): Point3D {
  const cosAngle = Math.cos(angleRadians);
  const sinAngle = Math.sin(angleRadians);

  return {
    x: x,
    y: y * cosAngle - z * sinAngle,
    z: y * sinAngle + z * cosAngle,
  };
}

/**
 * Apply both X and Y rotations to a 3D point
 */
export function rotatePoint(
  point: Point3D,
  rotationX: number,
  rotationY: number
): Point3D {
  const afterY = rotateAroundY(point.x, point.y, point.z, rotationY);
  return rotateAroundX(afterY.x, afterY.y, afterY.z, rotationX);
}

/**
 * Apply rotations to multiple points
 */
export function rotatePoints(
  points: Point3D[],
  rotationX: number,
  rotationY: number
): Point3D[] {
  return points.map((point) => rotatePoint(point, rotationX, rotationY));
}
