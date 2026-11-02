module.exports = async (page, base) => {
  await page.goto(base + '/r2/index.html#/0'); await page.waitForFunction(() => window.Reveal && Reveal.isReady());
  await page.getByRole('link', { name: 'Jump to slide 5' }).click();
  await page.waitForFunction(() => Reveal.getIndices().h === 4);
  await page.locator('img').evaluate(el => el.complete && el.naturalWidth ? 0 : new Promise(r => el.addEventListener('load', r, { once: true })));
  await page.waitForTimeout(300);
  console.log('img style =', await page.locator('img').getAttribute('style'));
};
