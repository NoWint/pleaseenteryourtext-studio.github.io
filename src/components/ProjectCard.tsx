import type { Project } from '../data/projects';
import { PrismBorder } from './PrismBorder';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className={styles.card}>
      <PrismBorder className={styles.cardBorder}>
        <div className={styles.cardBody}>
          <div className={styles.header}>
            <h3 className={styles.name}>{project.name}</h3>
            {project.isFlagship && <span className={styles.flagship}>旗舰</span>}
          </div>
          <p className={styles.tagline}>{project.tagline}</p>
          <p className={styles.description}>{project.description}</p>
          {project.capabilities && (
            <div className={styles.capabilities}>
              {project.capabilities.map((cap) => (
                <div key={cap.group} className={styles.capGroup}>
                  <div className={styles.capLabel}>{cap.group}</div>
                  <ul className={styles.capItems}>
                    {cap.items.map((item) => (
                      <li key={item} className={styles.capItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <div className={styles.highlight}>
            <span className={styles.highlightLabel}>亮点</span>
            <p className={styles.highlightText}>{project.highlight}</p>
          </div>
          <div className={styles.footer}>
            <span className={styles.techStack}>{project.techStack}</span>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
              GitHub →
            </a>
          </div>
        </div>
      </PrismBorder>
    </div>
  );
}
