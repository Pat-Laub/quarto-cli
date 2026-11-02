<!-- quarto-dev/quarto-cli — Bug report (DRAFT, not filed) -->
# revealjs: a slide's own footer stays on the next slide when the presentation is opened on that slide

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

### Expected behavior

No footer on that slide, and only one copy of the footer on `#/footed`.

### Actual behavior

"Footer for the first footed slide" is still shown. In the DOM, `#/footed` has
two `.reveal > .footer` clones, and one is left on `#/plain`:

```js
document.querySelectorAll('.reveal > .footer:not(.footer-default)').length
// on #/footed: 2, then after → on #/plain: 1
```

### Your environment

- Quarto 1.12.0; `support.js` is unchanged on `main` (3190292c7)
- Chrome for Testing 153 on Linux (Playwright)

### Quarto check output

<!-- paste `quarto check` output before filing -->
