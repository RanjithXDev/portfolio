import Section from './Section';
import { useContentSlice } from '../content/ContentContext';
import styles from './Projects.module.css';

export default function Projects() {
  const projects = useContentSlice('projects');

  return (
    <Section id="projects" index={5} heading={projects.heading}>
      {projects.note && <p className={styles.note}>{projects.note}</p>}

      <div className={styles.list}>
        {projects.items.map((project, i) => (
          <article
            key={project.title}
            className={i % 2 === 1 ? styles.rowReverse : styles.row}
          >
            <div className={styles.visual}>
              {project.image ? (
                <img src={project.image} alt={`Screenshot of ${project.title}`} loading="lazy" />
              ) : (
                <div className={styles.visualPlaceholder} aria-hidden="true">
                  <span className={styles.visualIndex}>{String(i + 1).padStart(2, '0')}</span>
                </div>
              )}
            </div>

            <div className={styles.text}>
              {project.placeholder && <span className={styles.badge}>In progress</span>}

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
                  projects never show dead anchors. */}
              {(project.repoUrl || project.liveUrl) && (
                <div className={styles.links}>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      View live ↗
                    </a>
                  )}
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      Source ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
