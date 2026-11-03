<!-- quarto-dev/quarto-cli — Pull request (DRAFT, not opened). Branch: Pat-Laub:bugfix/code-annotations-none-resize -->
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
revealjs cases) that resizes the viewport and fails on any page error. It fails
on `main` and passes with the second commit. The other code-annotation Playwright
specs still pass.

CI on my fork, with Quarto's `test-smokes.yml`: the test-only commit [fails on exactly the new spec](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545660850) (2 tests × Chromium, Firefox, WebKit) and [the fix passes](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545664826). The full parallel smoke suite with all four of my revealjs/html fixes merged passed 41 of 42 jobs, with the 42nd cancelled ([run](https://github.com/Pat-Laub/quarto-cli/actions/runs/41545835371)).

## Checklist

I have (if applicable):

- [ ] filed a [contributor agreement](https://github.com/quarto-dev/quarto-cli/blob/main/CONTRIBUTING.md). <!-- small fix: probably not required -->
- [ ] referenced the GitHub issue this PR closes <!-- fill in #ISSUE once filed -->
- [x] updated the appropriate changelog
