import { useState } from 'react';
import { ScanReveal } from '../components/ScanReveal';
import { SectorMark } from '../components/SectorMark';
import { HudFrame } from '../components/HudFrame';
import { SITE } from '../data/site';
import styles from './Join.module.css';

const QR_URL = 'https://raw.githubusercontent.com/PleaseEnterYourText-Studio/About/main/JOINUS.jpg';

export function Join() {
  const [qrFailed, setQrFailed] = useState(false);
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
              {qrFailed ? (
                <div className={styles.qrFallback}>
                  QQ 群：联系群主
                  <a href={SITE.githubOrg} target="_blank" rel="noopener noreferrer" className={styles.qrLink}>
                    GitHub 组织 ↗
                  </a>
                </div>
              ) : (
                <a href={SITE.githubOrg} target="_blank" rel="noopener noreferrer" className={styles.qrImgWrap}>
                  <img
                    src={QR_URL}
                    alt="QQ 群二维码"
                    className={styles.qrImg}
                    loading="lazy"
                    onError={() => setQrFailed(true)}
                  />
                </a>
              )}
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
