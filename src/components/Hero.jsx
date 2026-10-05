import { useEffect, useRef } from 'react';
import { useContentSlice } from '../content/ContentContext';
import styles from './Hero.module.css';

/**
 * Nudges the decorative mark toward the pointer, in CSS custom properties
 * rather than React state so mouse movement never triggers a re-render.
 * Skipped entirely under prefers-reduced-motion.
 */
function useMarkParallax(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty('--mx', x.toFixed(3));
      el.style.setProperty('--my', y.toFixed(3));
    };

    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, [ref]);
}

export default function Hero() {
  const hero = useContentSlice('hero');
  const contact = useContentSlice('contact');
  const sectionRef = useRef(null);
  useMarkParallax(sectionRef);

  return (
    <section id="hero" ref={sectionRef} className={styles.hero}>
      <div className={`${styles.grid} bgGrid`} aria-hidden="true" />
      <div className={styles.mark} aria-hidden="true">
        <div className={styles.markSpin}>
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="46" stroke="var(--accent)" strokeWidth="1" opacity="0.5" />
            <line x1="60" y1="18" x2="60" y2="34" stroke="var(--accent)" strokeWidth="1" />
            <line x1="60" y1="86" x2="60" y2="102" stroke="var(--accent)" strokeWidth="1" />
            <line x1="18" y1="60" x2="34" y2="60" stroke="var(--accent)" strokeWidth="1" />
            <line x1="86" y1="60" x2="102" y2="60" stroke="var(--accent)" strokeWidth="1" />
            <circle cx="60" cy="60" r="3" fill="var(--accent)" />
          </svg>
        </div>
      </div>

      <p className={`${styles.greeting} eyebrow`}>{hero.greeting}</p>
      <h1 className={styles.name}>{hero.name}</h1>
      <p className={styles.role}>{hero.role}</p>
      <p className={`${styles.tagline} eyebrow`}>{hero.tagline}</p>
      <p className={styles.intro}>{hero.intro}</p>

      <div className={styles.actions}>
        {hero.actions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className={action.variant === 'primary' ? styles.primary : styles.ghost}
            {...(action.download ? { download: true } : {})}
          >
            {action.label}
          </a>
        ))}
      </div>

      {contact?.links?.length > 0 && (
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
      )}
    </section>
  );
}
