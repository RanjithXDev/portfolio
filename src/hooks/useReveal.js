import { useEffect, useRef, useState } from 'react';

/**
 * Adds the `is-visible` class the first time an element scrolls into view,
 * driving the reveal-on-scroll animation defined in global.css.
 */
export function useReveal(options = { threshold: 0.15 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, visible ? 'reveal is-visible' : 'reveal'];
}

/**
 * Reports which section is currently on screen, so the Console can update its
 * terminal status line.
 *
 * Deliberately not IntersectionObserver-ratio based: ratio is measured against
 * each target's own height, so a short section scores higher than a tall one
 * that actually fills the viewport. Instead we pick the last section whose top
 * has passed a reading line a third of the way down the screen.
 */
export function useActiveSection(ids, fallback) {
  const [active, setActive] = useState(fallback);

  useEffect(() => {
    let frame = null;

    const measure = () => {
      frame = null;
      const readingLine = window.innerHeight * 0.33;
      let current = fallback;

      for (const id of ids) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= readingLine) current = id;
      }

      // At the very bottom the last section may never cross the line.
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      if (atBottom) {
        const last = ids.filter((id) => document.getElementById(id)).pop();
        if (last) current = last;
      }

      setActive(current);
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids, fallback]);

  return active;
}

/**
 * Types `text` out one character at a time. Respects prefers-reduced-motion by
 * showing the full string immediately.
 */
export function useTypewriter(text, speed = 28) {
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (!text) {
      setOutput('');
      return undefined;
    }

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      setOutput(text);
      return undefined;
    }

    setOutput('');
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setOutput(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, speed);

    return () => window.clearInterval(timer);
  }, [text, speed]);

  return output;
}
