import Section from './Section';
import { useContentSlice } from '../content/ContentContext';
import styles from './About.module.css';

export default function About() {
  const about = useContentSlice('about');
  const meta = useContentSlice('meta');
  const [lead, ...rest] = about.paragraphs;

  const facts = [
    { label: 'Role', value: meta.role },
    { label: 'Focus', value: meta.focus },
    { label: 'Based in', value: meta.location },
  ];

  return (
    <Section id="about" index={1} heading={about.heading}>
      <div className={styles.grid}>
        <p className={styles.lead}>{lead}</p>

        <div className={styles.side}>
          <div className={styles.body}>
            {rest.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <dl className={styles.facts}>
            {facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
