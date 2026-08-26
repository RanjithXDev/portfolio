import Section from './Section';
import { about } from '../data/content';
import styles from './About.module.css';

export default function About() {
  return (
    <Section id="about" index={1} heading={about.heading}>
      <div className={styles.body}>
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>
    </Section>
  );
}
