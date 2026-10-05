import { qualityPresets } from '../data/sceneConfig';

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

  cached = { tier, ...qualityPresets[tier], reducedMotion: reduced };
  return cached;
}
