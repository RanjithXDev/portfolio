# Ranjith MV — Portfolio

React + Vite portfolio with a Three.js "agent orb" console.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the production build
```

## Editing your content

**All copy lives in [`src/data/content.js`](src/data/content.js).** You should
never need to touch a component to update your information.

| What to change | Where in `content.js` |
| --- | --- |
| Name, role, email, location, SEO description | `meta` |
| Hero headline, intro, buttons | `hero` |
| About paragraphs | `about.paragraphs` |
| Jobs and bullet points | `experience.roles` |
| Skills by category | `skills.categories` |
| Project cards | `projects.items` |
| Contact rows and links | `contact.links` |
| Education entries | `credentials.education` |
| Certifications (and their PDFs) | `credentials.certifications.items` |
| Left-hand nav order | `sections` |

### Adding a certification

Drop the PDF into `public/`, then append to
`credentials.certifications.items` in `content.js`:

```js
{
  name: 'AWS Certified Cloud Practitioner',
  issuer: 'Amazon Web Services',
  year: '2026',
  file: '/aws-ccp.pdf',   // path under public/; use '' for no link
}
```

Set `file: ''` and the card renders as plain text with no dead link.

## Editing content without redeploying

Content is loaded at runtime, so you can change copy on a live site without
touching the code or rebuilding.

**How it resolves:**

1. `src/data/content.js` is compiled into the bundle and renders immediately.
2. In parallel the app fetches `VITE_CONTENT_URL` (default `/content.json`).
3. If that succeeds, it is deep-merged **over** the bundled content.
4. If it fails — offline, 404, 500, timeout, malformed JSON — the bundled
   content stays. The site never renders blank because a fetch failed.

First paint always uses bundled content, so there is no spinner and no
SEO penalty from waiting on the network.

### Publishing a content change

```bash
npm run content:export      # regenerates public/content.json from content.js
```

Then either redeploy, or upload that `content.json` to wherever you host it
and point `VITE_CONTENT_URL` at it:

```bash
# .env
VITE_CONTENT_URL=https://raw.githubusercontent.com/RanjithXDev/portfolio-content/main/content.json
```

Any URL returning the right JSON works — a GitHub raw file, an S3/R2 object,
a serverless function, or a headless CMS endpoint. No backend to run.

**Partial overrides are fine.** The remote file only needs the keys you want
to change:

```json
{
  "hero": { "role": "Software Engineer" },
  "credentials": {
    "certifications": {
      "items": [
        { "name": "AWS Certified Cloud Practitioner", "issuer": "AWS", "year": "2026", "file": "" }
      ]
    }
  }
}
```

Objects merge key by key; **arrays are replaced wholesale**, so the snippet
above replaces the certification list entirely rather than appending to it.
That is deliberate — index-merging would make it impossible to remove an
entry remotely.

Note that files referenced by path (certificate PDFs, the CV) still have to
exist in your deployment's `public/`, or be given absolute URLs.

## Tuning the 3D scene

**All scene values live in [`src/data/sceneConfig.js`](src/data/sceneConfig.js).**
Nothing under `src/three/` contains a magic number or a hardcoded colour, so
you can retune the whole look from that one file.

| What to change | Key |
| --- | --- |
| Scene colours | `palette` |
| Particle count / DPR / bloom per device tier | `qualityPresets` |
| Core size, distortion, rim, wireframe shells | `core` |
| Particle cloud radius, size, link density | `particles` |
| Orbiting node paths, sizes, trail length | `toolNodes.orbits` |
| Camera path, intro timing, damping, framing | `camera` |
| Fog, lights, grid floor | `environment` |
| Bloom / vignette / chromatic aberration | `postProcessing` |

Colour fields accept either a `palette` key (`'amber'`, `'cyan'`) or a raw
hex string. If the scene feels heavy on your machine, lower
`qualityPresets.high.particleCount` and `bloomIntensity` first.

### Adding a real project

Edit the `projects.items` array. Set `placeholder: false` so the card loses its
dashed "Placeholder" styling, and fill in `repoUrl` / `liveUrl` — link buttons
only render when a URL is actually present, so empty strings stay hidden.

```js
{
  title: 'Discharge Coordination Agent',
  blurb: 'Bedrock AgentCore workflow that tracks SLAs and escalates blocked discharges.',
  tags: ['AWS Bedrock', 'AgentCore', 'Python'],
  repoUrl: 'https://github.com/RanjithXDev/...',
  liveUrl: '',
  placeholder: false,
}
```

## Structure

```
src/
  components/    One .jsx + one .module.css per component
    AgentOrb     Three.js orb (raw three, useEffect + useRef)
    Console      Sticky left panel: identity, orb, nav, terminal
    Section      Shared section shell (anchor, numbered heading, reveal)
    Hero About Experience Skills Projects Contact Footer
  data/content.js   ← all editable content
  hooks/useReveal.js  reveal-on-scroll, active section, typewriter
  styles/
    tokens.css   colors, fonts, layout and motion variables
    global.css   resets, reveal animation, focus, reduced-motion
```

## Design system

Defined once as CSS custom properties in `src/styles/tokens.css`:

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#0A0E12` | page background |
| `--panel` | `#12181F` | console + cards |
| `--line` | `#223041` | borders, rules |
| `--text` | `#E7EEF3` | body text |
| `--amber` | `#FFB454` | primary accent |
| `--cyan` | `#5EEAD4` | secondary accent |

JetBrains Mono for headings and labels, Inter for body text.

## Notes

- The console collapses to a top block below **900px**.
- `prefers-reduced-motion` disables the reveal transitions, the typewriter, and
  the orb's animation loop (it renders a single static frame).
- Three.js is lazy-loaded so it stays out of the initial bundle.
- Before deploying, update `meta.siteUrl` in `content.js` and the absolute URLs
  in `index.html` (`og:url`, `og:image`, `canonical`), and add a
  `public/og-image.png` (1200×630) for social previews.
