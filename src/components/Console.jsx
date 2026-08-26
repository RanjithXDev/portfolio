import { useContent } from '../content/ContentContext';
import { useMemo } from 'react';
import { useActiveSection, useTypewriter } from '../hooks/useReveal';
import styles from './Console.module.css';

export default function Console() {
  const { meta, sections, statusLines } = useContent();

  // Rebuilt only when the section list itself changes (e.g. remote content
  // adds a section), not on every render.
  const sectionIds = useMemo(
    () => ['hero', ...sections.map((section) => section.id)],
    [sections]
  );

  const activeSection = useActiveSection(sectionIds, 'hero');
  const status = useTypewriter(statusLines[activeSection] ?? statusLines.hero);

  return (
    <aside className={styles.console} aria-label="Agent console">
      <div className={styles.inner}>
        <div className={styles.identity}>
          <p className={styles.name}>{meta.name}</p>
          <p className={styles.role}>{meta.role}</p>
          <p className={styles.focus}>{meta.focus}</p>
        </div>

        <nav className={styles.nav} aria-label="Sections">
          <ul>
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={activeSection === section.id ? styles.navLinkActive : styles.navLink}
                  aria-current={activeSection === section.id ? 'true' : undefined}
                >
                  <span className={styles.navMarker} aria-hidden="true" />
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Terminal status line. aria-live announces the change without
            reading out every intermediate typewriter frame. */}
        <div className={styles.terminal}>
          <span className={styles.prompt} aria-hidden="true">
            &gt;
          </span>
          <span className={styles.status} aria-live="polite" aria-atomic="true">
            {status}
          </span>
          <span className={styles.cursor} aria-hidden="true" />
        </div>
      </div>
    </aside>
  );
}
