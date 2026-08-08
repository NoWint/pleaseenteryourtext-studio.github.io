import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './ScanReveal.module.css';

export interface ScanRevealProps {
  children: ReactNode;
  variant?: 'ink' | 'paper';
  delay?: number;
}

export function ScanReveal({ children, variant = 'ink', delay = 0 }: ScanRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className={styles.wrapper}>
      {!prefersReducedMotion && (
        <motion.div
          className={`${styles.scanLine} ${styles[variant]}`}
          initial={{ top: '0%', opacity: 0 }}
          whileInView={{ top: '100%', opacity: [0, 1, 1, 0] }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
          aria-hidden="true"
        />
      )}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: prefersReducedMotion ? 0 : delay + 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
