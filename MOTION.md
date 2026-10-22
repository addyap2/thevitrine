# The Vitrine motion system

Motion supports one story: a lit digital shop window, followed by a calm,
responsive browsing experience. The hero carries the spectacle. Content uses
short, once-only entrances and precise interaction feedback.

## Shared timing

Change shared values in `src/styles/motion.css`.

| Token | Value | Purpose |
|---|---|---|
| `--dur-press` | 90 ms | Press acknowledgement |
| `--dur-micro` | 160 ms | Colour and border feedback |
| `--dur-short` | 220 ms | Hover and icon response |
| `--dur-base` | 460 ms | Image settling and page transitions |
| `--dur-reveal` | 520 ms | Content entrances |
| `--dur-scene` | 1200 ms | Large hero gestures |
| `--stagger` | 45 ms | Siblings entering together; maximum four gaps |
| `--rise` | 16 px | Content entrance distance |

Entrances use `cubic-bezier(.16,1,.3,1)`. Interaction feedback uses
`cubic-bezier(.3,.7,.4,1)`. There are no springs or bouncing controls.

## Content entrances and section lighting

`src/motion.ts` owns one IntersectionObserver per page. The shared header starts
it; the homepage can also call the guarded initializer safely.

- Headings precede supporting content. Case-study sections reveal their heading
  and content separately. Blog article body text stays static; subheadings reveal.
- Reveals play once. After settling, the controller removes `data-reveal` and its
  delay so hover and focus feedback take over normally.
- Keyboard focus reveals a hidden ancestor immediately. Scrolling to the true
  document bottom releases any remaining content. Back/forward-cache restores
  show content immediately.
- Major section boundaries and existing category rules receive one 850 ms amber
  sweep. These are decorative, ignore pointer events and never loop.
- Without JavaScript, content remains visible. A three-second page safety net
  also reveals content if the main enhancement fails to start.

## Project cards and filters

Project cards retain their real screenshots and browser frames. Fine pointers
receive a small lift, a 1.8% image enlargement, warm edge lighting, a single
650 ms reflection and a 2 px directional arrow movement. Wide cards retain their
existing framed presentation. Keyboard focus receives a clear border and focus
ring. Touch devices do not retain hover travel or a repeating reflection.

Filter state and counts update immediately. The homepage measures card positions
before and after the change, then animates surviving cards to their new positions
in 330 ms. Newly visible cards fade and rise 10 px over 460 ms, with at most four
35 ms stagger gaps. Only cards near the viewport animate. Rapid changes cancel
previous animations and use the latest selected filters; no delayed state update
can overwrite a newer choice. Results scroll back under the fixed filter bar only
when necessary. Reduced motion applies the new layout immediately.

## FAQ and forms

The enhanced FAQ uses a 240 ms interruptible height transition. Native `details`
and `summary` retain their semantics and keyboard behaviour. A second activation
reverses towards the latest intended state. Height animation is a deliberate,
small, interaction-only exception to compositor-only movement: it allows the
surrounding answers to flow naturally without scaling or distorting text.
Native details remain usable without JavaScript.

Questionnaire steps reveal over 240 ms with 8 px of travel. Validation, active
step state and focus update immediately; animation never gates the next action.
Reduced motion skips step travel. Buttons, navigation and input feedback use the
same timing tokens where components share those behaviours.

## Hero

`src/components/HeroShowcase.astro` owns its separate choreography. The current
showcase has 23 projects; SAP Trainer is excluded from the hero. The portfolio
still lists 24 projects.

- The opening typeset headline and architectural frame arrive together.
- A desktop/mobile presentation changes every 6.5 seconds, followed by the next
  project. The picker and arrows provide direct alternatives to waiting.
- Pause, reduced motion, offscreen state and background tabs stop automatic
  changes. Explicit Play overrides the focus and hover created by its own button.
- Both project images decode before a change. A failed or timed-out request
  preserves the current complete project. Rapid selections use the latest request.
- Only the next image pair is warmed. Data-saving mode, known slow connections,
  reduced motion, background tabs and an offscreen hero skip advance loading.
- Pointer depth uses a settling requestAnimationFrame loop rather than permanent
  polling. No scroll interception or smooth-scroll dependency is installed.

`Hero.astro` preserves the original hero. Comparison pages at `/hero-original/`
and `/en/hero-original/` are noindex. Restore it through the `classicHero` prop if
required; no project data or other site sections need to change.

## Reduced motion and verification

Reduced-motion CSS keeps content visible, removes travel and decorative sweeps,
and disables page transitions. The shared controller releases pending entrances
and finishes an active FAQ transition when the preference changes. Filter
animations cancel and questionnaire steps remain immediate.

Run `npm run test:motion` to build and check Chromium and WebKit: once-only
reveals, rapid filters, keyboard and interrupted FAQ activation, form focus,
nine-page WCAG 2.1 AA checks, touch/reduced-motion fallbacks and no-JavaScript
visibility. Run `npm run test:hero` for the hero controls, network-aware loading
and image-failure paths. These checks do not replace real-device review.
