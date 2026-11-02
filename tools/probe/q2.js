module.exports = async (page, base, errors) => {
  const clones = () => page.evaluate(() => [...document.querySelectorAll('.reveal > .footer:not(.footer-default)')].map(e => e.textContent.trim()));
  await page.goto(base + '/index.html#/footed');
  await page.waitForFunction(() => window.Reveal && Reveal.isReady());
  await page.waitForTimeout(200);
  console.log('on #/footed      clones =', JSON.stringify(await clones()));
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(200);
  console.log('on #/plain       clones =', JSON.stringify(await clones()), 'hash', await page.evaluate(() => Reveal.getCurrentSlide().id));
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(200);
  console.log('on #/footed-2    clones =', JSON.stringify(await clones()));
  console.log('errors', JSON.stringify(errors));
};
