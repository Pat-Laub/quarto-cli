// Usage: node probe.js <dir-to-serve> <script-name>
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = process.argv[2];
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2' };
// Serve files; DELAY_IMG_MS slows images so lazy-load races are reproducible.
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0].split('#')[0]));
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); return res.end(); }
    const send = () => { res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' }); res.end(data); };
    if (/\.(png|svg|jpg)$/.test(p) && process.env.DELAY_IMG_MS) setTimeout(send, +process.env.DELAY_IMG_MS); else send();
  });
}).listen(0, '127.0.0.1', async () => {
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  try {
    await require(path.resolve(process.argv[3]))(page, base, errors);
  } finally { await browser.close(); server.close(); }
});
