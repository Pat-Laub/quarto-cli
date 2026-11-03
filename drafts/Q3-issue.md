<!-- quarto-dev/quarto-cli — Bug report form (DRAFT, not filed). Sections follow the current form.
     Before filing: check every statement yourself (the Code of Conduct rules out posting unverified AI output),
     run `quarto check` on your machine, and tick the boxes only if they are true for you. -->
# revealjs PDF export prints the default footer on every page, ignoring per-slide footers and `footer=false`

### I have:

- [ ] searched the issue tracker for similar issues <!-- DRAFT NOTE: I searched "footer revealjs pdf print", "footer=false print-pdf"; no match -->
- [ ] installed the latest version of [Quarto CLI](https://github.com/quarto-dev/quarto-cli/releases/latest) <!-- DRAFT NOTE: reproduced on 1.11.9 and 1.12.0 -->
- [ ] formatted my issue following the [Bug Reports guide](https://quarto.org/bug-reports.html)

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

The PDFs of my ACTL3143 lecture slides ([pat-laub.github.io/DeepLearningForActuaries](https://pat-laub.github.io/DeepLearningForActuaries/)) have been
printed since July 2026 by a script that copies the right footer onto each page
after `pdf-ready`, to work around this.
<!-- DRAFT NOTE: dates from DeepLearningForActuaries c927088 (7 Jul 2026, placeFooters() in scripts/print_slides_pdfs.py);
     the published lecture PDFs were regenerated with it the same day (f182f49). -->

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

### Actual behavior

Text extracted from the printed PDF:

```
page 1: Footers in print view / Deck-wide footer
page 2: Uses the deck footer / Deck-wide footer
page 3: Has its own footer / Deck-wide footer
page 4: Turns the footer off / Deck-wide footer
```

### Expected behavior

The same footers as in the presentation: "Deck-wide footer" on the title page and
on page 2, "Slide's own footer" on page 3, none on page 4.

### Your environment

- Quarto 1.11.9 (latest release) and 1.12.0 (latest pre-release); the relevant code is unchanged on `main` (3190292c7)
- Chrome for Testing 153 on Linux (Playwright `page.pdf()`)

### Quarto check output

<!-- paste `quarto check` output before filing -->
