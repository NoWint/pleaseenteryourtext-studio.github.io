import type { ReactNode } from 'react';
import styles from './PrismBorder.module.css';

interface PrismBorderProps {
  children: ReactNode;
  className?: string;
}

export function PrismBorder({ children, className }: PrismBorderProps) {
  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      <div className={styles.border} aria-hidden="true" />
      {children}
    </div>
  );
}
