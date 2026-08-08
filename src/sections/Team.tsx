import { motion } from 'framer-motion';
import { ChapterMark } from '../components/ChapterMark';
import { MemberCard } from '../components/MemberCard';
import { MEMBERS, INACTIVE_MEMBERS } from '../data/members';
import styles from './Team.module.css';

export function Team() {
  return (
    <section id="team" className={`section ${styles.team}`}>
      <div className="container">
        <ChapterMark num="04" title="Team" />
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          6 位在职成员 <span className={styles.titleEn}>/ Six Active Members</span>
        </motion.h2>
        <motion.p
          className={styles.intro}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          一群用真实项目练习成长的年轻开发者。
          <br />
          <span className={styles.introEn}>Teenage devs leveling up through real projects.</span>
        </motion.p>
        <div className={styles.grid}>
          {MEMBERS.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
            >
              <MemberCard member={member} />
            </motion.div>
          ))}
        </div>
        <p className={styles.footnote}>
          {INACTIVE_MEMBERS.join('、')} 为不在职联合创始人；规模计划 10 人左右，长期上限 15 人。
        </p>
      </div>
    </section>
  );
}
