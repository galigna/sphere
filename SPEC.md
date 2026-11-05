# Sphere — landing site

## 1. Goal

A one-page site for **Sphere**: 3D-printed puzzles of real molecules for chemistry classrooms.
It is the proof-point link in the MIT Solve 2027 application (deadline **6 Nov 2026, 12:00 ET**),
so it must load fast, work on a phone, and show the idea in one interaction:

> type a molecule → see it in 3D → see that it prints as one piece per atom.

Published on GitHub Pages at `https://galigna.github.io/sphere/` from `galigna/sphere`.

Source of truth for layout and copy: Figma file `sr9U4FBdxBzHXYZVrpBRLh` ("Landing"), frames
**Landing** (1512), **Landing / Tablet** (768), **Landing / Mobile** (390), and the
**Design system** page.

## 2. Scope

- The page as designed: header, hero, Physical prototypes, The problem, How it works, Team,
  Our goals, Contact, footer.
- Two live 3D viewers built with **Three.js**:
  - **Hero:** methane, slowly rotating on its own; not draggable, no "drag to rotate" hint.
  - **How it works:** the molecule demo (§6).
- Responsive at three breakpoints driven by the design tokens (§4).
- Static build deployed by GitHub Actions.

## 3. Non-goals

- CIF upload, STL export or puzzle-piece geometry (pegs, holes) in the browser. That stays in molkit.
- The learning platform, AR app, accounts, CMS, i18n, analytics, cookies.
- Generating 3D coordinates for compounds PubChem has no 3D record for (§6.4).
- Anything from the private project profile: phone numbers, citizenship or visa status, ages,
  ownership split, funding amounts. The private symmetry repo is never linked. Advisors and pilot
  schools other than Lake Forest College are named only with the founders' sign-off.

## 4. Design system → code

Tokens come from the Figma variables. Each CSS custom property uses the variable's WEB code
syntax, e.g. `color/text/primary` → `var(--color-text-primary)`.

| Figma collection | CSS |
|---|---|
| Primitives | `--primitive-*` in `tokens.css`, not used directly by components |
| Color (mode Dark) | `--color-*`, aliases of primitives |
| Layout (Desktop / Tablet / Mobile) | `--space-*`, `--layout-*`, `--radius-*` |
| Type (Desktop / Tablet / Mobile) | `--type-*` font sizes; text styles become classes |

**Breakpoints.** Mobile-first. Mobile values sit on `:root`, Tablet values apply at
`min-width: 768px`, Desktop values at `min-width: 1200px`.

| | Mobile < 768 | Tablet 768–1199 | Desktop ≥ 1200 |
|---|---|---|---|
| Gutter | 24 | 64 | 236 |
| Content width (max) | 342 | 640 | 1040 |
| Section gap | 72 | 96 | 120 |
| Heading → content gap | 16 | 20 | 24 |
| Text width (max, paragraphs) | 342 | 640 | 680 |
| Display / H1 / H2 / H3 | 56 / 36 / 28 / 22 | 72 / 48 / 34 / 24 | 88 / 56 / 40 / 28 |
| Body L / M / S | 16 / 15 / 14 | 18 / 16 / 14 | 20 / 17 / 15 |

The footer ends with a "Sphere" wordmark that fills the content width and is cut just under the
baseline at the page bottom.

Content is centred with `max-width: var(--layout-content-width)` and
`padding-inline: var(--layout-gutter)`. Fixed frame widths are not reproduced.

**Text styles:** Display, Heading/H1–H3, Body/L, Body/L Strong, Body/M, Body/S, Caption,
Overline. Fonts are IBM Plex Serif Bold (headings), IBM Plex Sans Regular/Bold (body) and IBM Plex
Mono Regular (captions, overlines, chips and other small labels), self-hosted woff2 files limited
to the Latin subset.

**Effects:**
- Focus ring is a flat 2px ring, used as `:focus-visible` on the buttons and the molecule input.
  Nothing on the page glows.
- The page background is the top gradient plus three soft washes (`color/bg/tint-blue`, `tint-violet`)
  placed down the page, under a faint white grain (Noise/Page, `--noise`: a tiled inline SVG).
  There is no dot grid.
- One wide, heavily blurred ribbon runs from behind the hero molecule across the title, behind the
  content, from `color/bg/tint-lime` to `color/bg/tint-pink`, fading out at both ends. It scales with
  the viewer. Figma's blur is progressive; the site uses one blur at about the average strength.
- Blur/Carousel edge is a mask on the right 32% of the prototype row:
  `mask-image: linear-gradient(to right, #000 68%, transparent)`. A real backdrop blur over
  scrolling images costs too much for what it adds.
- The prototype row can be dragged with a mouse, then glides to the nearest photo. Touch and touchpads
  keep native scrolling.

