import { useEffect, useMemo, useState } from 'react';
import { useContent } from '../content/ContentContext';
import { useActiveSection } from '../hooks/useReveal';
import styles from './Nav.module.css';

export default function Nav() {
  const { meta, sections } = useContent();
  const [open, setOpen] = useState(false);

  const sectionIds = useMemo(
    () => ['hero', ...sections.map((section) => section.id)],
    [sections]
  );
  const activeSection = useActiveSection(sectionIds, 'hero');

  // Close the mobile menu on any route change within the page.
  useEffect(() => {
    setOpen(false);
  }, [activeSection]);

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <a href="#hero" className={styles.brand}>
          {meta.name}
        </a>

        <nav className={styles.links} aria-label="Sections">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={activeSection === section.id ? styles.linkActive : styles.link}
              aria-current={activeSection === section.id ? 'true' : undefined}
            >
              {section.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className={styles.cta}>
          Get in touch
        </a>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="eyebrow">{open ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      <nav
        id="mobile-nav"
        className={open ? styles.mobileOpen : styles.mobile}
        aria-label="Sections"
      >
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={activeSection === section.id ? styles.mobileLinkActive : styles.mobileLink}
            aria-current={activeSection === section.id ? 'true' : undefined}
            onClick={() => setOpen(false)}
          >
            {section.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
