import Section from './Section';
import { credentials } from '../data/content';
import styles from './Credentials.module.css';

export default function Credentials() {
  const { education, certifications } = credentials;

  return (
    <Section id="credentials" index={4} heading={credentials.heading}>
      <div className={styles.education}>
        {education.map((entry) => (
          <article key={entry.degree} className={styles.entry}>
            <div className={styles.entryHead}>
              <h3 className={styles.degree}>{entry.degree}</h3>
              <span className={styles.period}>{entry.period}</span>
            </div>
            <p className={styles.institution}>{entry.institution}</p>
            {entry.result && <p className={styles.result}>{entry.result}</p>}
          </article>
        ))}
      </div>

      {certifications.items.length > 0 && (
        <>
          <h3 className={styles.certLabel}>{certifications.label}</h3>
          <ul className={styles.certGrid}>
            {certifications.items.map((cert) => {
              // Only render a link when a file is actually configured.
              const Wrapper = cert.file ? 'a' : 'div';
              const linkProps = cert.file
                ? { href: cert.file, target: '_blank', rel: 'noopener noreferrer' }
                : {};

              return (
                <li key={cert.name}>
                  <Wrapper
                    className={cert.file ? styles.certCardLink : styles.certCard}
                    {...linkProps}
                  >
                    <span className={styles.certName}>{cert.name}</span>
                    <span className={styles.certMeta}>
                      {[cert.issuer, cert.year].filter(Boolean).join(' · ')}
                    </span>
                    {cert.file && <span className={styles.certOpen}>View ↗</span>}
                  </Wrapper>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Section>
  );
}
