/**
 * Mutable scroll state shared between ScrollTrigger and the r3f render loop.
 *
 * Deliberately NOT React state: scroll fires far more often than we want to
 * re-render, and the camera only needs these values inside useFrame.
 */
export const scrollStore = {
  /** 0-1 progress down the whole document. */
  progress: 0,
  /** 0-1 amber -> cyan balance for the current section. */
  mix: 0,
  /** 0-1 intro push-in, driven by a GSAP timeline on load. */
  intro: 0,
  /** Camera movement speed, used to gate chromatic aberration. */
  velocity: 0,
};

export { camera as cameraConfig } from '../data/sceneConfig';
