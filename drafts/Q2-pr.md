<!-- quarto-dev/quarto-cli — Pull request (DRAFT, not opened). Branch: Pat-Laub:bugfix/revealjs-footer-deep-link, based on the current main (3190292c7).
     Follows the current PR template and CONTRIBUTING "AI-assisted contributions". -->
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
expect none on the `{footer=false}` slide and on a default-footer slide. On my
fork's CI, the test-only commit [fails on exactly the new spec](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545668806)
(2 tests × Chromium, Firefox, WebKit) and [the fix passes](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545671487),
including the existing footer tests in `revealjs.spec.ts`. The full parallel smoke suite (as run for PRs), with all four of my revealjs/html fixes merged, passed all 42 jobs ([run](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545835371)).

## Checklist

I have (if applicable):

- [ ] referenced the GitHub issue this PR closes <!-- DRAFT NOTE: tick once #ISSUE is filled in -->
- [x] updated the appropriate changelog in the PR
- [x] ensured the present test suite passes
- [x] added new tests
- [ ] created a separate documentation PR in [Quarto's website repo](https://github.com/quarto-dev/quarto-web/) and linked it to this PR <!-- not needed: no documented behaviour changes -->

<details>
<summary>AI-assisted PR</summary>

- **AI tool used**: Claude Code
- **Codebase grounding**: local clone of `quarto-cli` at `main`; the bug reproduced in Chromium (Playwright) with Quarto 1.11.9 and 1.12.0; Quarto's own Playwright specs run locally and the smoke-test workflow on my fork (links above).
- **Human review**: I have reviewed, tested, and verified the AI-generated content before submitting. <!-- DRAFT NOTE: only true once you have done this yourself; keep or reword accordingly -->

Note: autonomous AI agents submitting PRs without human oversight are not permitted — see the [Code of Conduct](CODE_OF_CONDUCT.md).

</details>
