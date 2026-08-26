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
| Terminal status lines per section | `statusLines` |
| Left-hand nav order | `sections` |

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
