<!-- quarto-dev/quarto-cli — Pull request (DRAFT, not opened). Branch: Pat-Laub:bugfix/revealjs-stretch-image-lazy-load -->
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

Test: new `revealjs-stretch.spec.ts` with fixture `stretch-image-lazy-load.qmd`:
follow a link to a slide outside the view distance whose only content is an
image, and expect the image to get a height. It fails on `main` (height 0) and
passes with the fix. The rest of the revealjs Playwright specs pass on Chromium,
apart from the multiplex spec, which fails in my sandbox with and without this
change.

## Checklist

I have (if applicable):

- [ ] filed a [contributor agreement](https://github.com/quarto-dev/quarto-cli/blob/main/CONTRIBUTING.md). <!-- small fix: probably not required -->
- [ ] referenced the GitHub issue this PR closes <!-- fill in #ISSUE once filed -->
- [x] updated the appropriate changelog
