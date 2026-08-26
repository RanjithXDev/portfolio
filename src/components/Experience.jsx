import Section from './Section';
import { experience } from '../data/content';
import styles from './Experience.module.css';

export default function Experience() {
  return (
    <Section id="experience" index={2} heading={experience.heading}>
      <div className={styles.roles}>
        {experience.roles.map((role) => (
          <article key={role.title} className={styles.role}>
            <header className={styles.header}>
              <h3 className={styles.title}>{role.title}</h3>
              <p className={styles.dates}>{role.dates}</p>
            </header>
            <ul className={styles.bullets}>
              {role.bullets.map((bullet) => (
                <li key={bullet.slice(0, 40)}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
