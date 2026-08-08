import styles from './SectorMark.module.css';

export interface SectorMarkProps {
  num: string;
  title: string;
  coord: string;
  variant: 'ink' | 'paper';
}

export function SectorMark({ num, title, coord, variant }: SectorMarkProps) {
  return (
    <div className={`${styles.mark} ${styles[variant]}`}>
      <div className={styles.label}>// SECTOR</div>
      <div className={styles.num}>{num}</div>
      <div className={styles.coord}>{coord} · {title}</div>
    </div>
  );
}
