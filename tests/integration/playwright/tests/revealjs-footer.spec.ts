import { expect, test } from "@playwright/test";

// The support plugin clones a slide's own `::: footer` up to `.reveal` on both
// `ready` and `slidechanged`, but removed only one clone per slide change. A
// deck opened on a slide with its own footer fires both events for that slide,
// so the second clone outlived it and showed on the next slide.

const perSlideFooters = ".reveal > .footer:not(.footer-default)";

test("opening the deck on a slide with its own footer shows that footer once", async ({ page }) => {
  await page.goto("./revealjs/logo-footer.html#/slide-4");
  await page.waitForFunction(() => (window as any).Reveal?.isReady());
  await expect(page.locator(perSlideFooters)).toHaveCount(1);
  await expect(page.locator(perSlideFooters)).toContainText("A different footer");
});

test("leaving a slide with its own footer removes that footer", async ({ page }) => {
  await page.goto("./revealjs/logo-footer.html#/slide-4");
  await page.waitForFunction(() => (window as any).Reveal?.isReady());
  await page.keyboard.press("ArrowLeft"); // Slide 3, `{footer=false}`
  await expect(page.locator(perSlideFooters)).toHaveCount(0);
  await page.keyboard.press("ArrowLeft"); // Slide 2, the deck's default footer
  await expect(page.locator(perSlideFooters)).toHaveCount(0);
  await expect(page.locator(".reveal > .footer.footer-default")).toContainText("Footer text");
});
