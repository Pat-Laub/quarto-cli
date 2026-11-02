module.exports = async (page, base, errors) => {
  await page.goto(base + '/index.html');
  await page.waitForFunction(() => window.Reveal && Reveal.isReady());
  await page.setViewportSize({ width: 1000, height: 700 });
  await page.waitForTimeout(300);
  await page.setViewportSize({ width: 1100, height: 750 });
  await page.waitForTimeout(300);
  console.log('page errors after two resizes:', JSON.stringify(errors));
};
