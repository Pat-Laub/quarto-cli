<!-- hakimel/reveal.js — Pull request (DRAFT, not opened). Branch: Pat-Laub:fix-next-enters-stack-at-top -->
# Enter a vertical stack at its top when going forwards with `next()`

Fixes #ISSUE and #3831.

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

### The speaker view (#3831)

The speaker view's Upcoming preview hits the same bug. It is a reveal.js
instance of its own, kept one slide ahead of the presenter: on every slide
change it is sent the presenter's state and then calls `next()`. Having been
further down the next stack than the presenter, it previewed the slide it had
left there. With this change its `next()` lands where the presenter's will, so
#3831 is fixed without touching `speaker-view.html`.

I checked this end to end in the real speaker-view popup, with #3831's steps
(A → B → C → X → Y, then back to C):

| | Upcoming pane shows | Pressing next goes to |
|---|---|---|
| `master` | Y | X |
| this branch | X | X |

#3923 addresses #3831 inside `speaker-view.html` instead, by computing the
preview's target rather than calling `next()`. Its analysis of the root cause
is the same as here. Fixing `next()` itself also covers the presentation's own
navigation, and keeps the preview consistent with `next()` in cases such as
`data-start-indexv` (#3923's target always uses the top of the next stack).
With this change, #3923's workaround should no longer be needed.

### Tests

In the first commit (`test/test.html`). Each one leaves the 3.x stack part way
down and then goes back to 2.3, not to the first slide, since arriving on the
first slide resets every stack:

- `Reveal.next enters a vertical stack at its top` (default and linear modes): fails on `master`, passes with the fix;
- `Reveal.next after Reveal.setState enters a vertical stack at its top`: the speaker view's `setState` + `next()` sequence from #3831; fails on `master`, passes with the fix;
- `Reveal.next enters a vertical stack at its data-start-indexv`;
- `Reveal.right resumes a vertical stack where it was left`, which pins the behaviour this keeps.

`npm test` passes and `tsc --noEmit` is clean. `dist/` is not rebuilt.

CI on my fork: the test-only commit [fails on exactly the new tests](https://github.com/Pat-Laub/reveal.js/actions/runs/41549564570) and [the fix passes](https://github.com/Pat-Laub/reveal.js/actions/runs/41549564536) (Node 22 and 24).

This was prepared with the help of Claude Code; I have reviewed and tested it before opening this PR.
<!-- DRAFT NOTE: reveal.js has no stated AI policy; this disclosure is optional, but keep it only once it is true. -->
