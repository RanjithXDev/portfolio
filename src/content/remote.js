/**
 * Remote content loading.
 *
 * The bundled content.js is always the baseline; remote JSON is merged over
 * it. That means the site renders correctly even if the remote source is
 * down, slow, or returns partial data — you never get a blank page because
 * a CDN hiccuped.
 */

/** Where to fetch content from. Override per-deployment with a .env file. */
export const CONTENT_URL = import.meta.env.VITE_CONTENT_URL ?? '/content.json';

/** How long to wait before giving up and using the bundled content. */
const TIMEOUT_MS = Number(import.meta.env.VITE_CONTENT_TIMEOUT_MS ?? 4000);

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Deep-merges `source` over `target`.
 *
 * Arrays are REPLACED wholesale rather than merged element-wise — for lists
 * like projects or certifications, "replace" is the only sane semantic;
 * index-merging would make it impossible to remove an entry remotely.
 */
export function deepMerge(target, source) {
  if (!isPlainObject(source)) return source;
  if (!isPlainObject(target)) return source;

  const out = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) continue;
    out[key] = isPlainObject(value) && isPlainObject(target[key])
      ? deepMerge(target[key], value)
      : value;
  }
  return out;
}

/**
 * Fetches remote content. Resolves to null on any failure (network error,
 * timeout, non-2xx, malformed JSON) so the caller can fall back silently.
 */
export async function fetchRemoteContent(url = CONTENT_URL) {
  if (!url) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      cache: 'no-cache',
    });

    if (!response.ok) {
      console.warn(`[content] ${url} responded ${response.status}; using bundled content.`);
      return null;
    }

    const data = await response.json();
    if (!isPlainObject(data)) {
      console.warn('[content] Remote payload was not an object; using bundled content.');
      return null;
    }

    return data;
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.warn('[content] Fetch failed; using bundled content.', error.message);
    } else {
      console.warn(`[content] Fetch timed out after ${TIMEOUT_MS}ms; using bundled content.`);
    }
    return null;
  } finally {
    clearTimeout(timer);
  }
}
