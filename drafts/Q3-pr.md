<!-- quarto-dev/quarto-cli — Pull request (DRAFT, not opened). Branch: Pat-Laub:bugfix/revealjs-footer-print, based on the current main (3190292c7).
     Follows the current PR template and CONTRIBUTING "AI-assisted contributions". -->
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

The first commit adds `revealjs-footer-print.spec.ts`, which checks the four
pages of the existing `logo-footer.qmd` fixture in `?print-pdf`. I also checked
a real `page.pdf()` export of the reproduction: each page now carries the
expected footer once, bottom-centred. On my fork's CI, the test-only commit
[fails on exactly the new spec](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545676028) (Chromium, Firefox, WebKit) and
[the fix passes](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545678090). The full parallel smoke suite (as run for PRs), with all four of my revealjs/html fixes merged, passed all 42 jobs ([run](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545835371)).

## Checklist

I have (if applicable):

- [ ] referenced the GitHub issue this PR closes <!-- DRAFT NOTE: tick once #ISSUE is filled in -->
- [x] updated the appropriate changelog in the PR
- [x] ensured the present test suite passes
- [x] added new tests
- [ ] created a separate documentation PR in [Quarto's website repo](https://github.com/quarto-dev/quarto-web/) and linked it to this PR <!-- not needed: the documented footer behaviour now also holds in PDF export -->

<details>
<summary>AI-assisted PR</summary>

- **AI tool used**: Claude Code
- **Codebase grounding**: local clone of `quarto-cli` at `main`; the bug reproduced in Chromium (Playwright) with Quarto 1.11.9 and 1.12.0; Quarto's own Playwright specs run locally and the smoke-test workflow on my fork (links above).
- **Human review**: I have reviewed, tested, and verified the AI-generated content before submitting. <!-- DRAFT NOTE: only true once you have done this yourself; keep or reword accordingly -->

Note: autonomous AI agents submitting PRs without human oversight are not permitted — see the [Code of Conduct](CODE_OF_CONDUCT.md).

</details>
