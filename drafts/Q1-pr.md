<!-- quarto-dev/quarto-cli — Pull request (DRAFT, not opened). Branch: Pat-Laub:bugfix/code-annotations-none-resize, based on the current main (3190292c7).
     Follows the current PR template and CONTRIBUTING "AI-assisted contributions". -->
# Declare `selectedAnnoteEl` for `code-annotations: none`

## Description

Fixes #ISSUE.

With `code-annotations: none`, the after-body template still installs the resize
handler that repositions a selected annotation's highlight, but the
`let selectedAnnoteEl;` it reads was declared only inside the
`codeAnnotations !== "none"` branch. Every resize therefore threw
`ReferenceError: selectedAnnoteEl is not defined`, in HTML and revealjs output.

This hoists the declaration to the enclosing `if (codeAnnotations)` branch, so the
handler sees `undefined` and does nothing. Output for every other
`code-annotations` value is unchanged.

The first commit adds a Playwright test (`code-annotations-none.spec.ts`, html and
revealjs cases) that resizes the viewport and fails on any page error; the second
commit is the fix. On my fork's CI, the test-only commit
[fails on exactly the new spec](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545660850) (2 tests × Chromium, Firefox,
WebKit) and [the fix passes](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545664826). The full parallel smoke suite (as run for PRs), with all four of my revealjs/html fixes merged, passed all 42 jobs ([run](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545835371)).

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