**Components → markup.** Each component is plain HTML plus a CSS class. Figma variants become
modifier classes or element states.

| Figma | Code |
|---|---|
| Button (Default, Hover, Focus) | `.btn` with `:hover` and `:focus-visible` |
| Nav | `.header__nav` from 1200px: every section in page order, in one liquid-glass capsule (`backdrop-filter`, Glass/Nav). Sticky; hides on scroll down and returns on scroll up, or on keyboard focus. |
| Header / Compact + icon/menu | `.header` below 1200px. The menu button opens a dropdown of section links: `<details>`, or a button with `aria-expanded`. |
| Molecule viewer | `<MoleculeViewer>`: the R3F canvas plus the "drag to rotate" hint |
| Molecule input (Default, Focus, Hover, Filled, Loading, Error) | `<form class="mol-input" data-state="…">` |
| Card, Image | `.card` holding an `<img>` with `srcset` |
| Member (default, Stacked) | `.member`. It is Stacked below 768px, with the photo centred. |
| Roadmap step (Column, Row × Active, Upcoming) | `<ol class="roadmap">`. Steps sit in columns at 1200px and up, in rows below that. |
| Contact card | `<a class="contact-card">`. The icon badge is hidden below 768px. |

## 5. Stack

- **Vite + React 18 + React Three Fiber** on `three` from npm. Controls and environment come
  from `three/examples` directly (drei added ~6 KB for two imports). Plain CSS with the token
  file; no CSS framework. This leaves room for the learning platform to grow out of the same repo.
- The page is React components that mirror the Figma components (§4). The viewer is one
  `React.lazy` chunk, loaded when a viewer scrolls near the viewport, so the text and LCP never
  wait for WebGL.
- **Vitest** tests the parser and the PubChem error mapping only.
- **Deploy:** a GitHub Actions workflow runs `npm ci && npm run build` and publishes `dist/`
  with `actions/deploy-pages`. Vite's `base` is `/sphere/`.

```
index.html
src/
  main.jsx           mounts <App/>
  App.jsx            the sections, in page order
  sections/          Hero, Problem, HowItWorks, Prototypes, Team, Goals, Contact, Footer
  components/        Header, Button, MoleculeInput, Card, Member, RoadmapStep, ContactCard
  viewer/
    MoleculeViewer.jsx  <Canvas>, controls, auto-rotate, Pieces animation (lazy chunk)
    BallStick.jsx       instanced balls + half-sticks
  mol/
    elements.js      element table   (port of molkit core/elements.py)
    sdf.js           SDF V2000 → {atoms, bonds}  (port of core/sources/sdf.py, no RDKit)
    pubchem.js       name → SDF, error mapping   (port of core/sources/pubchem.py)
    ballstick.js     balls + half-sticks spec    (port of core/ballstick.py)
    formula.js       Hill formula
  styles/tokens.css  generated from the Figma variables
  styles/site.css
public/
  molecules/*.sdf    bundled presets (§6.3)
  img/               prototype and team photos, OG image
tests/               sdf + pubchem, using molkit's methane.sdf / benzene.sdf fixtures
```

## 6. Molecule demo

### 6.1 Data: PubChem, straight from the browser

- `GET https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{name}/SDF?record_type=3d`.
  PubChem answers with `Access-Control-Allow-Origin: *`, so no proxy or backend is needed.
- Errors map the same way as in molkit:

  | PubChem answer | Message shown in the Error state |
  |---|---|
  | 404 whose body contains "No CID found" | `molecule not found` |
  | Any other 404 | `no 3D model for this one` (PubChem only has conformers for small, fairly rigid molecules: 50 heavy atoms or fewer) |
  | Other HTTP status, timeout (10 s), offline | `PubChem is not answering` |

- Results are cached in memory by lower-cased name. A new request aborts the previous one
  (`AbortController`).
- PubChem's limit is 5 requests a second. One request per submit stays far below it, so the
  input does no autocomplete.

### 6.2 Parsing: port molkit, drop RDKit

PubChem 3D records are MDL V2000 with explicit hydrogens. They need no sanitising and no
embedding, so the parser is about 40 lines of fixed-column reading:
- the counts line;
- the atom block (x, y, z, symbol);
- the bond block (a, b, order 1/2/3, plus 4 for aromatic, kept for completeness).

molkit raises on an element it doesn't know. The site instead falls back to a neutral colour and
a 1.8 Å radius, so it never breaks.

### 6.3 Presets and offline fallback

- `methane`, `water`, `ammonia`, `benzene`, `caffeine` and `aspirin` ship as SDF files in
  `public/molecules`. They total under 30 KB.
- The hero loads the bundled methane, so the page makes no network call on load.
- The presets appear as chips under the input. They load instantly and keep the demo working if
  PubChem is down while a judge is looking.

### 6.4 Rendering: the printed kit, on screen

