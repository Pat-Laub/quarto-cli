<!-- quarto-dev/quarto-cli — Bug report (DRAFT, not filed) -->
# revealjs PDF export prints the default footer on every page, ignoring per-slide footers and `footer=false`

### Bug description

In reveal.js print view (`?print-pdf`, which is how Quarto documents PDF export
of revealjs), every page gets the presentation's default `footer:`:

- on slides with their own `::: footer`, the slide's footer is lost and the
  default one is printed instead;
- on slides marked `{footer=false}`, the default footer is printed anyway.

In `addFooter()` (`src/resources/formats/revealjs/plugins/support/support.js`)
all the per-slide logic is behind `if (!isPrintView())`. In print view, the only
footer left is the default one, moved to `.reveal`, and it is `position: fixed`
(`footer.css`), so the browser repeats it on every printed page.

### Steps to reproduce

````qmd
---
title: "Footers in print view"
format:
  revealjs:
    footer: "Deck-wide footer"
---

## Uses the deck footer

## Has its own footer

::: footer
Slide's own footer
:::

## Turns the footer off {footer=false}
````

1. Render, open `index.html?print-pdf`, and print to PDF (or use Chrome headless
   `--print-to-pdf`).

### Expected behavior

The same footers as in the presentation: "Deck-wide footer" on the title page and
on page 2, "Slide's own footer" on page 3, none on page 4.

### Actual behavior

Text extracted from the printed PDF:

```
page 1: Footers in print view / Deck-wide footer
page 2: Uses the deck footer / Deck-wide footer
page 3: Has its own footer / Deck-wide footer
page 4: Turns the footer off / Deck-wide footer
```

### Your environment

- Quarto 1.12.0; `support.js` is unchanged on `main` (3190292c7)
- Chrome for Testing 153 on Linux (Playwright `page.pdf()`)

### Quarto check output

<!-- paste `quarto check` output before filing -->
