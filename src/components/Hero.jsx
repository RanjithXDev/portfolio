import { hero } from '../data/content';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <p className={styles.greeting}>{hero.greeting}</p>
      <h1 className={styles.name}>{hero.name}</h1>
      <p className={styles.role}>{hero.role}</p>
      <p className={styles.tagline}>{hero.tagline}</p>
      <p className={styles.intro}>{hero.intro}</p>

      <div className={styles.actions}>
        {hero.actions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className={action.variant === 'primary' ? styles.primary : styles.ghost}
          >
            {action.label}
          </a>
        ))}
      </div>
    </section>
  );
}
