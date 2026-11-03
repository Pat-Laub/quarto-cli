# Upstreaming the Quarto / reveal.js workarounds

Working notes, kept on their own branch (`notes/revealjs-upstreaming`, no Quarto
source in its history) of `Pat-Laub/quarto-cli`. They come from auditing the
revealjs customisations in ACTL3142, DeepLearningForActuaries, slide-stage,
annotate, scribble and UNSW-Quarto-Slides-Template, sorting each one into a
**bug in Quarto or reveal.js** or a **personal/style choice**. The bugs worth
upstreaming have a minimal example, a failing test and a fix, on branches of
the two forks.

**Nothing has been filed or opened upstream.** Every issue and PR text in
`drafts/` is a draft for you to review.

## Status at a glance

| # | Bug | Upstream | Reported already? | Fork branch | Local test, before → after |
|---|-----|----------|-------------------|-------------|----------------------------|
| 1 | Lazy-loaded `r-stretch` image stays at `height: 0px` (any lone image reached by a link or jump) | reveal.js | Yes, hakimel/reveal.js#2706 (2020, no replies) | [`fix-stretch-media-before-load`](https://github.com/Pat-Laub/reveal.js/tree/fix-stretch-media-before-load) | `test-stretch.html` 1/4 → 4/4 |
| 1b | Same bug, interim fix in Quarto until it bundles reveal.js 6 (quarto-dev/quarto-cli#15005) | Quarto | no | [`bugfix/revealjs-stretch-image-lazy-load`](https://github.com/Pat-Laub/quarto-cli/tree/bugfix/revealjs-stretch-image-lazy-load) | `revealjs-stretch.spec.ts` fail → pass |
| 2 | `next()` (Space; arrows, controls and swipes in `linear` mode) re-enters a visited stack mid-way, skipping slides | reveal.js | No (hakimel/reveal.js#3923 fixes the same root cause in the speaker view only) | [`fix-next-enters-stack-at-top`](https://github.com/Pat-Laub/reveal.js/tree/fix-next-enters-stack-at-top) | `test.html` new test fail → 218/218 |
| 3 | `code-annotations: none` → `ReferenceError: selectedAnnoteEl is not defined` on every resize (html and revealjs) | Quarto | no | [`bugfix/code-annotations-none-resize`](https://github.com/Pat-Laub/quarto-cli/tree/bugfix/code-annotations-none-resize) | `code-annotations-none.spec.ts` 2 fail → 2 pass |
| 4 | Opening a deck on a slide with its own footer leaves that footer on the next slide | Quarto | no | [`bugfix/revealjs-footer-deep-link`](https://github.com/Pat-Laub/quarto-cli/tree/bugfix/revealjs-footer-deep-link) | `revealjs-footer.spec.ts` 2 fail → 2 pass |
| 5 | PDF/print view prints the default footer on every page, ignoring per-slide footers and `footer=false` | Quarto | no | [`bugfix/revealjs-footer-print`](https://github.com/Pat-Laub/quarto-cli/tree/bugfix/revealjs-footer-print) | `revealjs-footer-print.spec.ts` fail → pass; real PDF checked |

Each branch is two commits on top of upstream (quarto-cli `main` at `3190292c7`,
reveal.js `master` at `e240e17`): the failing test, then the fix (with a
changelog entry for Quarto).

## GitHub Actions

### reveal.js: the fork's own `Tests` workflow (`npm test`, Node 22 and 24)

`Tests` runs on every push, so each `ci/…` ref here points at an existing commit
and adds nothing.

| Ref | Commit | Result |
|-----|--------|--------|
| `ci/baseline` (= `master`) | `e240e17` | ✅ [success](https://github.com/Pat-Laub/reveal.js/actions/runs/41547652078) |
| `ci/test-only/fix-next-enters-stack-at-top` | `27f62c8` (tests only) | ❌ [failure](https://github.com/Pat-Laub/reveal.js/actions/runs/41549564570): only the new `Reveal.next` tests |
| `fix-next-enters-stack-at-top` | `b601d53` | ✅ [success](https://github.com/Pat-Laub/reveal.js/actions/runs/41549564536) |
| `ci/test-only/fix-stretch-media-before-load` | `f681248` (test only) | ❌ [failure](https://github.com/Pat-Laub/reveal.js/actions/runs/41551803841): only `test-stretch.html` |
| `fix-stretch-media-before-load` | `6beecd0` | ✅ [success](https://github.com/Pat-Laub/reveal.js/actions/runs/41551803914) |

`test-mathjax4.html`, which fails in the sandbox for lack of CDN access, passes on
GitHub (11/11). Earlier runs of both branches (before the speaker-view test and
before the stretch test waited for the page's `load` event) behaved the same way:
[next() test-only ❌](https://github.com/Pat-Laub/reveal.js/actions/runs/41547652018), [next() fixed ✅](https://github.com/Pat-Laub/reveal.js/actions/runs/41547652237),
[stretch test-only ❌](https://github.com/Pat-Laub/reveal.js/actions/runs/41547652313), [stretch fixed ✅](https://github.com/Pat-Laub/reveal.js/actions/runs/41547763426).

### quarto-cli: Quarto's own `test-smokes.yml`, called by `fork-ci.yml` on `ci/**` pushes

Each `ci/…` branch is the fix branch (or its first, test-only commit) plus one
CI-only commit adding `.github/workflows/fork-ci.yml`. Upstream runs these smoke
tests only for `main` and pull requests. The Playwright runs use Quarto's
`integration/playwright-tests.test.ts` (Chromium, Firefox and WebKit on Ubuntu,
about 1,455 tests).

| Fix | Test only | With fix |
|-----|-----------|----------|
| none (`main`, baseline) | | ✅ [success](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545627268) |
| `code-annotations-none-resize` | ❌ [failure](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545660850): only `code-annotations-none.spec.ts` (2 tests × 3 browsers); 1451 passed | ✅ [success](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545664826) |
| `revealjs-footer-deep-link` | ❌ [failure](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545668806): only `revealjs-footer.spec.ts` (2 tests × 3 browsers); 1451 passed | ✅ [success](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545671487) |
| `revealjs-footer-print` | ❌ [failure](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545676028): only `revealjs-footer-print.spec.ts` (1 test × 3 browsers); 1451 passed | ✅ [success](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545678090) |
| `revealjs-stretch-image-lazy-load`, first version of the test | ⚠️ [passed](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545682263) without the fix | ✅ [success](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545686112) |
| … second version (waits for the page's `load`) | ⚠️ [passed](https://github.com/Pat-Laub/quarto-cli/actions/runs/41557405843) without the fix | ✅ [success](https://github.com/Pat-Laub/quarto-cli/actions/runs/41557406125) |
| … current (`6f72f0d` / `9236737`; fixture without the math plugin) | [running](https://github.com/Pat-Laub/quarto-cli/actions/runs/41562276346) | [running](https://github.com/Pat-Laub/quarto-cli/actions/runs/41562276258) |

**The stretch test kept passing without the fix on CI.** reveal.js 5.1.0 lays a
slide out synchronously inside `slide()`, just after the lazy `src` is set, so
the bug shows only if nothing lays the slides out again once the image has
loaded. Two things in a fresh CI page do:

1. reveal.js's own layout on the window's `load` event. The second version of
   the test waits for that before following the link.
2. reveal's math plugin. Pandoc's revealjs template includes it whenever the
   math method is MathJax, which is Quarto's revealjs default, and the plugin
   calls `deck.layout()` once MathJax has loaded from jsDelivr. On GitHub that
   lands a few seconds after page load, so right after the test's jump. In my
   sandbox jsDelivr is blocked, MathJax never loads, and the bug always showed.
   The current fixture sets `html-math-method: plain` (it has no math).

A reader jumps long after both have happened, so they still hit the bug; this
was only the test's timing.

**Full parallel smoke suite** (20 buckets × Ubuntu and Windows), as upstream runs
for a PR:

- [all four fixes merged](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545835371): **all 42 jobs passed**. Windows bucket 20 was cancelled during attempt 1 and passed on re-run (attempt 2);
- [`main` baseline](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545831444): 16 passed, 26 cancelled mid-run, not re-run, since the combined run had no failures to attribute.

The cancellations at 00:15–00:16 UTC came from GitHub disabling workflows on the
fork ("to reduce the amount of compute that is wasted"). After it was re-enabled,
only `Fork CI` was left enabled on the fork.

## Priority list and reasoning

Ranked by how often it bites a Quarto deck, how clearly it is a bug rather than a
design choice, and how small and testable the fix is.

1. **reveal.js: stretched media laid out before it loads.** Every Quarto slide
   whose only content is an image gets `.r-stretch`, and Pandoc gives slide images
   a lazy `data-src`. Reached by an internal link, `g` (jump to slide) or
   `Reveal.slide()` from beyond the view distance, the image is invisible for good.
   I checked all three; a deep link on first load is fine. Two bugs combine:
   `getRemainingHeight()` "restores" with `oldHeight + 'px'` on a value that already
   has its unit (so it stays `0px`), and nothing lays out again once the image
   loads. Fix: restore properly, skip unsized media, and re-run `layout()` once on
   `load`/`loadedmetadata`. The Quarto shim (1b) mirrors the existing
   `updateInertSlides` precedent ("mirrors reveal.js …, remove when bundled").
2. **reveal.js: `next()` resumes a stack where it was left.** In Quarto's default
   `linear` mode with `#`-section stacks: visit B.3, go back to A by a link or the
   menu, press → and you land on B.3. `navigatePrev()` explicitly targets the
   bottom of the previous stack; `navigateNext()` relied on
   `slide(h + 1, undefined)`, which resumes `data-previous-indexv`. The fix targets
   the top of the stack (or `data-start-indexv`) and keeps `right()`'s resume,
   grid mode and the overview as they were. Note: arriving on the **first** slide
   resets every stack, so the bug shows when returning to any other slide. My
   first version of the test missed this and only failed through a race; the
   committed test goes back to 2.3 instead.
3. **Quarto: `selectedAnnoteEl` is not defined.** A one-line hoist. The error also
   fires during decktape's viewport resize, which is where DLA noticed it.
4. **Quarto: per-slide footer clone leaks after a deep link.** `ready` and
   `slidechanged` both append a clone, and only one is ever removed. The fix
   removes all clones whenever the footer is set.
5. **Quarto: footers in print view.** All footer logic is behind
   `if (!isPrintView())`, so the fixed default footer repeats on every page. The fix
   puts the right footer on each `.pdf-page` on `pdf-ready` (fragment copies
   included), positioned on that page. This also replaces most of
   `placeFooters()` in DLA's `print_slides_pdfs.py`.

Worth doing next, but not started:

6. **Quarto: `layout-*` attribute order is non-deterministic.**
   `panellayout.lua` turns the attributes into a plain Lua table
   (`as_plain_table`), so `pandoc.Attr` re-emits them in hash order, which Lua
   5.4 seeds per process. This is what DLA's `filters/deterministic-html.lua`
   sorts. I confirmed it by reading the code; I have no MWE or patch yet.
7. **Chalkboard plugin (rajgoel/reveal.js-plugins, which Quarto vendors at a
   pinned commit):**
   - drawing offset under the zoom plugin (`pageX/pageY` ignore the body
     transform);
   - blurry ink on HiDPI (the canvas isn't scaled by `devicePixelRatio`);
   - `transition: 0` is ignored (`if ( config.transition )`).

   All three are confirmed in the vendored code. They belong in rajgoel's repo,
   which is outside the forks you OK'd, so I left them.
8. **Optional Quarto shim for #2** (DLA/slide-stage already use one: clear
   `data-previous-indexv` on `slidechanged` in `linear` mode). It's simple, but it
   changes behaviour more than a reveal.js update would, so I'd raise it in the
   issue rather than open a PR.

Already handled upstream, so no new PR:

- **PDF slide numbers ignore `c/t` and `uncounted`:** hakimel/reveal.js#3924, with
  open PRs hakimel/reveal.js#3928 and hakimel/reveal.js#3940. Reviewing or
  testing one of those does more than a third PR would. DLA's `fixSlideNumbers()`
  can go once one merges and Quarto bundles it.
- **URL hash lags a slide behind (1 s `replaceState` throttle):**
  hakimel/reveal.js#3402 (open). The throttle is deliberate, to stay under
  browsers' `replaceState` rate limits, so this is a trade-off, not a clear bug.
- **Text selection reaching hidden slides** (slide-stage `48caae6`): Quarto
  **1.11.6+** marks off-screen slides `inert` (quarto-dev/quarto-cli#15010). In
  my probe on 1.12.0 a drag picked up nothing from the previous slide, so the
  `visibility: hidden` rule in `slide-stage.scss` is probably redundant now.
  Worth re-running slide-stage's `selection.spec.js` without it.

## The audit: bug or style?

### Bugs in Quarto or reveal.js (upstream candidates above)

| Where | Workaround | Verdict |
|---|---|---|
| DLA `reveal-fixes.html` §1, slide-stage `reveal-fixes.html` | `window.selectedAnnoteEl = …` | Quarto bug, #3 |
| slide-stage `reveal-fixes.html` | re-run `Reveal.layout()` on stretched image `load` | reveal.js bug, #1 |
| DLA §4, slide-stage | strip `data-previous-indexv` after every slide change | reveal.js bug, #2 |
| slide-stage `reveal-fixes.html` (last script) | keep one footer clone | Quarto bug, #4 |
| DLA `print_slides_pdfs.py` `placeFooters()` | copy footers onto each `.pdf-page` | Quarto bug, #5 |
| DLA `print_slides_pdfs.py` `fixSlideNumbers()` | recompute `c/t` numbers, skip uncounted | reveal.js bug, already reported |
| DLA `filters/deterministic-html.lua` (layout attrs) | sort `layout-*` attributes | Quarto bug, #6 |
| DLA §2 chalkboard zoom + HiDPI, `_quarto.yml` `transition: 1` | pointer remap, DPR backing store, 1 ms instead of 0 | chalkboard plugin bugs, #7 |

### Debatable: design trade-offs or environment quirks (not pursued)

| Where | Workaround | Why not upstream |
|---|---|---|
| DLA §3, slide-stage | immediate hash sync | deliberate throttle; hakimel/reveal.js#3402 open |
| DLA §5, slide-stage | load every slide while the overview is open | reveal caps the overview's view distance to save memory; slide-stage found eager loading crashes iPad Safari, so the cap is doing its job |
| DLA `revealjs-style.scss` `.reveal.overview section.center` flex | centre unvisited title slides in the overview | a side effect of the eager-load patch above; reveal 6 lays out the slides it makes visible when the overview opens |
| DLA `print_slides_pdfs.py` rAF shim | `requestAnimationFrame` → `setTimeout` | headless Chrome `--virtual-time-budget` stops producing frames; a Chrome quirk |
| DLA `print_slides_pdfs.py` transform/overflow on `.pdf-page` | stop print fragmentation pushing monolithic content off the page | possibly a reveal print-CSS issue, but tied to Chrome fragmentation and `pdfMaxPagesPerSlide=1`; would need its own MWE |
| DLA / slide-stage display-math-in-list CSS | full-width lists containing display math | reveal's lists are `inline-block` on purpose; centring within the list is arguably intended |
| slide-stage ordered-list markers | custom `::before` counters | mostly a consequence of the clipped inset frame |
| DLA `python.xml` | custom Python syntax definition | KDE syntax-highlighting / skylighting, not Quarto |
| DLA `scripts/remove_require_js.py` | strip require.js when PyScript is present | old PyScript clash; PyScript is gone from the decks |

### Personal / style / feature choices (stay in your repos)

- **ACTL3142** has no bug workarounds at all. Everything in `custom.scss`,
  `styles.css`, `title-slide.html`, `animations.js` and `_quarto.yml` is theme,
  content or preference: fonts and colours, KaTeX size, code-block heights and
  backgrounds, the yellow bar and title polygon, logo size, hidden code-fold
  summary, `preview-links`/`history: false`, the transparent chalkboard
  background, slider animations. `scripts/` holds one-off LaTeX→qmd migration
  helpers and decktape PDF export.
- **DLA:** the yellow bar geometry and logo clamp (including the print and
  overview variants), the title SVG background, 90 % background box, `title-col2`,
  fonts (self-hosted to beat a decktape race), code sizes and borders, blockquote
  padding, hidden code-fold, the transparent `#notescanvas` (the chalkboard's grey
  tint is deliberate), zoom arrow-key panning (a feature), `print-media` extension
  (a feature), 16:9 PDF widening, sidebar collapse and the colour-toggle move
  (website, not revealjs), Jupyter cell-id and `execution_count` stripping
  (reproducibility preference), slides kept out of search.
- **slide-stage / annotate / scribble / template:** the fixed 3744×2106 stage, the
  overview pitch, baked overview thumbnails, `menu: false`, footer and code sizes
  scaled to the authored canvas, the non-clickable progress bar, taking over `R`
  from Quarto's scroll view, and the annotate pen replacing chalkboard. These are
  design decisions for that stage, not general bugs. The template's
  `reveal-fixes.html` is an older copy of slide-stage's (without the
  `selectedAnnoteEl`, stretch and overview-pitch scripts), with the same verdicts.

## Once fixes land, these workarounds can go

| Workaround | Remove after |
|---|---|
| `selectedAnnoteEl` script (DLA, slide-stage and its copies in annotate and scribble) | Quarto with #3 |
| stretched-image `load` → `layout()` (slide-stage) | Quarto with #1b, or bundled reveal.js with #1 |
| footer-clone `MutationObserver` (slide-stage) | Quarto with #4 |
| `placeFooters()` in `print_slides_pdfs.py` (DLA, template) | Quarto with #5 |
| `data-previous-indexv` clearing (DLA, slide-stage, annotate, scribble, template) | Quarto bundling reveal.js with #2 |
| `fixSlideNumbers()` (DLA, template) | Quarto bundling a reveal.js with hakimel/reveal.js#3928 or #3940 |
| `visibility: hidden` on non-present slides (slide-stage) | probably now (Quarto ≥ 1.11.6); verify first |

## Layout of this branch

```
README.md                 this report
drafts/                   issue and PR texts per bug; R1/R2-reveal.html are the standalone pages for the reveal.js reports
mwe/                      minimal .qmd per bug (q3 also has before/after PDFs; r1/r2 also have plain reveal.js pages)
tools/probe/              Playwright scripts that reproduce each bug (node probe.js <dir> <script>)
tools/overlay             copy patched src/resources into an installed Quarto's share/
tools/fresh-render        render after deleting _files (Quarto only re-copies a library when the source is newer)
tools/playwright.local.config.ts  Chromium-only, python3 http.server variant of quarto-cli's Playwright config
```

The `tools/` scripts hard-code the sandbox paths they were written in
(`/home/user/dl/quarto-1.12.0`, `/home/user/quarto-cli`); adjust them before reuse.

## Opening the PRs once you've reviewed them

The `bugfix/…` and `fix-…` branches are exactly what would go upstream: each
is based on upstream `main`/`master` and contains only the two commits (test,
then fix). After filling in each draft's `#ISSUE`/`#PR` placeholders:

- quarto-cli: `https://github.com/quarto-dev/quarto-cli/compare/main...Pat-Laub:quarto-cli:<branch>?expand=1`
- reveal.js: `https://github.com/hakimel/reveal.js/compare/master...Pat-Laub:reveal.js:<branch>?expand=1`

The commits are authored as `Patrick Laub <p.laub@unsw.edu.au>`, with a
`Co-Authored-By: Claude` trailer; amend the author if you use a different
address on GitHub. Quarto asks for a contributor agreement only for
"significant" changes, and these are all small bug fixes.

The `ci/…` branches can be deleted once you're done with the runs; nothing
else depends on them.
