import { useEffect, useMemo, useRef, useState } from 'react';
import type { CameraOffset } from '../hooks/useCameraDolly';
import styles from './GaussianSplats3DCanvas.module.css';

export interface Props {
  plyPath: string;
  offset: CameraOffset;
}

const BASE_CAM_POS: readonly [number, number, number] = [0, 0, 1.8];
const CAM_LOOK_AT: readonly [number, number, number] = [0, 0, 0];
const CAM_FOV = 45;
const LOAD_TIMEOUT_MS = 30_000;

function detectWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    const ctx = c.getContext('webgl2');
    if (ctx) {
      const lose = ctx.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
    }
    return !!ctx;
  } catch {
    return false;
  }
}

type LoadState = 'idle' | 'loading' | 'ready' | 'failed';

export default function GaussianSplats3DCanvas({ plyPath, offset }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<{ dispose: () => void; camera: unknown; start: () => void; addSplatScene: (path: string, opts: Record<string, unknown>) => Promise<void> } | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [errorDetail, setErrorDetail] = useState('');
  const webglOk = useMemo(() => detectWebGL(), []);

  useEffect(() => {
    if (!webglOk || !containerRef.current || !plyPath) return;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    setLoadState('loading');
    setErrorDetail('');

    (async () => {
      try {
        const mod = await import('@mkkellogg/gaussian-splats-3d');
        const Viewer = (mod as { Viewer: new (opts: Record<string, unknown>) => { dispose: () => void; camera: unknown; start: () => void; addSplatScene: (path: string, opts: Record<string, unknown>) => Promise<void> } }).Viewer;
        if (!Viewer) throw new Error('Viewer export not found');

        const crossIsolated = typeof self !== 'undefined' && (self as unknown as { crossOriginIsolated?: boolean }).crossOriginIsolated === true;

        const viewer = new Viewer({
          rootElement: containerRef.current,
          initialCameraPosition: [...BASE_CAM_POS] as [number, number, number],
          initialCameraLookAt: [...CAM_LOOK_AT] as [number, number, number],
          cameraUp: [0, 1, 0],
          selfDrivenMode: true,
          useBuiltInControls: false,
          sharedMemoryForWorkers: crossIsolated,
          enableSIMDInSort: crossIsolated,
          gpuAcceleratedSort: false,
          antialiased: true,
          integerBasedSort: false,
          halfPrecisionCovariancesOnGPU: false,
          sceneFadeInRateMultiplier: 5.0,
          sphericalHarmonicsDegree: 2,
        });

        const cam = viewer.camera as { isPerspectiveCamera?: boolean; fov?: number; updateProjectionMatrix?: () => void } | undefined;
        if (cam && cam.isPerspectiveCamera && cam.fov !== undefined) {
          cam.fov = CAM_FOV;
          cam.updateProjectionMatrix?.();
        }

        viewer.start();

        timeoutId = setTimeout(() => {
          if (!cancelled && viewerRef.current === null) {
            try { viewer.dispose(); } catch { /* ignore */ }
            if (!cancelled) {
              setLoadState('failed');
              setErrorDetail('Load timed out');
            }
          }
        }, LOAD_TIMEOUT_MS);

        await viewer.addSplatScene(plyPath, {
          progressiveLoad: false,
          rotation: [1, 0, 0, 0],
          showLoadingUI: false,
        });

        if (cancelled) {
          viewer.dispose();
          return;
        }
        if (timeoutId) clearTimeout(timeoutId);
        viewerRef.current = viewer;
        setLoadState('ready');
      } catch (err) {
        const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
        if (timeoutId) clearTimeout(timeoutId);
        if (!cancelled) {
          setLoadState('failed');
          setErrorDetail(msg);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (viewerRef.current) {
        viewerRef.current.dispose();
        viewerRef.current = null;
      }
    };
  }, [plyPath, webglOk]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const cam = viewer.camera as { position: { set: (x: number, y: number, z: number) => void }; lookAt: (x: number, y: number, z: number) => void } | undefined;
    if (!cam) return;
    cam.position.set(
      BASE_CAM_POS[0] - offset.x,
      BASE_CAM_POS[1] - offset.y,
      BASE_CAM_POS[2] - offset.z,
    );
    cam.lookAt(
      CAM_LOOK_AT[0] - offset.x * 0.5,
      CAM_LOOK_AT[1] - offset.y * 0.5,
      CAM_LOOK_AT[2],
    );
  }, [offset]);

  if (!webglOk || loadState === 'failed') {
    return (
      <div className={styles.fallback}>
        {loadState === 'failed' && errorDetail && (
          <div className={styles.error}>3D LOAD FAILED: {errorDetail}</div>
        )}
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} className={styles.container} aria-hidden="true" />
      {loadState === 'loading' && (
        <div className={styles.loading}>
          <span className={styles.loadingText}>LOADING 3D SCENE</span>
        </div>
      )}
    </>
  );
}
