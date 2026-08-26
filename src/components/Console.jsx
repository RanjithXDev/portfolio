import { lazy, Suspense } from 'react';
import { meta, sections, statusLines } from '../data/content';
import { useActiveSection, useTypewriter } from '../hooks/useReveal';
import styles from './Console.module.css';

// Three.js is ~600 kB; loading the orb lazily keeps it out of the initial
// bundle so text content paints first.
const AgentOrb = lazy(() => import('./AgentOrb'));

const SECTION_IDS = ['hero', ...sections.map((section) => section.id)];

export default function Console() {
  const activeSection = useActiveSection(SECTION_IDS, 'hero');
  const status = useTypewriter(statusLines[activeSection] ?? statusLines.hero);

  return (
    <aside className={styles.console} aria-label="Agent console">
      <div className={styles.inner}>
        <div className={styles.identity}>
          <p className={styles.name}>{meta.name}</p>
          <p className={styles.role}>{meta.role}</p>
          <p className={styles.focus}>{meta.focus}</p>
        </div>

        <div className={styles.orbSlot}>
          <Suspense fallback={<div className={styles.orbFallback} aria-hidden="true" />}>
            <AgentOrb />
          </Suspense>
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
