import { motion, useReducedMotion } from 'framer-motion';
import { HudFrame } from '../components/HudFrame';
import { ScanReveal } from '../components/ScanReveal';
import { DataReadout } from '../components/DataReadout';
import styles from './Hero.module.css';

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <section id="hero" className={styles.hero}>
      <HudFrame variant="ink">
        {/* 斜切骨架 */}
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

        {/* 标题区 */}
        <div className={styles.titleArea}>
          <ScanReveal variant="ink">
            <div className={styles.pre}>// 00 — DESIGNATION</div>
            <h1 className={styles.title}>
              TYPE<br />
              <span className={styles.outline}>EVERY</span>THING
            </h1>
            <div className={styles.sub}>// PEYT Studio · 请输入文本工作室</div>
          </ScanReveal>
        </div>

        {/* 右上章戳 */}
        <motion.div
          className={styles.stamp}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
        >
          <div className={styles.stampLbl}>EST</div>
          <div className={styles.stampBig}>2026</div>
          <div className={styles.stampBlk}>PEYT // 08</div>
        </motion.div>

        {/* 右下数据表 */}
        <div className={styles.dataArea}>
          <DataReadout
            variant="paper"
            label="// UNIT READOUT"
            rows={[
              { label: 'PROJECT', value: 'PEYT-CHAT' },
              { label: 'STATUS', value: 'OPEN SOURCE', live: true },
              { label: 'MEMBERS', value: '08' },
            ]}
          />
        </div>

        {/* 左下 HUD */}
        <div className={styles.hudBl}>
          <div className={styles.bar}>
            <div className={styles.barLbl}>SYNC</div>
            <div className={styles.barTrack}>
              <div className={styles.barFill} />
            </div>
          </div>
          <div className={styles.tickrow} aria-hidden="true">
            <i className={styles.on} /><i className={styles.on} /><i className={styles.on} />
            <i className={styles.on} /><i className={styles.on} /><i /><i />
          </div>
        </div>

        {/* CTA */}
        <motion.a
          href="#join"
          className={styles.cta}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1 }}
        >
          加入 →
        </motion.a>

        {/* 坐标 */}
        <div className={styles.coord}>LAT 00.00 · LNG 00.00 // PEYT-HQ</div>
      </HudFrame>
    </section>
  );
}
