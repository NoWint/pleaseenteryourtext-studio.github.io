import { motion, useReducedMotion } from 'framer-motion';
import styles from './DataReadout.module.css';

export interface DataReadoutRow {
  label: string;
  value: string;
  live?: boolean;
}

export interface DataReadoutProps {
  rows: DataReadoutRow[];
  variant: 'ink' | 'paper';
  label?: string;
}

export function DataReadout({ rows, variant, label }: DataReadoutProps) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className={`${styles.readout} ${styles[variant]}`}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.rows}>
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            className={styles.row}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.3 }}
          >
            <span className={styles.rowLabel}>{row.label}</span>
            <span className={styles.rowValue}>
              {row.live && <span className={styles.dot} />}
              <b>{row.value}</b>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
