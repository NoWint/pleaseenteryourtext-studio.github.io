import { SITE } from '../data/site';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p className={styles.text}>
          {SITE.name} — <span className={styles.slogan}>{SITE.slogan}</span>
        </p>
        <a href={SITE.githubOrg} target="_blank" rel="noopener noreferrer" className={styles.link}>
          GitHub →
        </a>
      </div>
    </footer>
  );
}
