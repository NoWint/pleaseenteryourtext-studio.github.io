import { Suspense, lazy, useEffect, useState } from 'react';
import { useCameraDolly } from '../hooks/useCameraDolly';
import styles from './SceneBackground.module.css';

const GaussianSplats3D = lazy(() => import('./GaussianSplats3DCanvas'));

interface Props {
  plyPath?: string;
}

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

export function SceneBackground({ plyPath }: Props) {
  const [use3D, setUse3D] = useState(false);
  const offset = useCameraDolly(true);

  useEffect(() => {
    if (!plyPath) return;
    if (!detectWebGL()) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;
    setUse3D(true);
  }, [plyPath]);

  if (use3D && plyPath) {
    return (
      <div className={styles.overlay} aria-hidden="true">
        <Suspense fallback={<div className={styles.fallback} />}>
          <GaussianSplats3D plyPath={plyPath} offset={offset} />
        </Suspense>
      </div>
    );
  }
  return <div className={styles.fallback} aria-hidden="true" />;
}
