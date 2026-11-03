<!-- hakimel/reveal.js — comment on the existing open issue #2706 "SVG images with class "stretch" are not displayed" (DRAFT, not posted).
     Alternative: file as a new issue and reference #2706. -->

This also happens to raster images, whenever an `r-stretch` image hasn't loaded
by the time its slide is laid out. That is the normal case for a lazy-loaded
`data-src` image on a slide reached by a jump or a link. It stays
`style="height: 0px;"` after it loads.

Two things combine in `layoutSlideContents()`:

1. `Util.getRemainingHeight()` sets the element to `height: 0px` to measure the
   other content, then "restores" it with `element.style.height = oldHeight + 'px'`.
   `oldHeight` already has its unit (`'123px'`) or is `''`, so the restore assigns
   `'123pxpx'` / `'px'`, which the browser ignores, and the element stays at `0px`.
2. For media whose `naturalWidth`/`videoWidth` is still 0, the width and height
   come out as `NaN` and are ignored as well. Nothing lays the slide out again
   when the media finishes loading.

Minimal case:

```html
<div class="slides">
  <section>1</section><section>2</section><section>3</section><section>4</section>
  <section><h2>5</h2><img class="r-stretch" data-src="image.png"></section>
</div>
<script>Reveal.initialize({ viewDistance: 2 }); Reveal.slide( 4 );</script>
```

The image never becomes visible. Quarto presentations hit this a lot: Quarto marks
a lone image on a slide `r-stretch`, and Pandoc emits slide images with `data-src`.

I hit this in my lecture slides and patch around it there.
<!-- DRAFT NOTE: the slide-stage workaround is only from 2 Nov 2026 (slide-stage 7334fd0); add the course and date
     yourself, or delete this line. -->

PR: #PR
