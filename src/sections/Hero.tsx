import { motion, useReducedMotion } from 'framer-motion';
import { HudFrame } from '../components/HudFrame';
import { ScanReveal } from '../components/ScanReveal';
import styles from './Hero.module.css';

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <section id="hero" className={styles.hero}>
      <HudFrame variant="ink">
        {/* 斜切骨架：左黑块 + 右白底 + 右下浅灰 */}
        <div className={styles.sliceBg} aria-hidden="true" />
        <div className={styles.slicePaper} aria-hidden="true" />
        <div className={styles.slicePaper2} aria-hidden="true" />

        {/* 顶栏 */}
        <div className={styles.topbar}>
          <span className={styles.topL}>PEYT-SYS // v2.6 // SECT 00</span>
          <span className={styles.topC}>
            <span className={styles.dot} /> LIVE
          </span>
          <span className={styles.topR}>
            <span className={styles.dot} /> SYNC
          </span>
        </div>

        {/* 巨字 · 左上 PLEASE ENTER（白实心，扫描线入场） */}
        <div className={styles.megaTL}>
          <ScanReveal variant="ink">
            <div className={styles.pre}>// 00 — DESIGNATION</div>
            <h1 className={styles.mega}>
              PLEASE<br />
              ENTER
            </h1>
          </ScanReveal>
        </div>

        {/* 巨字 · 右下 YOUR TEXT（黑实心，stagger 渐显） */}
        <motion.div
          className={styles.megaBR}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <div className={styles.pre}>// PEYT STUDIO · 请输入文本工作室</div>
          <h1 className={styles.mega}>
            YOUR<br />
            TEXT
          </h1>
        </motion.div>

        {/* 坐标 */}
        <div className={styles.coord}>
          LAT 00.00 · LNG 00.00 // <b>PEYT-HQ</b>
        </div>

        {/* 右下封口 */}
        <div className={styles.seal}>PEYT // 08 · END SECT 00</div>
      </HudFrame>
    </section>
  );
}
