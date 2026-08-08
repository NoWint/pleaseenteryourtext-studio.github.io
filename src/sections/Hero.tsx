import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HudFrame } from '../components/HudFrame';
import { ScanReveal } from '../components/ScanReveal';
import styles from './Hero.module.css';

// PEYT 起始时间：2026-07-12 00:00:00 (本地时区)
const PEYT_EPOCH = new Date(2026, 6, 12, 0, 0, 0).getTime();

function useElapsedSeconds() {
  const [secs, setSecs] = useState(() =>
    Math.max(0, Math.floor((Date.now() - PEYT_EPOCH) / 1000))
  );
  useEffect(() => {
    const id = setInterval(() => {
      setSecs(Math.max(0, Math.floor((Date.now() - PEYT_EPOCH) / 1000)));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return secs;
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const elapsed = useElapsedSeconds();

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

        {/* 巨字 · 左上 PLEASE ENTER（mix-blend-mode 跨底反色，扫描线入场） */}
        <div className={styles.megaTL}>
          <ScanReveal variant="ink">
            <div className={styles.pre}>// 00 — DESIGNATION</div>
            <h1 className={styles.mega}>
              PLEASE<br />
              ENTER
            </h1>
            <div className={styles.links}>
              <a
                className={styles.link}
                href="https://discord.gg/Kjv3FAycA"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord 服务器 ↗
              </a>
              <span className={styles.link}>
                外部群 1077924207 · QQ频道 peytofficial01
              </span>
            </div>
          </ScanReveal>
        </div>

        {/* 巨字 · 右下 YOUR TEXT（mix-blend-mode 跨底反色，stagger 渐显） */}
        <motion.div
          className={styles.megaBR}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <div className={styles.meta}>
            <span className={styles.metaMade}>Made by @NoWint</span>
            <span className={styles.metaTime}>{elapsed.toLocaleString('en-US')}</span>
          </div>
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
