module.exports = async (page, base) => {
  const height = () => page.locator('#the-figure img').evaluate(el => el.getBoundingClientRect().height);
  const settle = () => page.locator('#the-figure img').evaluate(el => el.complete && el.src ? 0 : new Promise(r => el.addEventListener('load', r, { once: true }))).then(() => page.waitForTimeout(400));
  // 1. Reveal.slide(), which the menu and overview use
  await page.goto(base + '/index.html#/start'); await page.waitForFunction(() => window.Reveal && Reveal.isReady());
  await page.evaluate(() => Reveal.slide(Reveal.getIndices(document.getElementById('the-figure')).h));
  await settle(); console.log('Reveal.slide():', await height());
  // 2. Jump to slide: g, type the number, Enter
  await page.goto(base + '/index.html?x=2#/start'); await page.waitForFunction(() => window.Reveal && Reveal.isReady());
  const n = await page.evaluate(() => Reveal.getIndices(document.getElementById('the-figure')).h + 1);
  await page.keyboard.press('g'); await page.keyboard.type(String(n)); await page.keyboard.press('Enter');
  await page.waitForFunction(() => Reveal.getCurrentSlide().id === 'the-figure');
  await settle(); console.log('jump to slide (g):', await height());
  // 3. Deep link on first load
  await page.goto(base + '/index.html?x=3#/the-figure'); await page.waitForFunction(() => window.Reveal && Reveal.isReady());
  await settle(); console.log('deep link on load:', await height());
};
