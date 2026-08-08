import { useEffect, useRef, useState } from 'react';

export interface CameraOffset {
  x: number;
  y: number;
  z: number;
}

export const SAFE_RANGE = {
  translate: 0.8,
  push: 2.0,
};

function clampPosition(o: CameraOffset): CameraOffset {
  return {
    x: Math.max(-SAFE_RANGE.translate, Math.min(SAFE_RANGE.translate, o.x)),
    y: Math.max(-SAFE_RANGE.translate, Math.min(SAFE_RANGE.translate, o.y)),
    z: Math.max(0, Math.min(SAFE_RANGE.push, o.z)),
  };
}

function breathingOffset(tSec: number, periodSec: number): CameraOffset {
  const phase = (tSec % periodSec) / periodSec;
  const twoPi = Math.PI * 2;
  return clampPosition({
    x: 0.15 * Math.sin(phase * twoPi),
    y: 0.08 * Math.sin(phase * twoPi),
    z: 0.04 * Math.sin(phase * Math.PI),
  });
}

function parallaxOffset(mouseX: number, mouseY: number, strength: number): CameraOffset {
  return clampPosition({
    x: mouseX * strength,
    y: mouseY * strength,
    z: 0,
  });
}

export function useCameraDolly(active: boolean): CameraOffset {
  const [offset, setOffset] = useState<CameraOffset>({ x: 0, y: 0, z: 0 });
  const startRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const mouseCacheRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseCacheRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    let raf = 0;
    const smoothMouse = () => {
      mouseRef.current.x += (mouseCacheRef.current.x - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseCacheRef.current.y - mouseRef.current.y) * 0.08;
      raf = requestAnimationFrame(smoothMouse);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(smoothMouse);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    startRef.current = performance.now();
    const loop = (now: number) => {
      const tSec = (now - startRef.current) / 1000;
      const breath = breathingOffset(tSec, 6);
      const parallax = parallaxOffset(mouseRef.current.x, mouseRef.current.y, 0.2);
      setOffset(clampPosition({
        x: breath.x + parallax.x,
        y: breath.y + parallax.y,
        z: breath.z + parallax.z,
      }));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return offset;
}
