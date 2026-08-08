import { motion } from 'framer-motion';
import { ChapterMark } from '../components/ChapterMark';
import { PrismBorder } from '../components/PrismBorder';
import styles from './Join.module.css';

const QQ_QR_URL = 'https://raw.githubusercontent.com/PleaseEnterYourText-Studio/About/main/JOINUS.jpg';

export function Join() {
  return (
    <section id="join" className={`section ${styles.join}`}>
      <div className="container">
        <ChapterMark num="05" title="Join Us" />
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          加入我们 <span className={styles.titleEn}>/ Join Us</span>
        </motion.h2>
        <motion.p
          className={styles.intro}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          我们正在招人，面向 14–18 岁、有热情有基础的年轻开发者。
          <br />
          <span className={styles.introEn}>We're recruiting teenage devs — 14 to 18 — who code, learn, and build.</span>
        </motion.p>
        <div className={styles.columns}>
          <div className={styles.col}>
            <div className={styles.colLabel}>关注</div>
            <p className={styles.colText}>LLM · AGI · AIGC · Agent · Harness</p>
          </div>
          <div className={styles.col}>
            <div className={styles.colLabel}>需要</div>
            <p className={styles.colText}>编程热情 · 开发能力 · Git 协作经验 · AI 兴趣</p>
          </div>
          <div className={styles.col}>
            <div className={styles.colLabel}>不欢迎</div>
            <p className={styles.colText}>混名额 · 不写代码 · 只会给 AI 下指令 · 不懂工程 · 不协作</p>
          </div>
        </div>
        <motion.div
          className={styles.qrSection}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <PrismBorder className={styles.qrWrapper}>
            <img src={QQ_QR_URL} alt="QQ 群二维码" className={styles.qrImg} loading="lazy" />
          </PrismBorder>
          <p className={styles.qrLabel}>扫码加入 PEYT Studio QQ 群</p>
          <p className={styles.qrLabelEn}>Scan to join our QQ group</p>
        </motion.div>
        <motion.p
          className={styles.note}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          E2EE 加密 + 自主可控 + 可自部署，是我们造 PEYT Chat 的动机，也是对外叙事的主轴。
        </motion.p>
      </div>
    </section>
  );
}
