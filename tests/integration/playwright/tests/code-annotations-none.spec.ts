import { expect, test } from "@playwright/test";

// With `code-annotations: none` the template still installs the resize
// handler that repositions a selected annotation's highlight, but omits the
// `selectedAnnoteEl` declaration it reads, so every resize threw a
// ReferenceError.

const testCases = [
  { format: "html", url: "./html/code-annotations-none.html" },
  { format: "revealjs", url: "./revealjs/code-annotations-none.html" },
];

test.describe("code-annotations: none", () => {
  for (const { format, url } of testCases) {
    test(`${format} — resizing the window raises no error`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(`[${error.name}] ${error.message}`));
      await page.goto(url);
      await expect(page.locator("div.sourceCode")).toBeVisible();
      // Two resizes, so both the immediate and the throttled call run.
      await page.setViewportSize({ width: 900, height: 700 });
      await page.setViewportSize({ width: 1000, height: 760 });
      await page.waitForTimeout(100);
      expect(errors).toStrictEqual([]);
    });
  }
});
