<!-- hakimel/reveal.js — Pull request (DRAFT, not opened). Branch: Pat-Laub:fix-next-enters-stack-at-top -->
# Enter a vertical stack at its top when going forwards with `next()`

Fixes #ISSUE.

`navigatePrev()` already arrives on the previous stack at its last slide
explicitly. `navigateNext()` instead called `navigateRight()`, i.e.
`slide( indexh + 1, undefined )`, which resumes at the stack's
`data-previous-indexv`. So returning to an earlier slide and stepping forward
(Space; arrows, controls and swipes in `linear` mode) skipped every slide above
the one the stack was last left on.

`navigateNext()` now arrives on the next stack at its top, or at its
`data-start-indexv` if the author set one. Unchanged:

- `Reveal.right()` (→ in the default navigation mode) still resumes a stack where it was left;
- `grid` navigation still keeps the vertical index;
- in the overview, `next()` still behaves as before.

Tests (in `test/test.html`), in the first commit. Each one leaves the 3.x stack
part way down and then goes back to 2.3, not to the first slide, since arriving
on the first slide resets every stack:

- `Reveal.next enters a vertical stack at its top` (default and linear modes): fails on `master`, passes with the fix;
- `Reveal.next enters a vertical stack at its data-start-indexv`;
- `Reveal.right resumes a vertical stack where it was left`, which pins the behaviour this keeps.

`npm test`: all pass apart from `test-mathjax4.html`, which loads MathJax from a
CDN that my sandbox blocks (it fails identically without this change).
`tsc --noEmit` is clean. `dist/` is not rebuilt.

Related: #3923 fixes the same root cause in the speaker view's Upcoming preview.
