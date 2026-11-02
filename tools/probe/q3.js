const { execFileSync } = require('child_process');
module.exports = async (page, base) => {
  await page.goto(base + '/index.html?print-pdf');
  await page.waitForFunction(() => document.querySelectorAll('.pdf-page').length > 0);
  await page.waitForTimeout(500);
  const out = process.env.PDF_OUT || '/tmp/q3.pdf';
  await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
  const pages = execFileSync('pdfinfo', [out]).toString().match(/Pages:\s+(\d+)/)[1];
  for (let i = 1; i <= +pages; i++) {
    const text = execFileSync('pdftotext', ['-f', String(i), '-l', String(i), '-layout', out, '-']).toString();
    const lines = text.split('\n').map(s => s.trim()).filter(Boolean);
    console.log(`page ${i}: ${JSON.stringify(lines)}`);
  }
};
