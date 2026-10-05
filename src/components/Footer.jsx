import { useContent } from '../content/ContentContext';
import styles from './Footer.module.css';

export default function Footer() {
  const { meta, footer, sections, contact } = useContent();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <p className={styles.name}>{meta.name}</p>
          <p className={styles.tagline}>{meta.focus}</p>
        </div>

        <nav className={styles.nav} aria-label="Sections">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
        </nav>

        <ul className={styles.social}>
          {contact.links.map((link) => {
            const isExternal = link.href.startsWith('http');
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.bottom}>
        <p>{footer.text}</p>
        <p className={styles.note}>{footer.note}</p>
      </div>
    </footer>
  );
}
