import { motion, useScroll, useSpring } from 'framer-motion';
import styles from './ScrollProgress.module.css';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      className={styles.progress}
      style={{ transformOrigin: '0%', scaleX }}
      aria-hidden="true"
    />
  );
}
