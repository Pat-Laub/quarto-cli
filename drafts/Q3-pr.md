<!-- quarto-dev/quarto-cli — Pull request (DRAFT, not opened). Branch: Pat-Laub:bugfix/revealjs-footer-print -->
# revealjs: print each slide's own footer in print view

## Description

Fixes #ISSUE.

In print view every slide is laid out on its own `.pdf-page` at once, so the live
footer logic, which follows the current slide, was skipped. The fixed default
footer was then printed on every page, including over per-slide footers and on
`{footer=false}` slides.

On `pdf-ready`, once reveal.js has built the pages, including the copies made for
fragments, this appends to each page a copy of the footer its slide shows in the
presentation:

- the slide's own `.footer`;
- otherwise the default footer, unless `data-footer="false"` or it is empty;
- with `has-dark-background` / `has-light-background` taken from the page's
  slide background, as in the live view.

The copy is positioned absolutely within its page (new rule in `footer.css`), and
the fixed default footer is hidden.

Test: `revealjs-footer-print.spec.ts` checks the four pages of the existing
`logo-footer.qmd` fixture in `?print-pdf`. It fails on `main` and passes with the
fix. I also checked a real `page.pdf()` export of the reproduction: each page now
carries the expected footer once, bottom-centred.

## Checklist

I have (if applicable):

- [ ] filed a [contributor agreement](https://github.com/quarto-dev/quarto-cli/blob/main/CONTRIBUTING.md). <!-- ~40 lines: maybe check whether this counts as "significant" -->
- [ ] referenced the GitHub issue this PR closes <!-- fill in #ISSUE once filed -->
- [x] updated the appropriate changelog
