import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as bundled from '../data/content';
import { fetchRemoteContent, deepMerge, CONTENT_URL } from './remote';

/**
 * The bundled content, shaped as one object so remote JSON can mirror it.
 * Keys here are exactly the keys a remote content.json may override.
 */
const baseContent = {
  meta: bundled.meta,
  hero: bundled.hero,
  about: bundled.about,
  experience: bundled.experience,
  skills: bundled.skills,
  credentials: bundled.credentials,
  projects: bundled.projects,
  contact: bundled.contact,
  sections: bundled.sections,
  footer: bundled.footer,
};

const ContentContext = createContext(baseContent);

export function ContentProvider({ children }) {
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchRemoteContent().then((data) => {
      if (!cancelled && data) setRemote(data);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Bundled content renders immediately; remote is layered on when it lands.
  // No loading spinner — first paint should never wait on the network.
  const value = useMemo(
    () => (remote ? deepMerge(baseContent, remote) : baseContent),
    [remote]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

/** Returns the whole content object. */
export function useContent() {
  return useContext(ContentContext);
}

/** Returns one top-level slice, e.g. useContentSlice('about'). */
export function useContentSlice(key) {
  return useContext(ContentContext)[key];
}

export { CONTENT_URL, baseContent };
