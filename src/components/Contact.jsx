import Section from './Section';
import { contact } from '../data/content';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <Section id="contact" index={5} heading={contact.heading}>
      <p className={styles.intro}>{contact.intro}</p>

      <ul className={styles.links}>
        {contact.links.map((link) => {
          const isExternal = link.href.startsWith('http');
          return (
            <li key={link.label} className={styles.row}>
              <span className={styles.label}>{link.label}</span>
              <a
                href={link.href}
                className={styles.value}
                {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {link.handle}
              </a>
            </li>
          );
        })}
        <li className={styles.row}>
          <span className={styles.label}>Location</span>
          <span className={styles.valueStatic}>{contact.location}</span>
        </li>
      </ul>
    </Section>
  );
}
