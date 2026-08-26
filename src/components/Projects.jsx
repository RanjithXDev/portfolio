import Section from './Section';
import { projects } from '../data/content';
import styles from './Projects.module.css';

export default function Projects() {
  return (
    <Section id="projects" index={4} heading={projects.heading}>
      {projects.note && <p className={styles.note}>{projects.note}</p>}

      <div className={styles.grid}>
        {projects.items.map((project) => (
          <article
            key={project.title}
            className={project.placeholder ? styles.cardPlaceholder : styles.card}
          >
            {project.placeholder && (
              <span className={styles.badge}>Placeholder</span>
            )}

            <h3 className={styles.title}>{project.title}</h3>
            <p className={styles.blurb}>{project.blurb}</p>

            {project.tags?.length > 0 && (
              <ul className={styles.tags}>
                {project.tags.map((tag) => (
                  <li key={tag} className={styles.tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            {/* Links render only when a URL is actually set, so placeholder
                cards never show dead anchors. */}
            {(project.repoUrl || project.liveUrl) && (
              <div className={styles.links}>
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                    Code ↗
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    Live ↗
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
