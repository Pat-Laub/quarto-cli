<!-- hakimel/reveal.js — Bug report (DRAFT, not filed)
     Before posting: check every statement yourself. -->
# Stepping forward with `next()` skips slides at the top of a previously visited vertical stack

Moving forward with `Reveal.next()` into a vertical stack you have visited before
lands on the vertical slide you last left it on, not on its first slide. Every
slide above it is skipped. `next()` is what Space does in every navigation mode,
and what the arrow keys, the controls and swipes do in `navigationMode: 'linear'`.

Going backwards is fine: `navigatePrev()` explicitly arrives on the previous stack
at its last slide. `navigateNext()` calls `navigateRight()`, i.e.
`slide( indexh + 1, undefined )`, and `slide()` resumes an undefined vertical
index from the stack's `data-previous-indexv`.

This is the root cause of #3831 (the speaker view's Upcoming preview shows the
wrong slide at a stack boundary), which #3923 works around inside
`speaker-view.html`. Here the same thing happens in the presentation itself, so
fixing `next()` covers both.

**Steps to reproduce** (any presentation with a vertical stack after a horizontal slide
that is not the first slide):

```html
<div class="slides">
  <section>Start</section>
  <section>A</section>
  <section>
    <section>B.1</section>
    <section>B.2</section>
    <section>B.3</section>
  </section>
  <section>C</section>
</div>
<script>Reveal.initialize({ hash: true, navigationMode: 'linear' });</script>
```

1. Go to B.3 (e.g. a link to `#/2/2`).
2. Go back to A (a link to `#/1`, or `Reveal.slide( 1 )`).
3. Press → (or Space; in the default mode only Space).

**Expected:** B.1, then B.2 and B.3, as in a first pass through the presentation.

**Actual:** B.3. B.1 and B.2 are skipped.

(Going back to the *first* slide doesn't show it, because arriving there resets
every stack's remembered index. Any other slide does.)

A complete page is attached: `reveal.html` (loads reveal.js 6.0.2 from jsDelivr; I checked it against the `dist/` committed on `master`).

This is easy to hit in Quarto presentations, which default to
`navigationMode: 'linear'` and put every level-2 slide under a level-1 section
into a vertical stack. Jumping around with the slide menu, a table of contents or
an internal link, then stepping forward, silently skips the start of a section.

I've worked around it in my lecture slides for UNSW's ACTL3143 course
([pat-laub.github.io/DeepLearningForActuaries](https://pat-laub.github.io/DeepLearningForActuaries/)) since July 2026, by removing `data-previous-indexv`
after every slide change.
<!-- DRAFT NOTE: dates from DeepLearningForActuaries 8c2b689 (1 Jul 2026); the published decks picked it up the same day (fd180da). -->

Reproduced on reveal.js `master` (e240e17: the attached page, and a QUnit test in the
linked PR) and on 5.1.0 (as bundled by Quarto 1.12), with Chrome for Testing 153 on
Linux.
