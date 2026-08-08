import { SliceReveal } from '../components/SliceReveal';
import { SectorMark } from '../components/SectorMark';
import { MemberCard } from '../components/MemberCard';
import { MEMBERS } from '../data/members';
import styles from './Team.module.css';

export function Team() {
  return (
    <section id="team" className={styles.team}>
      <div className={styles.head}>
        <SliceReveal variant="paper">
          <SectorMark num="03" title="PERSONNEL" coord="LNG 03.00" variant="paper" />
          <h2 className={styles.title}>
            TEAM <span className={styles.titleSub}>/ 06 人</span>
          </h2>
        </SliceReveal>
      </div>
      <div className={styles.grid}>
        {MEMBERS.map((m, i) => (
          <MemberCard key={m.name} member={m} index={i} />
        ))}
      </div>
    </section>
  );
}
