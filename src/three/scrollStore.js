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

/**
 * Camera keyframes, one per section, lerped by scroll progress.
 * `at` is the scroll position the keyframe is anchored to.
 */
export const cameraKeyframes = [
  { at: 0.00, position: [0.0, 0.0, 7.4], target: [0, 0, 0], mix: 0.05 },
  { at: 0.20, position: [2.9, 0.9, 5.6], target: [0, 0, 0], mix: 0.25 },
  { at: 0.40, position: [3.4, -1.5, -4.2], target: [0, 0, 0], mix: 0.85 },
  { at: 0.60, position: [-3.8, 1.8, 4.4], target: [0, 0, 0], mix: 0.15 },
  { at: 0.80, position: [-2.2, -2.4, 5.9], target: [0, 0, 0], mix: 0.60 },
  { at: 1.00, position: [0.6, 2.6, 6.6], target: [0, 0, 0], mix: 0.35 },
];
