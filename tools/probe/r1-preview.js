// What the speaker view's Upcoming preview does (#3831): it has visited Y, then
// receives the presenter's state (back on C) and calls next().
module.exports = async (page, base) => {
  await page.goto(base + '/r1p/index.html'); await page.waitForFunction(() => window.Reveal && Reveal.isReady());
  const r = await page.evaluate(() => {
    Reveal.slide(1, 1);                       // preview had moved on to Y
    Reveal.setState({ indexh: 0, indexv: 2 }); // presenter is back on C
    Reveal.next();                             // speaker view asks for "upcoming"
    const { h, v } = Reveal.getIndices(); return { h, v };
  });
  console.log('upcoming preview shows', JSON.stringify(r), '(X is {"h":1,"v":0}, Y is {"h":1,"v":1})');
};
