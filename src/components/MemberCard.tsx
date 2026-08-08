import type { Member } from '../data/members';
import styles from './MemberCard.module.css';

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <div className={styles.card}>
      <img
        src={member.avatarUrl}
        alt={member.name}
        className={styles.avatar}
        loading="lazy"
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      <div className={styles.avatarFallback} aria-hidden="true">
        {member.name.charAt(0)}
      </div>
      <div className={styles.info}>
        <h4 className={styles.name}>{member.name}</h4>
        <p className={styles.tagline}>{member.tagline}</p>
        <p className={styles.role}>{member.role} · {member.direction}</p>
        <a href={member.siteUrl} target="_blank" rel="noopener noreferrer" className={styles.site}>
          {member.siteLabel} →
        </a>
      </div>
    </div>
  );
}
