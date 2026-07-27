/**
 * Type definitions for 3D pyramid portfolio application
 */

/**
 * Chat message interface
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

/**
 * Chat state interface
 */
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

/**
 * 3D coordinate in space
 */
export interface Point3D {
  x: number;
  y: number;
  z: number;
}

/**
 * 2D coordinate on screen
 */
export interface Point2D {
  x: number;
  y: number;
}

/**
 * Collision bounds for pyramid hit detection
 */
export interface CollisionBounds {
  width: number;
  height: number;
}

/**
 * Pyramid 3D geometry vertices
 */
export interface PyramidGeometry {
  /** Four corner vertices of the pyramid base */
  baseVertices: [Point3D, Point3D, Point3D, Point3D];
  /** Top apex point of the pyramid */
  apexVertex: Point3D;
}

/**
 * State data for a bouncing pyramid instance
 */
export interface PyramidState {
  /** Unique identifier */
  id: number;
  /** Screen X position */
  x: number;
  /** Screen Y position */
  y: number;
  /** Horizontal velocity */
  velocityX: number;
  /** Vertical velocity */
  velocityY: number;
  /** X-axis rotation in radians */
  rotationX: number;
  /** Y-axis rotation in radians */
  rotationY: number;
  /** X-axis rotation speed */
  rotationSpeedX: number;
  /** Y-axis rotation speed */
  rotationSpeedY: number;
  /** Hex color value */
  color: string;
  /** Pyramid size in pixels */
  size: number;
  /** Collision detection bounds */
  collisionBounds: CollisionBounds;
  /** 3D geometry vertices */
  geometry: PyramidGeometry;
}

/**
 * State data for a falling pyramid (background rain effect)
 */
export interface FallingPyramidState {
  /** Unique identifier */
  id: number;
  /** Screen X position */
  x: number;
  /** Screen Y position */
  y: number;
  /** Fall speed (pixels per frame) */
  fallSpeed: number;
  /** X-axis rotation in radians */
  rotationX: number;
  /** Y-axis rotation in radians */
  rotationY: number;
  /** X-axis rotation speed */
  rotationSpeedX: number;
  /** Y-axis rotation speed */
  rotationSpeedY: number;
  /** Opacity (0-1) */
  opacity: number;
  /** Pyramid size in pixels */
  size: number;
}

/**
 * Game configuration constants
 */
export interface GameConfig {
  /** Initial number of pyramids on load */
  initialPyramidCount: number;
  /** Maximum allowed pyramids */
  maxPyramids: number;
  /** Minimum allowed pyramids */
  minPyramids: number;
  /** Default speed multiplier */
  defaultSpeed: number;
  /** Maximum speed multiplier */
  maxSpeed: number;
  /** Minimum speed multiplier */
  minSpeed: number;
  /** Interval for spawning falling pyramids (ms) */
  fallingPyramidInterval: number;
}

/**
 * Color palette for pyramids
 */
export const COLOR_PALETTE = [
  '#ffffff',
  '#ff6b35',
  '#f7931e',
  '#ffd100',
  '#90ee02',
  '#00d4aa',
  '#0099cc',
  '#951b81',
] as const;

/**
 * Default game configuration
 */
export const DEFAULT_GAME_CONFIG: GameConfig = {
  initialPyramidCount: 3,
  maxPyramids: 9,
  minPyramids: 3,
  defaultSpeed: 1.0,
  maxSpeed: 9.0,
  minSpeed: 1.0,
  fallingPyramidInterval: 800,
};
