/**
 * Device capability tiers. Everything expensive in the scene reads from here
 * so a single detection drives particle counts, post-processing and DPR.
 */

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function detectTier() {
  if (typeof window === 'undefined') return 'low';

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = navigator.deviceMemory ?? 4;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.innerWidth < 900;

  // Read the unmasked GPU string where the browser exposes it; software
  // renderers (SwiftShader/llvmpipe) must never get the full scene.
  let softwareRenderer = false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    const ext = gl?.getExtension('WEBGL_debug_renderer_info');
    const renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '';
    softwareRenderer = /swiftshader|llvmpipe|software|basic render/i.test(renderer || '');
  } catch {
    // Ignore — treated as unknown, handled by the heuristics below.
  }

  if (softwareRenderer || cores <= 2 || memory <= 2) return 'low';
  if (coarse || narrow || cores <= 4) return 'medium';
  return 'high';
}

let cached = null;

export function getQuality() {
  if (cached) return cached;

  const reduced = prefersReducedMotion();
  const tier = reduced ? 'low' : detectTier();

  const presets = {
    high: {
      tier: 'high',
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
      tier: 'medium',
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
      tier: 'low',
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

  cached = { ...presets[tier], reducedMotion: reduced };
  return cached;
}
