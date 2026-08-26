/**
 * Every tunable value for the 3D scene lives here.
 *
 * Nothing in src/three/ should contain a magic number — change the look of
 * the scene by editing this file alone. Colours are read from here rather
 * than duplicated across components.
 */

// ---------------------------------------------------------------------------
// Palette — must stay in sync with src/styles/tokens.css
// ---------------------------------------------------------------------------
export const palette = {
  background: '#0A0E12',
  amber: '#FFB454',
  cyan: '#5EEAD4',
  ambient: '#2A3A48',
};

// ---------------------------------------------------------------------------
// Quality tiers. Each preset drives particle counts, post-processing and DPR.
// Lower any of these if the scene feels heavy on your machine.
// ---------------------------------------------------------------------------
export const qualityPresets = {
  high: {
    particleCount: 900,
    linkCount: 260,
    toolNodes: 6,
    shellCount: 3,
    coreDetail: 64,
    postProcessing: true,
    bloomIntensity: 0.62,
    chromaticAberration: true,
    grid: true,
    dpr: [1, 2],
  },
  medium: {
    particleCount: 380,
    linkCount: 90,
    toolNodes: 4,
    shellCount: 2,
    coreDetail: 32,
    postProcessing: true,
    bloomIntensity: 0.45,
    chromaticAberration: false,
    grid: true,
    dpr: [1, 1.5],
  },
  low: {
    particleCount: 140,
    linkCount: 0,
    toolNodes: 3,
    shellCount: 1,
    coreDetail: 16,
    postProcessing: false,
    bloomIntensity: 0,
    chromaticAberration: false,
    grid: false,
    dpr: 1,
  },
};

// ---------------------------------------------------------------------------
// The core
// ---------------------------------------------------------------------------
export const core = {
  radius: 1.05,
  /** Surface displacement strength. Higher = more turbulent. */
  distortion: 0.24,
  /** Fresnel exponent. Higher = thinner rim (and less bloom blowout). */
  rimPower: 4.2,
  /** Upper clamp on shader brightness; keep under 1.0 to avoid clipping. */
  maxIntensity: 0.92,
  rotationSpeed: 0.12,
  /** Wireframe shells, outermost last. Trimmed to shellCount by tier. */
  shells: [
    { scale: 1.28, detail: 1, opacity: 0.085, color: 'amber', speed: 0.14, axis: [0.4, 1, 0.15] },
    { scale: 1.55, detail: 1, opacity: 0.045, color: 'cyan', speed: -0.09, axis: [1, 0.25, 0.5] },
    { scale: 1.84, detail: 1, opacity: 0.028, color: 'amber', speed: 0.05, axis: [0.2, 0.6, 1] },
  ],
};

// ---------------------------------------------------------------------------
// Particle network
// ---------------------------------------------------------------------------
export const particles = {
  innerRadius: 2.05,
  outerRadius: 3.05,
  /** Max distance between two particles for a connector line to be drawn. */
  linkDistance: 0.92,
  pointSize: 9.5,
  pointOpacity: 0.62,
  linkOpacity: 0.16,
  /** Fixed seed keeps the layout identical across reloads. */
  seed: 20260827,
  rotationSpeed: -0.035,
  breatheAmount: 0.022,
};

// ---------------------------------------------------------------------------
// Orbiting tool nodes. Add or remove entries freely; `toolNodes` in the
// quality preset caps how many are used on a given device.
// ---------------------------------------------------------------------------
export const toolNodes = {
  trailSegments: 48,
  /** How far behind the node the trail reaches, in radians. */
  trailArc: Math.PI * 0.62,
  trailOpacity: 0.85,
  orbits: [
    { a: 2.30, b: 1.72, speed: 0.42, tilt: [0.55, 0.20, 0.10], phase: 0.0, color: 'amber', size: 0.062 },
    { a: 2.72, b: 2.10, speed: -0.31, tilt: [-0.38, 0.85, 0.30], phase: 1.9, color: 'cyan', size: 0.050 },
    { a: 1.98, b: 2.44, speed: 0.36, tilt: [0.95, -0.30, 0.55], phase: 3.4, color: 'cyan', size: 0.044 },
    { a: 3.05, b: 2.28, speed: -0.24, tilt: [0.18, 0.42, -0.70], phase: 5.0, color: 'amber', size: 0.056 },
    { a: 2.52, b: 2.86, speed: 0.29, tilt: [-0.72, -0.25, 0.42], phase: 2.6, color: 'amber', size: 0.040 },
    { a: 2.16, b: 2.02, speed: -0.47, tilt: [0.30, 1.15, 0.85], phase: 4.3, color: 'cyan', size: 0.048 },
  ],
};

// ---------------------------------------------------------------------------
// Camera. `at` is scroll progress 0-1; `mix` is the amber(0) -> cyan(1) blend
// applied to the core and particles at that point.
// ---------------------------------------------------------------------------
export const camera = {
  fov: 42,
  near: 0.1,
  far: 80,
  /** Seconds for the intro push-in on load. */
  introDuration: 2.6,
  introDelay: 0.25,
  introPullBack: 9.5,
  /** Higher = camera catches up to its target faster. */
  damping: 3.2,
  /** Horizontal framing: pushes the core left into the console column. */
  framing: { minWidth: 900, maxWidth: 2200, minOffset: 1.9, maxOffset: 3.6 },
  /** Framing used when prefers-reduced-motion is on (no fly-through). */
  staticFrame: { position: [2.4, 1.2, 5.8], mix: 0.3 },
  keyframes: [
    { at: 0.00, position: [0.0, 0.0, 7.4], target: [0, 0, 0], mix: 0.05 },
    { at: 0.20, position: [2.9, 0.9, 5.6], target: [0, 0, 0], mix: 0.25 },
    { at: 0.40, position: [3.4, -1.5, -4.2], target: [0, 0, 0], mix: 0.85 },
    { at: 0.60, position: [-3.8, 1.8, 4.4], target: [0, 0, 0], mix: 0.15 },
    { at: 0.80, position: [-2.2, -2.4, 5.9], target: [0, 0, 0], mix: 0.60 },
    { at: 1.00, position: [0.6, 2.6, 6.6], target: [0, 0, 0], mix: 0.35 },
  ],
};

// ---------------------------------------------------------------------------
// Environment and post-processing
// ---------------------------------------------------------------------------
export const environment = {
  fogDensity: 0.075,
  toneMappingExposure: 0.95,
  lights: [
    { position: [3.2, 2.4, 2.6], intensity: 22, color: 'amber', distance: 16 },
    { position: [-3.4, -1.6, 2.0], intensity: 18, color: 'cyan', distance: 16 },
    { position: [0, -2.8, -3.2], intensity: 10, color: 'amber', distance: 14 },
  ],
  ambientIntensity: 0.12,
  grid: {
    position: [0, -3.4, 0],
    cellSize: 0.7,
    cellColor: '#223041',
    sectionSize: 3.5,
    sectionColor: '#2E4256',
    fadeDistance: 22,
    fadeStrength: 2.4,
  },
};

export const postProcessing = {
  bloom: { luminanceThreshold: 0.42, luminanceSmoothing: 0.22, radius: 0.62 },
  vignette: { offset: 0.26, darkness: 0.66 },
  chromaticAberration: {
    maxOffset: 0.0016,
    /** Camera speed (world units/sec) at which aberration reaches maximum. */
    velocityScale: 14,
  },
};

/** Resolves a palette key ('amber') or a raw hex string to a hex string. */
export function resolveColor(value) {
  return palette[value] ?? value;
}
