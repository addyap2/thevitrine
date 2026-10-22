# The Vitrine: motion system

Motion here tells one story. **Night falls, the window lights up, and you
step inside to browse.** Every animation either sets that scene, shows a
change of state, or confirms that something you touched responded. Anything
that does none of these is left out.

All timing lives in [`src/styles/motion.css`](src/styles/motion.css). Change
a token there and the whole site follows.

## Principles

1. **Arrive slowly, leave quickly.** Entrances ease out over 0.5–1.2 s.
   Exits take 160–260 ms and never hold up the next thing.
2. **Move only what changed.** No ambient looping on content. The two loops
   that do run (the hero's light shaft and the "live" dot) are slow,
   decorative and paused by reduced motion.
3. **Short distances.** Content rises 28 px at most. Nothing crosses the
   screen. (A card-morph filter was tried and dropped for exactly that
   reason.)
4. **Transform and opacity only**, so animations run on the compositor. The
   one exception is a `clip-path` on section headings.
5. **Content is never held hostage.** Without JavaScript, or with reduced
   motion, everything is visible at once.

## Tokens

| Token | Value | Used for |
|---|---|---|
| `--ease-arrive` | `cubic-bezier(.16, 1, .3, 1)` | Entrances and reveals (expo-out) |
| `--ease-move` | `cubic-bezier(.65, 0, .35, 1)` | Things trading places, page fade |
| `--ease-leave` | `cubic-bezier(.5, 0, .75, 0)` | Exits (accelerating away) |
| `--ease-hover` | `cubic-bezier(.3, .7, .4, 1)` | Pointer feedback, no overshoot |
| `--dur-press` | 90 ms | Button press scale |
| `--dur-micro` | 160 ms | Colour, border, results dimming |
| `--dur-short` | 260 ms | Hover lift, arrow nudge, exits |
| `--dur-base` | 460 ms | Page transition, image fade |
| `--dur-reveal` | 820 ms | Content entering on scroll or filter |
| `--dur-scene` | 1200 ms | Hero panes, horizon lines, image settle |
| `--stagger` | 70 ms | Gap between siblings (capped at 6 items) |
| `--rise` | 28 px | Reveal travel |

There are no springs and no bounce. The house style is calm and precise.

## Choreography

### 1. Loading sequence: the hero (≈ 1.6 s total)

| t (ms) | Element | Motion |
|---|---|---|
| 0 | Eyebrow | Fade and rise 18 px, 1000 ms `--ease-arrive` |
| 0 | Window rig | Swings in from `rotateY(-38deg) translateZ(-200px)`, 1400 ms |
| 80 / 180 | Headline lines | Rise out of a mask (`translateY(105%)` → 0), 1100 ms |
| 360 | Sub-headline | Fade and rise |
| 400 | Floor glow | Fade in, 2000 ms |
| 480 | CTAs | Fade and rise |
| 500 | Glass | A light sweep crosses the window, 1500 ms |
| 600 | Proof line | Fade and rise |
| 900 | Caption | Fade in |
| 1400 | Scroll cue | Fade in; its dot starts its loop at 2000 ms |

The headline is the LCP element and is real text, so the page reads
correctly from the first paint. Only three screenshots load up front; the
other three load when the browser is idle.

### 2. Hero, while you stay

- **Pane cycle:** every 4.2 s the front site steps forward and out
  (`translate3d(-18%, 14%, 220px)`, fading). The next comes up from depth.
  The move takes `--dur-scene` with `--ease-arrive`, and the caption swaps
  with a 6 px rise.
- **It pauses** on hover, on keyboard focus, when the tab is hidden, or with
  the pause button (WCAG 2.2.2).
- **Pointer tilt** (fine pointers only): the rig turns up to ±5° toward the
  cursor, eased at 8 % per frame in one `requestAnimationFrame` loop that
  stops when it has settled.

### 3. Scroll

| Range | Behaviour |
|---|---|
| Hero, 0 → its own height | **Parallax in three layers.** The text sinks 40 px and fades to 10 %, the window rises 70 px and flattens by 12°/8°, and the light shaft drifts 60 px. One rAF loop sets `--sp`, a 0–1 progress value. |
| Hero → work | **Scene change:** the sill, a 1 px line (lamp to blue) along the hero's bottom edge, draws itself from the centre, `scaleX(0 → 1)` over `--dur-scene`. Lamp light spills onto the paper below it. |
| Work section | The **filter bar pins** to the top of the screen (`position: sticky`). An IntersectionObserver sentinel adds `.stuck`, which fades in a hairline and a soft shadow over `--dur-short`. |
| Section headings | Clip-reveal from the bottom (`inset(0 0 100% 0)` → visible), plus rise and fade. |
| Cards | Rise 28 px and fade in. Cards that enter together stagger 70 ms in reading order, capped at 6, so a fast scroll never queues a long cascade. |
| Contact | Back into the night: the sill line at its top draws itself, then the heading, lede and both contact cards, staggered. |

Headings that clip-reveal are watched through their parent element: Chromium
measures an element's visible area after its own `clip-path`, so a fully
clipped heading would never count as on screen. Anything still hidden when
the page reaches its end is revealed then, because the last lines can sit
inside the bottom margin even when fully scrolled.

Reveals fire once, at 12 % visibility with an 8 % bottom margin, so content
is already settling as it comes into view. Once settled, the
`data-reveal` attribute is removed, which hands the element back to its own
hover transitions.

### 4. Image transitions

- **Card screenshots** start at `opacity: 0; scale(1.04)` and settle to rest
  when they finish loading: opacity over `--dur-base`, scale over
  `--dur-scene`. There's no half-painted image. Already-cached images are
  shown immediately.
- **Hero panes** pass through a `.shade` overlay (opacity 0 / 0.5 / 0.74 by
  depth) instead of a CSS `filter`, which would be expensive to animate.

### 5. Filtering

Clicking a filter does this:
1. The results dim to 0 over `--dur-micro` with `--ease-leave`.
2. The new set is applied while it's invisible.
3. If you had scrolled past the first result, the view jumps (instantly,
   while dimmed) to just under the pinned bar.
4. Visible headings and cards rise 16 px in reading order: `--dur-reveal`,
   70 ms stagger, capped at 6.
5. The project count ticks in from above.

The active chip scrolls into view inside its row on mobile.

### 6. Hover states and micro-interactions

| Element | Hover / focus | Press |
|---|---|---|
| Card | Lifts 3 px; its edge and shadow warm to lamp light (`--dur-short`); its screenshot leans in to `scale(1.025)` over `--dur-scene` | — |
| Wide card | Its pane turns from `rotateY(-4deg)` to face you and its edge lights up, over `--dur-scene` | — |
| Site link `↗` | Arrow nudges 2 px up-right, colour shifts to accent | — |
| Maker switch | Text darkens (`--dur-micro`); a raised thumb slides to the chosen name over `--dur-base`, `--ease-move` | `scale(.97)` |
| Category tab | Text darkens (`--dur-micro`); the accent underline slides and resizes to the chosen tab over `--dur-base`, `--ease-move` | `scale(.97)` |
| Primary CTA | Rises 2 px, glow intensifies | `scale(.97)`, 90 ms |
| Hero front pane | Edge lights up warm | Opens the live site |
| Contact card (glass, at night) | Lifts 2 px, edge and glow turn warm, arrow nudges | — |
| Menu link | Text brightens; a lamp underline grows from the left over `--dur-short` (it stays on the current page's link) | — |
| Language toggle (FR \| EN) | The current language is lit in lamp light; the other brightens on hover | `scale(.96)` |
| Phone menu | The two bars turn into a cross; the panel drops in 6 px over `--dur-short` | — |
| Count | Number ticks in from 45 % above | — |
| FAQ question | Text turns accent; the + turns into a − over `--dur-short`, and the answer opens with a height transition over `--dur-base` where the browser supports it | — |
| "Live" dot | Slow 2.4 s halo pulse (decorative) | — |

### 7. Transitions between pages

The EN ↔ FR switch uses **cross-document View Transitions**
(`@view-transition { navigation: auto }`):
- The old page fades out over `--dur-short`, and the new one fades in over
  `--dur-base`.
- The brand mark and the language button are named elements, so they hold
  their place while the text around them changes language.
- A `pagereveal` listener adds `html.no-intro`, so the hero intro doesn't
  replay underneath the crossfade.
- Browsers without support, or a click made mid-scroll, simply navigate
  normally.

## Reduced motion

`prefers-reduced-motion: reduce` changes the following:

- `--rise` and `--stagger` become 0, so nothing travels.
- Reveals and filter changes become a 180 ms fade, so state changes stay
  legible.
- Hero entrance, light sweep, light shaft, live dot, scroll cue, parallax
  and pointer tilt are all off.
- The pane cycle starts paused. The pause button can still run it.
- There are no page or filter transitions, card hover lifts or image scale.
- Smooth scrolling is off.

## Performance budget

- **No animation libraries.** Everything is CSS plus a few KB of plain
  TypeScript.
- **Animated properties:** only `transform` and `opacity`, plus heading
  `clip-path` and the `width` of the two small filter indicators.
- **Event handling:**
  - At most one rAF loop runs, only while values are still settling.
  - The scroll listener is passive.
  - IntersectionObservers stop watching an element once it has revealed.
- **`will-change`** is only set on the six hero panes.

## Adding something new

1. **Reveal on scroll:** add the `data-reveal` attribute. Use
   `data-reveal="heading"` for a clip-reveal, or `data-reveal="line"` for a
   horizon line.
2. **Timing:** use the tokens, never raw milliseconds or curves. Pick the
   easing by intent: arriving, moving, leaving or hover.
3. **Check it with reduced motion on.** If the feature only makes sense with
   motion, it needs a static alternative.
