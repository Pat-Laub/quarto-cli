module.exports = async (page, base) => {
  const here = () => page.evaluate(() => Reveal.getCurrentSlide().id);
  await page.goto(base + '/index.html#/b3');
  await page.waitForFunction(() => window.Reveal && Reveal.isReady());
  console.log('opened at', await here());
  // Go back to Section A, e.g. through the slide menu or a link.
  await page.evaluate(() => Reveal.slide(Reveal.getIndices(document.getElementById('a2')).h, 2));
  console.log('jumped to', await here());
  const seen = [];
  for (let i = 0; i < 4; i++) { await page.keyboard.press('ArrowRight'); seen.push(await here()); }
  console.log('then ArrowRight x4 visits', JSON.stringify(seen));
  console.log('navigationMode =', await page.evaluate(() => Reveal.getConfig().navigationMode));
};
