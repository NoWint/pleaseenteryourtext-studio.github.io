import { SliceReveal } from '../components/SliceReveal';
import { SectorMark } from '../components/SectorMark';
import { SITE } from '../data/site';
import styles from './About.module.css';

export function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.sliceInk} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.leftCol}>
          <SliceReveal variant="paper" delay={0.1}>
            <SectorMark num="01" title="MANIFESTO" coord="LNG 01.00" variant="paper" />
            <div className={styles.creed}>
              中学生开发者。<br />
              因研学相遇，<br />
              因技术走到一起。
            </div>
          </SliceReveal>
        </div>
        <div className={styles.rightCol}>
          <SliceReveal variant="paper" delay={0.3}>
            <div className={styles.lead}>
              {SITE.fullName} · {SITE.chineseName}
            </div>
            <p className={styles.body}>
              我们是一群中学生开发者。一次研学让我们相遇，对技术的热爱让我们走到一起。现在，我们一起构建真实可用的软件。
            </p>
            <p className={styles.bodyEn}>
              We are a group of teenage developers. We met at a research camp, bonded over tech — and now we build real software together.
            </p>
            <div className={styles.meta}>
              <span>EST. 2026</span>
              <span>·</span>
              <span>OPEN SOURCE</span>
              <span>·</span>
              <span>08 MEMBERS</span>
            </div>
          </SliceReveal>
        </div>
      </div>
    </section>
  );
}
