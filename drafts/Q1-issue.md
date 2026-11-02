<!-- quarto-dev/quarto-cli — Bug report (DRAFT, not filed) -->
# `code-annotations: none` throws `ReferenceError: selectedAnnoteEl is not defined` on every window resize

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

### Expected behavior

No errors.

### Actual behavior

```
Uncaught ReferenceError: selectedAnnoteEl is not defined
```

logged twice per resize.

### Your environment

- Quarto 1.12.0; the template is unchanged on `main` (3190292c7)
- Chrome for Testing 153 on Linux (Playwright). The error comes from template JavaScript, so it should not depend on the browser.

### Quarto check output

<!-- paste `quarto check` output before filing -->
