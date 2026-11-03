<!-- quarto-dev/quarto-cli — Pull request (DRAFT, not opened). Branch: Pat-Laub:bugfix/revealjs-stretch-image-lazy-load, based on the current main (3190292c7).
     Follows the current PR template and CONTRIBUTING "AI-assisted contributions". -->
# revealjs: lay slides out again once stretched media loads

## Description

Fixes #ISSUE.

reveal.js sizes `.r-stretch` images and videos from their natural size, which is
0 until the media has loaded, and swaps a lazy `data-src` in only when the slide
comes into view. A slide reached from further away is laid out before its image
has loaded, which leaves the image at `height: 0px`, and reveal.js 5.1.0 never
lays it out again. Every lone (auto-stretched) image on a slide reached by a
link, jump-to-slide (`g`) or `Reveal.slide()` is affected.

The proper fix is in reveal.js (hakimel/reveal.js#PR). Until the bundled reveal.js
includes it (#15005), this adds a small interim fix in the support plugin, in the
same "mirrors reveal.js … remove when bundled" style as `updateInertSlides`: a
capture-phase `load` / `loadedmetadata` listener on the slides element that calls
`deck.layout()` when a stretched image or video finishes loading.

The first commit adds `revealjs-stretch.spec.ts` with fixture
`stretch-image-lazy-load.qmd`: once the page has loaded, follow a link to a slide
outside the view distance whose only content is an image, and expect the image
to get a height. The fixture sets `html-math-method: plain`, because the math
plugin re-runs the layout once MathJax has loaded; on CI that lands right after
the test's jump and would size the image even without the fix. On my fork's CI,
the test-only commit [fails on exactly the new spec](https://github.com/Pat-Laub/quarto-cli/actions/runs/41562276346) (image
height 0 in Chromium, Firefox and WebKit) and [the fix passes](https://github.com/Pat-Laub/quarto-cli/actions/runs/41562276258).
The full parallel smoke suite (as run for PRs), with all four of my revealjs/html fixes merged, passed all 42 jobs ([run](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545835371)).

## Checklist

I have (if applicable):

- [ ] referenced the GitHub issue this PR closes <!-- DRAFT NOTE: tick once #ISSUE is filled in -->
- [x] updated the appropriate changelog in the PR
- [x] ensured the present test suite passes
- [x] added new tests
- [ ] created a separate documentation PR in [Quarto's website repo](https://github.com/quarto-dev/quarto-web/) and linked it to this PR <!-- not needed: no documented behaviour changes -->

<details>
<summary>AI-assisted PR</summary>

- **AI tool used**: Claude Code
- **Codebase grounding**: local clone of `quarto-cli` at `main`; the bug reproduced in Chromium (Playwright) with Quarto 1.11.9 and 1.12.0; Quarto's own Playwright specs run locally and the smoke-test workflow on my fork (links above).
- **Human review**: I have reviewed, tested, and verified the AI-generated content before submitting. <!-- DRAFT NOTE: only true once you have done this yourself; keep or reword accordingly -->

Note: autonomous AI agents submitting PRs without human oversight are not permitted — see the [Code of Conduct](CODE_OF_CONDUCT.md).

</details>
