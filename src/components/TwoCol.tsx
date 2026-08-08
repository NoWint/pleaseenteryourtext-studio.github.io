import { motion } from 'framer-motion';
import styles from './TwoCol.module.css';

export interface ColItem {
  label: string;
  text: string;
}

interface TwoColProps {
  items: [ColItem, ColItem];
}

export function TwoCol({ items }: TwoColProps) {
  return (
    <div className={styles.grid}>
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          className={styles.col}
          initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}
        >
          <div className={styles.label}>{item.label}</div>
          <p className={styles.text}>{item.text}</p>
        </motion.div>
      ))}
    </div>
  );
}
