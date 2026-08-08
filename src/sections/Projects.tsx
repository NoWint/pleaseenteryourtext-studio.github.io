import { motion } from 'framer-motion';
import { ChapterMark } from '../components/ChapterMark';
import { ProjectCard } from '../components/ProjectCard';
import { PROJECTS } from '../data/projects';
import styles from './Projects.module.css';

export function Projects() {
  return (
    <section id="projects" className={`section ${styles.projects}`}>
      <div className="container">
        <ChapterMark num="03" title="Projects" />
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          我们的项目 <span className={styles.titleEn}>/ Our Projects</span>
        </motion.h2>
        <motion.p
          className={styles.intro}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          我们把一次研学变成了一系列真实项目。每一个都在解决真实问题。
        </motion.p>
      </div>
      <div className={styles.carousel}>
        {PROJECTS.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
}
