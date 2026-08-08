import { useRef } from 'react';
import { ScanReveal } from '../components/ScanReveal';
import { SectorMark } from '../components/SectorMark';
import { ProjectCard } from '../components/ProjectCard';
import { PROJECTS } from '../data/projects';
import styles from './Projects.module.css';

export function Projects() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const flagship = PROJECTS.find((p) => p.isFlagship);
  const rest = PROJECTS.filter((p) => !p.isFlagship);
  const flagshipIndex = PROJECTS.findIndex((p) => p.isFlagship);

  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.head}>
        <ScanReveal variant="ink">
          <SectorMark num="02" title="ARSENAL" coord="LAT 02.00" variant="ink" />
          <h2 className={styles.title}>
            PROJECTS <span className={styles.titleSub}>/ 06 项</span>
          </h2>
        </ScanReveal>
      </div>

      <div className={styles.body}>
        {flagship && (
          <div className={styles.flagshipArea}>
            <ProjectCard project={flagship} index={flagshipIndex} variant="flagship" />
          </div>
        )}

        <div className={styles.restArea}>
          <div className={styles.restLabel}>// OTHER UNITS — 横向滚动 →</div>
          <div className={styles.scrollWrap} ref={scrollRef}>
            <div className={styles.scrollTrack}>
              {rest.map((p) => {
                const realIndex = PROJECTS.indexOf(p);
                return (
                  <ProjectCard key={p.name} project={p} index={realIndex} variant="standard" />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
