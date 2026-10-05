import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollStore } from '../three/scrollStore';
import { camera as cameraConfig } from '../data/sceneConfig';
import { prefersReducedMotion } from '../three/quality';

gsap.registerPlugin(ScrollTrigger);

/**
 * Drives scrollStore.progress from document scroll and plays the intro
 * push-in once on load. Writes to a plain object rather than React state so
 * scrolling never triggers a re-render.
 */
export function useScrollCamera() {
  useEffect(() => {
    if (prefersReducedMotion()) {
      scrollStore.intro = 1;
      scrollStore.progress = 0;
      return undefined;
    }

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollStore.progress = self.progress;
      },
    });

    // Cinematic push-in, eased so it decelerates into the resting frame.
    const intro = gsap.fromTo(
      scrollStore,
      { intro: 0 },
      {
        intro: 1,
        duration: cameraConfig.introDuration,
        ease: 'power3.out',
        delay: cameraConfig.introDelay,
      }
    );

    return () => {
      intro.kill();
      trigger.kill();
    };
  }, []);
}
