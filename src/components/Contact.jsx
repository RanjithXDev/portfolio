import { useReveal } from '../hooks/useReveal';
import { useContentSlice } from '../content/ContentContext';
import styles from './Contact.module.css';

export default function Contact() {
  const contact = useContentSlice('contact');
  const meta = useContentSlice('meta');
  const [ref, revealClass] = useReveal();

  const emailLink = contact.links.find((link) => link.label === 'Email');
  const otherLinks = contact.links.filter((link) => link.label !== 'Email');

  return (
    <section id="contact" ref={ref} className={`${styles.section} ${revealClass}`}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{contact.heading}</p>

        {contact.statement && <h2 className={styles.statement}>{contact.statement}</h2>}
        <p className={styles.intro}>{contact.intro}</p>

        <div className={styles.actions}>
          {emailLink && (
            <a href={emailLink.href} className={styles.emailCta}>
              {emailLink.handle}
              <span aria-hidden="true">↗</span>
            </a>
          )}
          {meta.resume && (
            <a href={meta.resume} className={styles.resumeCta} download>
              Download CV
            </a>
          )}
        </div>

        <ul className={styles.links}>
          {otherLinks.map((link) => (
            <li key={link.label} className={styles.row}>
              <span className={styles.label}>{link.label}</span>
              <a href={link.href} className={styles.value} target="_blank" rel="noopener noreferrer">
                {link.handle}
              </a>
            </li>
          ))}
          <li className={styles.row}>
            <span className={styles.label}>Location</span>
            <span className={styles.valueStatic}>{contact.location}</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
