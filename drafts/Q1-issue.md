<!-- quarto-dev/quarto-cli — Bug report form (DRAFT, not filed). Sections follow the current form.
     Before filing: check every statement yourself (the Code of Conduct rules out posting unverified AI output),
     run `quarto check` on your machine, and tick the boxes only if they are true for you. -->
# `code-annotations: none` throws `ReferenceError: selectedAnnoteEl is not defined` on every window resize

### I have:

- [ ] searched the issue tracker for similar issues <!-- DRAFT NOTE: I searched "selectedAnnoteEl", "code-annotations none error"; no match -->
- [ ] installed the latest version of [Quarto CLI](https://github.com/quarto-dev/quarto-cli/releases/latest) <!-- DRAFT NOTE: reproduced on 1.11.9 and 1.12.0 -->
- [ ] formatted my issue following the [Bug Reports guide](https://quarto.org/bug-reports.html)

### Bug description

With `code-annotations: none`, every window resize throws
`ReferenceError: selectedAnnoteEl is not defined`, in HTML pages and in revealjs
presentations (two errors per resize, from the immediate and the throttled call).
In revealjs this happens for every viewport change, including the resizes that
PDF tools such as decktape make.

The cause is in `src/resources/formats/html/templates/quarto-html-after-body.ejs`.
The resize handler that repositions a selected annotation's highlight is emitted
for any truthy `codeAnnotations`, `none` included, but `let selectedAnnoteEl;`
is declared only inside the `codeAnnotations !== "none"` branch.

### Steps to reproduce

````qmd
---
title: "code-annotations: none"
format: revealjs   # `format: html` shows the same error
code-annotations: none
---

## A slide

```python
x = 1  # <1>
```
1. An annotation that `none` hides.
````

1. Render it and open the output in a browser with the developer console open.
2. Resize the window.

### Actual behavior

```
Uncaught ReferenceError: selectedAnnoteEl is not defined
```

logged twice per resize.

### Expected behavior

No errors.

### Your environment

- Quarto 1.11.9 (latest release) and 1.12.0 (latest pre-release); the relevant code is unchanged on `main` (3190292c7)
- Chrome for Testing 153 on Linux (Playwright). The error comes from template JavaScript, so it should not depend on the browser.

### Quarto check output

<!-- paste `quarto check` output before filing -->
