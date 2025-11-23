import { useEffect, useRef } from 'react';
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

interface PyramidWithElement extends PyramidState {
  svgElement: SVGSVGElement;
}

export function PyramidCanvas({
  pyramidCount,
  speedMultiplier,
}: PyramidCanvasProps) {
  const pyramidsRef = useRef<PyramidWithElement[]>([]);
  const animationFrameRef = useRef<number>(0);
  const nextIdRef = useRef(0);
  const previousSpeedRef = useRef(1.0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle pyramid count changes
  useEffect(() => {
    const current = pyramidsRef.current;
    const size = calculatePyramidSize();
    const geometry = createPyramidGeometry(size);
    const collisionBounds = calculateCollisionBounds(size);
    const canvasSize = calculateCanvasSize(size);

    if (current.length < pyramidCount) {
      // Add pyramids
      const toAdd = pyramidCount - current.length;
      for (let i = 0; i < toAdd; i++) {
        // Create SVG element
        const svgElement = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'svg'
        );
        svgElement.setAttribute(
          'viewBox',
          `0 0 ${canvasSize.toString()} ${canvasSize.toString()}`
        );
        svgElement.style.position = 'absolute';
        svgElement.style.width = `${canvasSize.toString()}px`;
        svgElement.style.height = `${canvasSize.toString()}px`;
        svgElement.style.pointerEvents = 'none';
        svgElement.style.zIndex = '1';

        if (containerRef.current) {
          containerRef.current.appendChild(svgElement);
        }

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
          svgElement,
        });
      }
    } else if (current.length > pyramidCount) {
      // Remove pyramids
      const toRemove = current.length - pyramidCount;
      for (let i = 0; i < toRemove; i++) {
        const pyramid = current.pop();
        if (pyramid) {
          pyramid.svgElement.remove();
        }
      }
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
    const updatePyramids = () => {
      pyramidsRef.current.forEach((pyramid) => {
        let nextX = pyramid.x + pyramid.velocityX;
        let nextY = pyramid.y + pyramid.velocityY;

        // Wall collision detection
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

        // Update SVG position
        pyramid.svgElement.style.left = `${pyramid.x.toString()}px`;
        pyramid.svgElement.style.top = `${pyramid.y.toString()}px`;

        // Render pyramid (direct DOM manipulation)
        renderPyramid(pyramid);
      });

      animationFrameRef.current = requestAnimationFrame(updatePyramids);
    };

    animationFrameRef.current = requestAnimationFrame(updatePyramids);

    return () => {
      if (animationFrameRef.current > 0) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newSize = calculatePyramidSize();
      const newGeometry = createPyramidGeometry(newSize);
      const newCollisionBounds = calculateCollisionBounds(newSize);
      const newCanvasSize = calculateCanvasSize(newSize);

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

        // Update SVG element size
        pyramid.svgElement.setAttribute(
          'viewBox',
          `0 0 ${newCanvasSize.toString()} ${newCanvasSize.toString()}`
        );
        pyramid.svgElement.style.width = `${newCanvasSize.toString()}px`;
        pyramid.svgElement.style.height = `${newCanvasSize.toString()}px`;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed top-0 left-0 w-full h-full" />
  );
}

function renderPyramid(pyramid: PyramidWithElement) {
  const canvasSize = calculateCanvasSize(pyramid.size);

  // Clear existing lines
  pyramid.svgElement.innerHTML = '';

  // Rotate vertices
  const rotatedBase = pyramid.geometry.baseVertices.map((vertex) =>
    rotatePoint(vertex, pyramid.rotationX, pyramid.rotationY)
  );
  const rotatedApex = rotatePoint(
    pyramid.geometry.apexVertex,
    pyramid.rotationX,
    pyramid.rotationY
  );

  // Project to 2D
  const projectedBase = rotatedBase.map((vertex) =>
    project3D(vertex.x, vertex.y, vertex.z, canvasSize)
  );
  const projectedApex = project3D(
    rotatedApex.x,
    rotatedApex.y,
    rotatedApex.z,
    canvasSize
  );

  // Define edges
  const edges: Array<[{ x: number; y: number }, { x: number; y: number }]> = [
    // Base square
    [projectedBase[0], projectedBase[1]],
    [projectedBase[1], projectedBase[2]],
    [projectedBase[2], projectedBase[3]],
    [projectedBase[3], projectedBase[0]],
    // Apex to base
    [projectedApex, projectedBase[0]],
    [projectedApex, projectedBase[1]],
    [projectedApex, projectedBase[2]],
    [projectedApex, projectedBase[3]],
  ];

  // Draw edges
  edges.forEach(([start, end]) => {
    const lineElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'line'
    );
    lineElement.setAttribute('x1', start.x.toString());
    lineElement.setAttribute('y1', start.y.toString());
    lineElement.setAttribute('x2', end.x.toString());
    lineElement.setAttribute('y2', end.y.toString());
    lineElement.setAttribute('stroke', pyramid.color);
    lineElement.setAttribute('stroke-width', '1.5');
    lineElement.setAttribute('fill', 'none');
    pyramid.svgElement.appendChild(lineElement);
  });
}
