import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './SliceReveal.module.css';

export interface SliceRevealProps {
  children: ReactNode;
  variant?: 'ink' | 'paper';
  delay?: number;
}

export function SliceReveal({ children, variant = 'paper', delay = 0 }: SliceRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  // 斜切块颜色与 variant 相反：paper 区用 ink 块划过，ink 区用 paper 块划过
  const sliceVariant = variant === 'ink' ? 'paper' : 'ink';
  return (
    <div className={styles.wrapper}>
      {!prefersReducedMotion && (
        <motion.div
          className={`${styles.slice} ${styles[sliceVariant]}`}
          initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
          whileInView={{
            clipPath: [
              'polygon(0 0, 0 0, 0 100%, 0 100%)',
              'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
            ],
          }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay, times: [0, 0.5, 1] }}
          aria-hidden="true"
        />
      )}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: prefersReducedMotion ? 0 : delay + 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
