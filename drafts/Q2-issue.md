<!-- quarto-dev/quarto-cli — Bug report form (DRAFT, not filed). Sections follow the current form.
     Before filing: check every statement yourself (the Code of Conduct rules out posting unverified AI output),
     run `quarto check` on your machine, and tick the boxes only if they are true for you. -->
# revealjs: a slide's own footer stays on the next slide when the presentation is opened on that slide

### I have:

- [ ] searched the issue tracker for similar issues <!-- DRAFT NOTE: I searched "revealjs footer twice", "revealjs footer previous slide"; no match -->
- [ ] installed the latest version of [Quarto CLI](https://github.com/quarto-dev/quarto-cli/releases/latest) <!-- DRAFT NOTE: reproduced on 1.11.9 and 1.12.0 -->
- [ ] formatted my issue following the [Bug Reports guide](https://quarto.org/bug-reports.html)

### Bug description

When a revealjs presentation is opened directly on a slide that has its own
`::: footer` (a link to `#/that-slide`, or reloading while on it), that footer
is still shown after moving to the next slide, including a slide with no footer
of its own. If the deck also has a default `footer:`, the two overlap there.

The cause is in `addFooter()` in `src/resources/formats/revealjs/plugins/support/support.js`.
`setSlideFooter()` appends a clone of the current slide's footer to `.reveal`
on both `ready` and `slidechanged`. When the deck opens on a later slide,
reveal.js fires `slidechanged` for it during start-up and then `ready`, so two
clones are appended. The `slidechanged` handler removes only the first
`.reveal > .footer:not(.footer-default)` it finds, so one clone survives the next
slide change.

I hit this in my lecture slides and patch around it there.
<!-- DRAFT NOTE: the slide-stage workaround is only from 2 Nov 2026 (slide-stage 44404a8, release 0.8.19), so
     there is no "for months" claim to make here. ACTL2131 uses slide-stage, but I can't see ACTL2131 from this
     session; add the course and date yourself, or delete this paragraph. -->

### Steps to reproduce

````qmd
---
title: "Per-slide footer outlives its slide"
format: revealjs
---

## First footed slide {#footed}

::: footer
Footer for the first footed slide
:::

## A slide with no footer of its own {#plain}

## Second footed slide {#footed-2}

::: footer
Footer for the second footed slide
:::
````

1. Render it and open `index.html#/footed`.
2. Press → to move to "A slide with no footer of its own".

### Actual behavior

"Footer for the first footed slide" is still shown. In the DOM, `#/footed` has
two `.reveal > .footer` clones, and one is left on `#/plain`:

```js
document.querySelectorAll('.reveal > .footer:not(.footer-default)').length
// on #/footed: 2, then after → on #/plain: 1
```

### Expected behavior

No footer on that slide, and only one copy of the footer on `#/footed`.

### Your environment

- Quarto 1.11.9 (latest release) and 1.12.0 (latest pre-release); the relevant code is unchanged on `main` (3190292c7)
- Chrome for Testing 153 on Linux (Playwright)

### Quarto check output

<!-- paste `quarto check` output before filing -->
