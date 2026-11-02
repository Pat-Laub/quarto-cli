import { expect, test } from "@playwright/test";

// A lone image is stretched (`.r-stretch`), and Pandoc gives slide images a
// lazy `data-src`. reveal.js 5.1.0 lays a slide out as soon as it swaps that
// in, before the image has loaded, which leaves the image at `height: 0px`,
// and nothing laid it out again once the image loaded.

test("a stretched image on a slide reached by a link is shown once it loads", async ({ page }) => {
  await page.goto("./revealjs/stretch-image-lazy-load.html#/start");
  await page.waitForFunction(() => (window as any).Reveal?.isReady());
  // reveal.js also lays the slides out on the window's `load` event, which
  // waits for any image that has started loading by then. Follow the link
  // after the page has loaded, as a reader would, so that only a layout run
  // when the image itself loads can size it. (The fixture leaves out the math
  // plugin for the same reason: it lays the slides out again once MathJax loads.)
  await page.waitForFunction(() => document.readyState === "complete");
  const image = page.locator("#the-figure img");
  // Out of reveal's view distance, so not loaded yet
  await expect(image).not.toHaveAttribute("src", /.+/);

  await page.getByRole("link", { name: "Go to the figure" }).click();
  await expect(page.locator("#the-figure")).toHaveClass(/present/);
  await expect(image).toHaveClass(/r-stretch/);
  await expect
    .poll(() => image.evaluate((el) => el.getBoundingClientRect().height))
    .toBeGreaterThan(50);
});
