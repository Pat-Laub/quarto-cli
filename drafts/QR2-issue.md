<!-- quarto-dev/quarto-cli — Bug report form (DRAFT, not filed). Sections follow the current form.
     Before filing: check every statement yourself (the Code of Conduct rules out posting unverified AI output),
     run `quarto check` on your machine, and tick the boxes only if they are true for you. -->
# revealjs: a slide's only image is invisible when the slide is reached by a link or a jump

### I have:

- [ ] searched the issue tracker for similar issues <!-- DRAFT NOTE: I searched "auto-stretch image link", "r-stretch revealjs image not displayed", "revealjs image disappears jump slide"; no match -->
- [ ] installed the latest version of [Quarto CLI](https://github.com/quarto-dev/quarto-cli/releases/latest) <!-- DRAFT NOTE: reproduced on 1.11.9 and 1.12.0 -->
- [ ] formatted my issue following the [Bug Reports guide](https://quarto.org/bug-reports.html)

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

Possibly related, but separate: #13943 reports stretched images missing in mobile
view. That is reveal.js's scroll view, which Quarto switches to on narrow
screens. There the re-run layout itself sizes the image to 0 × 0, so the fix
for this issue does not help it (checked at a 412 × 915 viewport).

I hit this in my lecture slides and patch around it there.
<!-- DRAFT NOTE: the slide-stage workaround is only from 2 Nov 2026 (slide-stage 8c2fc4d, release 0.8.18), so
     there is no "for months" claim to make here. ACTL2131 uses slide-stage, but I can't see ACTL2131 from this
     session; add the course and date yourself, or delete this paragraph. -->

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

### Actual behavior

The slide is empty; the `<img class="r-stretch">` has `style="height: 0px;"`.

### Expected behavior

The image fills the slide.

### Your environment

- Quarto 1.11.9 (latest release) and 1.12.0 (latest pre-release), both bundling reveal.js 5.1.0; the relevant code is unchanged on `main` (3190292c7)
- Chrome for Testing 153 on Linux (Playwright)

### Quarto check output

<!-- paste `quarto check` output before filing -->
