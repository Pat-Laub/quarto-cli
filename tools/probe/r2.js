module.exports = async (page, base) => {
  await page.goto(base + '/index.html#/start');
  await page.waitForFunction(() => window.Reveal && Reveal.isReady());
  await page.getByRole('link', { name: 'Jump to the figure' }).click();
  await page.waitForFunction(() => Reveal.getCurrentSlide().id === 'the-figure');
  const img = page.locator('#the-figure img');
  await img.evaluate(el => el.complete || new Promise(r => el.addEventListener('load', r, { once: true })));
  await page.waitForTimeout(500);
  console.log('after the image loaded:', JSON.stringify(await img.evaluate(el => ({
    cls: el.className, natural: [el.naturalWidth, el.naturalHeight],
    style: el.getAttribute('style'), rendered: [Math.round(el.getBoundingClientRect().width), Math.round(el.getBoundingClientRect().height)] }))));
};
