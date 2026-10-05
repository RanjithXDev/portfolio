import { useReveal } from '../hooks/useReveal';
import styles from './Section.module.css';

/**
 * Shared shell for every content section: anchor id, numbered mono heading,
 * and the reveal-on-scroll behaviour.
 */
export default function Section({ id, index, heading, children }) {
  const [ref, revealClass] = useReveal();

  return (
    <section id={id} ref={ref} className={`${styles.section} ${revealClass}`}>
      <h2 className={styles.heading}>
        <span className={styles.index} aria-hidden="true">
          {String(index).padStart(2, '0')}
        </span>
        {heading}
      </h2>
      {children}
    </section>
  );
}
