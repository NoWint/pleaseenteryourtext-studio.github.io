import { motion } from 'framer-motion';
import styles from './ChapterMark.module.css';

interface ChapterMarkProps {
  num: string;
  title: string;
  total?: number;
}

export function ChapterMark({ num, title, total = 5 }: ChapterMarkProps) {
  return (
    <div className={styles.mark}>
      <motion.div
        className={styles.line}
        initial={{ height: 0 }}
        whileInView={{ height: '100%' }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className={styles.meta}
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <div className={styles.num}>CHAPTER {num}</div>
        <div className={styles.progress}>
          {total} 个章节中的第 {parseInt(num, 10)} 个 · {title}
        </div>
      </motion.div>
    </div>
  );
}
