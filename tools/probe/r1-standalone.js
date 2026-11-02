module.exports = async (page, base) => {
  await page.goto(base + '/r1/index.html#/1'); await page.waitForFunction(() => window.Reveal && Reveal.isReady());
  await page.getByRole('link', { name: 'B.3' }).click(); await page.waitForFunction(() => Reveal.getIndices().v === 2);
  await page.getByRole('link', { name: 'Back to A' }).click(); await page.waitForFunction(() => Reveal.getIndices().h === 1);
  await page.keyboard.press('ArrowRight');
  console.log('after B.3 → A → ArrowRight:', JSON.stringify(await page.evaluate(() => Reveal.getIndices())), '(B.1 is {"h":2,"v":0})');
};
