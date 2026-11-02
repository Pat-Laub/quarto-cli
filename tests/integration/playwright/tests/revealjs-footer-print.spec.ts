import { expect, test } from "@playwright/test";

// In print view the support plugin skipped footers entirely, so the deck's
// default footer, which is `position: fixed`, was printed on every page:
// over slides with their own footer, and on `{footer=false}` slides too.
// Each printed page should carry the footer its slide shows in the
// presentation.

test("print view gives each page the footer of its slide", async ({ page }) => {
  await page.goto("./revealjs/logo-footer.html?print-pdf");
  const pages = page.locator(".reveal .pdf-page");
  await expect(pages).toHaveCount(4);

  await expect(pages.nth(0).locator(":scope > .footer")).toHaveText("Footer text");
  await expect(pages.nth(1).locator(":scope > .footer")).toHaveText("Footer text");
  // Slide 3 is `{footer=false}`
  await expect(pages.nth(2).locator(":scope > .footer")).toHaveCount(0);
  // Slide 4 has its own footer, which replaces the default one
  await expect(pages.nth(3).locator(":scope > .footer")).toHaveText("A different footer");

  for (let i = 0; i < 4; i++) {
    const footer = pages.nth(i).locator(":scope > .footer");
    if (await footer.count() > 0) {
      await expect(footer).toBeVisible();
      // Positioned within its page, so it prints once, on that page
      await expect(footer).toHaveCSS("position", "absolute");
    }
  }

  // The deck-wide copy would otherwise be repeated on every printed page
  await expect(page.locator(".reveal > .footer-default")).toBeHidden();
});
