import { useEffect, useState } from 'react';
import { NAV_LINKS } from '../data/site';
import styles from './Nav.module.css';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} aria-label="主导航">
      <a href="#hero" className={styles.logo}>PEYT</a>
      <ul className={styles.links}>
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} className={styles.link}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
