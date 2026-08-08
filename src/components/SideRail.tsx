import styles from './SideRail.module.css';

export interface RailSection {
  id: string;
  label: string;
  num: string;
}

export interface SideRailProps {
  sections: RailSection[];
  activeId: string;
  onNavigate: (id: string) => void;
}

export function SideRail({ sections, activeId, onNavigate }: SideRailProps) {
  return (
    <nav className={styles.rail} aria-label="章节导航">
      {sections.map((s) => (
        <button
          key={s.id}
          className={`${styles.item} ${activeId === s.id ? styles.active : ''}`}
          onClick={() => onNavigate(s.id)}
          aria-label={s.label}
          aria-current={activeId === s.id ? 'true' : undefined}
        >
          <span className={styles.label}>{s.label}</span>
          <span className={styles.tick} />
          <span className={styles.num}>{s.num}</span>
        </button>
      ))}
    </nav>
  );
}
