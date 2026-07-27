import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { PyramidState } from '../types';
import {
  getRandomInt,
  getRandomColor,
  calculatePyramidSize,
  getRandomVelocity,
  getRandomRotationSpeed,
  createPyramidGeometry,
  calculateCollisionBounds,
  rotatePoint,
  project3D,
  calculateCanvasSize,
} from '../lib';

interface PyramidCanvasProps {
  pyramidCount: number;
  speedMultiplier: number;
}

export function PyramidCanvas({
  pyramidCount,
  speedMultiplier,
}: PyramidCanvasProps) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pyramidsRef = useRef<PyramidState[]>([]);
  const animationFrameRef = useRef<number>(0);
  const nextIdRef = useRef(0);
  const previousSpeedRef = useRef(1.0);

  // Handle pyramid count changes
  useEffect(() => {
    const current = pyramidsRef.current;
    const size = calculatePyramidSize();
    const geometry = createPyramidGeometry(size);
    const collisionBounds = calculateCollisionBounds(size);

    if (current.length < pyramidCount) {
      // Add pyramids
      const toAdd = pyramidCount - current.length;
      for (let i = 0; i < toAdd; i++) {
        current.push({
          id: nextIdRef.current++,
          x: getRandomInt(0, window.innerWidth - collisionBounds.width),
          y: getRandomInt(0, window.innerHeight - collisionBounds.height),
          velocityX: getRandomVelocity(1, 2) * speedMultiplier,
          velocityY: getRandomVelocity(1, 2) * speedMultiplier,
          rotationX: 0,
          rotationY: 0,
          rotationSpeedX:
            getRandomRotationSpeed(0.005, 0.02) * 0.5 * speedMultiplier,
          rotationSpeedY: getRandomRotationSpeed(0.005, 0.02) * speedMultiplier,
          color: getRandomColor(),
          size,
          collisionBounds,
          geometry,
        });
      }
    } else if (current.length > pyramidCount) {
      // Remove pyramids
      pyramidsRef.current = current.slice(0, pyramidCount);
    }
  }, [pyramidCount, speedMultiplier]);

  // Handle speed multiplier changes
  useEffect(() => {
    const multiplier = speedMultiplier / previousSpeedRef.current;
    pyramidsRef.current.forEach((pyramid) => {
      pyramid.velocityX *= multiplier;
      pyramid.velocityY *= multiplier;
      pyramid.rotationSpeedX *= multiplier;
      pyramid.rotationSpeedY *= multiplier;
    });
    previousSpeedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pyramidsRef.current.forEach((pyramid) => {
        const canvasSize = calculateCanvasSize(pyramid.size);

        const rotatedBase = pyramid.geometry.baseVertices.map((vertex) =>
          rotatePoint(vertex, pyramid.rotationX, pyramid.rotationY)
        );
        const rotatedApex = rotatePoint(
          pyramid.geometry.apexVertex,
          pyramid.rotationX,
          pyramid.rotationY
        );

        const projectedBase = rotatedBase.map((vertex) =>
          project3D(vertex.x, vertex.y, vertex.z, canvasSize)
        );
        const projectedApex = project3D(
          rotatedApex.x,
          rotatedApex.y,
          rotatedApex.z,
          canvasSize
        );

        const edges: Array<
          [{ x: number; y: number }, { x: number; y: number }]
        > = [
          [projectedBase[0], projectedBase[1]],
          [projectedBase[1], projectedBase[2]],
          [projectedBase[2], projectedBase[3]],
          [projectedBase[3], projectedBase[0]],
          [projectedApex, projectedBase[0]],
          [projectedApex, projectedBase[1]],
          [projectedApex, projectedBase[2]],
          [projectedApex, projectedBase[3]],
        ];

        ctx.strokeStyle = pyramid.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        edges.forEach(([start, end]) => {
          ctx.moveTo(pyramid.x + start.x, pyramid.y + start.y);
          ctx.lineTo(pyramid.x + end.x, pyramid.y + end.y);
        });
        ctx.stroke();
      });
    };

    if (reducedMotion) {
      renderFrame();
      return;
    }

    const animate = () => {
      pyramidsRef.current.forEach((pyramid) => {
        let nextX = pyramid.x + pyramid.velocityX;
        let nextY = pyramid.y + pyramid.velocityY;

        if (nextX <= 0) {
          nextX = 0;
          pyramid.velocityX = Math.abs(pyramid.velocityX);
          pyramid.color = getRandomColor();
        } else if (nextX + pyramid.collisionBounds.width >= window.innerWidth) {
          nextX = window.innerWidth - pyramid.collisionBounds.width;
          pyramid.velocityX = -Math.abs(pyramid.velocityX);
          pyramid.color = getRandomColor();
        }

        if (nextY <= 0) {
          nextY = 0;
          pyramid.velocityY = Math.abs(pyramid.velocityY);
          pyramid.color = getRandomColor();
        } else if (
          nextY + pyramid.collisionBounds.height >=
          window.innerHeight
        ) {
          nextY = window.innerHeight - pyramid.collisionBounds.height;
          pyramid.velocityY = -Math.abs(pyramid.velocityY);
          pyramid.color = getRandomColor();
        }

        pyramid.x = nextX;
        pyramid.y = nextY;
        pyramid.rotationX += pyramid.rotationSpeedX;
        pyramid.rotationY += pyramid.rotationSpeedY;
      });

      renderFrame();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current > 0) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [reducedMotion]);

  // Handle window resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const newSize = calculatePyramidSize();
      const newGeometry = createPyramidGeometry(newSize);
      const newCollisionBounds = calculateCollisionBounds(newSize);

      pyramidsRef.current.forEach((pyramid) => {
        pyramid.size = newSize;
        pyramid.geometry = newGeometry;
        pyramid.collisionBounds = newCollisionBounds;
        pyramid.x = Math.min(
          pyramid.x,
          window.innerWidth - newCollisionBounds.width
        );
        pyramid.y = Math.min(
          pyramid.y,
          window.innerHeight - newCollisionBounds.height
        );
      });
    };

    // Set initial size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-canvas"
    />
  );
}
