import Section from './Section';
import { useContentSlice } from '../content/ContentContext';
import styles from './About.module.css';

export default function About() {
  const about = useContentSlice('about');

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
