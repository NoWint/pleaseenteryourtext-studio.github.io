import { ScanReveal } from '../components/ScanReveal';
import { SectorMark } from '../components/SectorMark';
import { HudFrame } from '../components/HudFrame';
import { QrCode } from '../components/QrCode';
import { SITE } from '../data/site';
import styles from './Join.module.css';

// QQ 群：PleaseEnterYourText摸鱼群
const QQ_GROUP_URL = 'https://qm.qq.com/q/Pi3pI6fVe';
const QQ_GROUP_NAME = 'PleaseEnterYourText摸鱼群';

export function Join() {
  return (
    <section id="join" className={styles.join}>
      <HudFrame variant="ink" corners grid scan>
        <div className={styles.inner}>
          <div className={styles.head}>
            <ScanReveal variant="ink">
              <SectorMark num="04" title="RECRUIT" coord="LAT 04.00" variant="ink" />
              <h2 className={styles.title}>
                JOIN <span className={styles.titleSub}>/ 入队</span>
              </h2>
            </ScanReveal>
          </div>

          <div className={styles.body}>
            <div className={styles.ctaArea}>
              <div className={styles.pre}>// 04 — ENLIST</div>
              <a href={SITE.githubOrg} target="_blank" rel="noopener noreferrer" className={styles.cta}>
                加入我们 →
              </a>
              <p className={styles.ctaSub}>
                我们是中学生开发者。如果你也对技术有热情，欢迎加入。
              </p>
            </div>

            <div className={styles.qrArea}>
              <div className={styles.qrLabel}>// CONTACT — QQ GROUP</div>
              <a
                href={QQ_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.qrImgWrap}
                aria-label={`加入 ${QQ_GROUP_NAME}`}
              >
                <QrCode value={QQ_GROUP_URL} size={200} ecc="M" title={`${QQ_GROUP_NAME} 二维码`} />
              </a>
              <div className={styles.qrName}>{QQ_GROUP_NAME}</div>
              <a
                href={SITE.githubOrg}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.orgLink}
              >
                {SITE.githubOrg.replace('https://', '')} ↗
              </a>
            </div>
          </div>

          <footer className={styles.footer}>
            <span className={styles.footL}>LAT 04.00 · LNG 04.00 // END OF TRANSMISSION</span>
            <span className={styles.footR}>PEYT Studio © 2026</span>
          </footer>
        </div>
      </HudFrame>
    </section>
  );
}
