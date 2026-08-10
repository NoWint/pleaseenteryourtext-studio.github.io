import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Member } from '../data/members';
import styles from './MemberCard.module.css';

export interface MemberCardProps {
  member: Member;
  index: number;
}

export function MemberCard({ member, index }: MemberCardProps) {
  const num = String(index + 1).padStart(2, '0');
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [active, setActive] = useState(false);
  const initial = member.name.charAt(0).toUpperCase();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      className={styles.card}
      // 移动端 tap 彩色：pointerenter/leave 在触摸 tap 时也会触发，桌面 hover 同样生效
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      data-active={active}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
    >
      <div className={styles.sliceCorner} aria-hidden="true" />
      <div className={styles.head}>
        <span className={styles.num}>{num}</span>
        <span className={styles.role}>{member.role}</span>
      </div>
      <div className={styles.avatarWrap}>
        {avatarFailed ? (
          <div className={styles.fallback}>{initial}</div>
        ) : (
          <img
            src={member.avatarUrl}
            alt={member.name}
            className={styles.avatar}
            loading="lazy"
            onError={() => setAvatarFailed(true)}
          />
        )}
      </div>
      <h3 className={styles.name}>{member.name}</h3>
      <div className={styles.direction}>{member.direction}</div>
      <p className={styles.tagline}>{member.tagline}</p>
      <a
        href={member.siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.site}
      >
        {member.siteLabel} ↗
      </a>
    </motion.article>
  );
}
