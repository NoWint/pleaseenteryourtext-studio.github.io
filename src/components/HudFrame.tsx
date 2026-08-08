import type { ReactNode } from 'react';
import styles from './HudFrame.module.css';

export interface HudFrameProps {
  children: ReactNode;
  variant: 'ink' | 'paper';
  corners?: boolean;
  grid?: boolean;
  scan?: boolean;
}

export function HudFrame({
  children,
  variant,
  corners = true,
  grid = true,
  scan = true,
}: HudFrameProps) {
  return (
    <div className={`${styles.frame} ${styles[variant]}`}>
      {grid && <div className={styles.gridLayer} aria-hidden="true" />}
      {scan && <div className={styles.scanLayer} aria-hidden="true" />}
      {corners && (
        <>
          <span className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.tr}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.bl}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.br}`} aria-hidden="true" />
        </>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
