<!-- quarto-dev/quarto-cli — Pull request (DRAFT, not opened). Branch: Pat-Laub:bugfix/revealjs-footer-deep-link -->
# revealjs: remove every stale per-slide footer clone

## Description

Fixes #ISSUE.

The support plugin clones the current slide's own `::: footer` onto `.reveal` on
both `ready` and `slidechanged`, but removed only the first existing clone, and
only on `slidechanged`. A deck opened on a slide with its own footer (deep link
or reload) gets `slidechanged` for that slide before `ready`. Two clones were
appended there, and one survived onto the next slide.

This moves the clean-up into `setSlideFooter()`, which both handlers call, and
removes every `.reveal > .footer:not(.footer-default)` there. Footers for decks
that start on the title slide are unaffected.

The first commit adds `revealjs-footer.spec.ts`, using the existing
`logo-footer.qmd` fixture: open on `#/slide-4`, expect exactly one clone, then
expect none on the `{footer=false}` slide and on a default-footer slide. Both
tests fail on `main` and pass with the fix. The existing footer tests in
`revealjs.spec.ts` (default and scroll view) and the rest of the revealjs
Playwright specs pass on Chromium. The multiplex spec fails in my sandbox with
and without this change; it needs the multiplex server.

## Checklist

I have (if applicable):

- [ ] filed a [contributor agreement](https://github.com/quarto-dev/quarto-cli/blob/main/CONTRIBUTING.md). <!-- small fix: probably not required -->
- [ ] referenced the GitHub issue this PR closes <!-- fill in #ISSUE once filed -->
- [x] updated the appropriate changelog
