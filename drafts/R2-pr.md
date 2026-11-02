<!-- hakimel/reveal.js — Pull request (DRAFT, not opened). Branch: Pat-Laub:fix-stretch-media-before-load -->
# Lay out `r-stretch` media again once it has loaded

Fixes #2706 (and the raster-image case described in it: #ISSUE-COMMENT).

`layoutSlideContents()` sizes `r-stretch` images and videos from their natural
size, which is 0 until the media has loaded. A lazy-loaded `data-src` is only set
when its slide comes into view, so a slide reached by a jump or a link is laid
out before its media loads. Width and height came out as `NaN`
and were ignored, leaving the element at the `0px` that `getRemainingHeight()`
had set while measuring: its restore appended `'px'` to a value that already
has its unit, so it never restored anything. Nothing laid the media out again
after it loaded, so the image stayed invisible.

This:

- restores the measured element's height as it was (`util.ts`);
- skips media whose size isn't known yet and adds a one-shot `load`
  (`loadedmetadata` for video) listener that calls `layout()` once it has loaded.
  Adding the same listener again on later layouts is a no-op.

Test: new `test/test-stretch.html`, with an `r-stretch` image beyond
`viewDistance`. It checks the image isn't collapsed to `0px` while its size is
unknown, and has a width and height once it has loaded. It fails on `master`
(1/4) and passes with the fix (4/4).

`npm test`: all pass apart from `test-mathjax4.html`, which loads MathJax from a
CDN that my sandbox blocks (it fails identically without this change).
`tsc --noEmit` is clean. `dist/` is not rebuilt.

I didn't add a video test: headless Chromium builds often can't decode the
bundled `video.mp4`, which would make it flaky.
