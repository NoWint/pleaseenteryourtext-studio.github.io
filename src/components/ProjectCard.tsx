import { Project } from '../data/projects';
import styles from './ProjectCard.module.css';

export interface ProjectCardProps {
  project: Project;
  index: number;
  variant: 'flagship' | 'standard';
}

export function ProjectCard({ project, index, variant }: ProjectCardProps) {
  const num = String(index + 2).padStart(2, '0');
  return (
    <article className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.sliceCorner} aria-hidden="true" />
      <div className={styles.head}>
        <span className={styles.num}>{num}</span>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          aria-label={`${project.name} on GitHub`}
        >
          ↗
        </a>
      </div>
      <h3 className={styles.name}>{project.name}</h3>
      <p className={styles.tagline}>{project.tagline}</p>
      {variant === 'flagship' && (
        <>
          <p className={styles.desc}>{project.description}</p>
          <p className={styles.highlight}>{project.highlight}</p>
          {project.capabilities && (
            <div className={styles.caps}>
              {project.capabilities.map((cap) => (
                <div key={cap.group} className={styles.capGroup}>
                  <div className={styles.capLabel}>{cap.group}</div>
                  <ul className={styles.capItems}>
                    {cap.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <div className={styles.tech}>{project.techStack}</div>
    </article>
  );
}
