// hakimel/reveal.js#3831 end to end: A → B → C → X → Y, then back to C. The speaker
// view's Upcoming pane should show X (the slide → goes to), not Y.
module.exports = async (page, base) => {
  for (const v of ['master', 'fix']) {
    await page.goto(base + '/deck-' + v + '.html'); await page.waitForFunction(() => window.Reveal && Reveal.isReady());
    const [popup] = await Promise.all([page.waitForEvent('popup'), page.keyboard.press('s')]);
    await popup.waitForLoadState();
    const upcoming = popup.frameLocator('#upcoming-slide iframe');
    await popup.waitForFunction(() => { const f = document.querySelector('#upcoming-slide iframe'); return f && f.contentWindow.Reveal && f.contentWindow.Reveal.isReady(); }, null, { timeout: 15000 });
    const step = async (fn) => { await page.evaluate(fn); await page.waitForTimeout(300); };
    for (let i = 0; i < 4; i++) await step(() => Reveal.next());      // A → B → C → X → Y
    await step(() => Reveal.prev()); await step(() => Reveal.prev()); // Y → X → C
    const presenter = await page.evaluate(() => Reveal.getCurrentSlide().id);
    const preview = await popup.evaluate(() => document.querySelector('#upcoming-slide iframe').contentWindow.Reveal.getCurrentSlide().id);
    await page.evaluate(() => Reveal.next());
    const actualNext = await page.evaluate(() => Reveal.getCurrentSlide().id);
    console.log(`${v.padEnd(6)}: presenter on ${presenter}; Upcoming pane shows ${preview}; pressing next actually goes to ${actualNext}`);
    await popup.close();
  }
};
