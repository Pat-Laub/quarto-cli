<!-- quarto-dev/quarto-cli — Bug report (DRAFT, not filed) -->
# revealjs: a slide's only image is invisible when the slide is reached by a link or a jump

### Bug description

A slide whose only content is an image (which Quarto stretches with `.r-stretch`)
shows nothing when it is reached from further away in the presentation by an
internal link, `g` (jump to slide) or `Reveal.slide()`. The image is in the DOM with `style="height: 0px;"`, and
it stays that way after it has loaded. Stepping slide by slide, or opening the
presentation directly on that slide, is fine: there the image has loaded before
the slide is laid out.

This is a reveal.js bug, present in the bundled 5.1.0 and on reveal.js `master`
(hakimel/reveal.js#2706, PR hakimel/reveal.js#PR). Pandoc gives slide images a
lazy `data-src`, so the image only starts loading when its slide comes into view.
reveal.js lays the slide out straight away, before it knows the image's size,
which leaves it at `0px`, and it never lays the slide out again when the image
loads.

### Steps to reproduce

````qmd
---
title: "A stretched image reached by a link has no height"
format: revealjs
---

## Start here {#start}

[Jump to the figure](#the-figure)

## Filler 1

## Filler 2

## Filler 3

## Filler 4

## The figure {#the-figure}

![](figure.png)
````

(any image will do as `figure.png`)

1. Render and open the presentation.
2. Click "Jump to the figure".

### Expected behavior

The image fills the slide.

### Actual behavior

The slide is empty; the `<img class="r-stretch">` has `style="height: 0px;"`.

### Your environment

- Quarto 1.12.0 (reveal.js 5.1.0); unchanged on `main` (3190292c7)
- Chrome for Testing 153 on Linux (Playwright)

### Quarto check output

<!-- paste `quarto check` output before filing -->
