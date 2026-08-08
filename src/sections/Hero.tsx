import { motion, useScroll, useTransform, useVelocity, useSpring, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { SITE } from '../data/site';
import { PrismText } from '../components/PrismText';
import { PrismBorder } from '../components/PrismBorder';
import styles from './Hero.module.css';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const velocity = useVelocity(scrollYProgress);
  const blurRaw = useTransform(velocity, [-0.5, 0, 0.5], [8, 0, 8]);
  const blurSpring = useSpring(blurRaw, { stiffness: 200, damping: 30 });
  const headlineFilter = useTransform(blurSpring, (b) => `blur(${b.toFixed(2)}px)`);

  return (
    <section id="hero" ref={ref} className={styles.hero}>
      <motion.div
        className={styles.content}
        style={{
          y: textY,
          opacity: textOpacity,
        }}
      >
        <motion.h1
          className={styles.headline}
          style={prefersReducedMotion ? undefined : { filter: headlineFilter }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          {SITE.name}
        </motion.h1>
        <motion.p
          className={styles.subhead}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
        >
          {SITE.fullName} · {SITE.chineseName}
        </motion.p>
        <motion.div
          className={styles.slogan}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
        >
          <PrismText as="span" className={styles.sloganText}>{SITE.slogan}</PrismText>
        </motion.div>
        <motion.p
          className={styles.intro}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          我们是一群中学生开发者。因一次研学相遇，因热爱技术走到一起。
          <br />
          <span className={styles.introEn}>We are a group of teenage developers. We met at a research camp, bonded over tech — and now we build real software together.</span>
        </motion.p>
        <motion.div
          className={styles.badge}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          {SITE.badge}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          <a href="#join">
            <PrismBorder className={styles.ctaWrapper}>
              <span className={styles.ctaText}>加入我们</span>
            </PrismBorder>
          </a>
        </motion.div>
      </motion.div>
      <motion.div
        className={styles.scrollHint}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        aria-hidden="true"
      >
        <span className={styles.scrollText}>向下滚动</span>
        <span className={styles.scrollLine} />
      </motion.div>
    </section>
  );
}