The model looks like the printed puzzle, not a generic chemistry viewer:
- **Balls:** radius = vdW radius × 0.25, molkit's `ball_radius_factor`. Colours are Jmol CPK
  from molkit's table.
- **Half-sticks:** each bond is two cylinders, from each atom to the midpoint, in that atom's
  colour. These are molkit's `StickSpec`. Stick radius is 0.175 Å, the FDM stick at 20 mm/Å.
- One `<instancedMesh>` for all balls and one for all sticks, so a 50-atom molecule costs two
  draw calls.
- Glossy `meshPhysicalMaterial` with clearcoat, lit by a `RoomEnvironment` PMREM generated at
  runtime (no HDR download) to match the Figma render. No shadows.
- The dashed rings around the hero molecule are the rims of its mirror planes (methane's six σd, each
  through C and two H's, so each holds two C₃ axes), found with molkit's method: a mirror's normal is
  the difference of two like atoms. The molecule is turned so the first plane faces the camera and holds
  the spin axis, along its in-plane C–H bond.
- Thin lines out to the rings mark the highest-order rotation axes (methane's four C₃, one along each
  C–H). An axis runs through an atom or the midpoint of two like atoms; the highest order that maps the
  molecule onto itself wins. Both finders live in `src/mol/symmetry.js`.
- The model is centred on its centroid, and the camera distance fits its bounding sphere.

### 6.5 "One piece per atom": the puzzle moment

A **Pieces** toggle on the demo viewer pushes every atom, with its half-sticks, outward from the
centroid along its own position vector. This is the puzzle exploded, exactly as molkit splits it.
The caption under the viewer reads, for example:

> **caffeine** · C₈H₁₀N₄O₂ · prints as **24 pieces**

The formula is in Hill order.

### 6.6 Interaction and motion

- drei `OrbitControls` rotates only: no pan, and no zoom, so the page scroll isn't hijacked.
- Auto-rotation is slow. It pauses on pointer hover, on keyboard focus, when the viewer is off
  screen (IntersectionObserver) and when the tab is hidden.
- With `prefers-reduced-motion` there is no auto-rotation, and model swaps and the Pieces toggle
  happen without animation.
- Arrow keys rotate the focused viewer. The canvas has `role="img"` and an `aria-label` that
  names the current molecule, and an `aria-live` line announces loading and errors.
- When WebGL is unavailable, the viewer says so in place of the canvas.
- The input hint works as designed: hovering the empty field shows "methane" as a ghost value,
  and Tab or → accepts it.

## 7. Content

Copy matches the Figma desktop frame, section by section. Links:
- Email Mariia: `mailto:novikovamst18@lakeforest.edu`.
- molkit on GitHub and Releases point to `galigna/rhino-molkit`.
- The footer credits PubChem.
- The problem section cites its two J. Chem. Educ. references in short form (Body/XS, muted), each
  linking to its DOI, with a thin muted rule on the left. They sit beside the body on desktop and
  under it on smaller screens.

Meta:
- `<title>`: "Sphere: 3D-printed molecule puzzles".
- Description: the hero sentence.
- Open Graph image: a 1200×630 render of methane with the tagline (to do).
- Favicon: an SVG of the methane mark.
- `lang="en"`. No trackers, fonts or scripts from third-party origins. The only third party is
  PubChem, and only after the visitor submits a molecule.

## 8. Quality bar

- Lighthouse on mobile: Performance ≥ 90, Accessibility 100, Best Practices 100, SEO 100.
- Initial JS under 60 KB gzipped (React plus the page). The viewer chunk (three and R3F)
  is about 245 KB gzipped and lazy; R3F pulls in all of three, so this is its floor.
- Images are AVIF or WebP with `srcset`, explicit `width` and `height`, and `loading="lazy"`
  below the fold.
- Text contrast meets WCAG AA on the dark background, checked against the tokens.
- Checked in Chrome, Safari (iOS) and Firefox at 390, 768 and 1512 wide.

## 9. Repository rules

- `.gitignore` lists `node_modules/` and `dist/`.
- Team photos come from files the founders supply; prototype photos are exported from Figma.
- Commits carry the founders' identities only, with no co-author trailers.

## 10. Acceptance

1. `galigna.github.io/sphere/` serves the page, deployed by the workflow on every push to `main`.
2. Each of the three frames matches its Figma frame at its breakpoint, with no horizontal scroll.
3. Typing `methane`, `caffeine` or `aspirin` loads the model from PubChem. `notamolecule` shows
   the Error state. An offline network shows the PubChem error, and the preset chips still work.
4. Pieces explodes and reassembles the molecule. The caption shows the formula and piece count.
5. The hero rotates and ignores the pointer. Reduced motion stops all auto-rotation.
6. The viewer's unit tests pass in CI.
7. Nothing from the private list in §3 appears in the repo or on the page.
