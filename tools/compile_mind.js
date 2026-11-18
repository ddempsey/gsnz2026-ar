// usage: node compile_mind.js target.png out.mind
// Runs MindAR's own image-target compiler in headless Chromium.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const [img, out] = process.argv.slice(2);
  const b64 = fs.readFileSync(img).toString('base64');
  const b = await chromium.launch({ executablePath: process.env.LOCALAPPDATA + '/ms-playwright/chromium-1193/chrome-win/chrome.exe',
    args: ['--use-gl=angle', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage();
  p.on('console', m => console.log('[page]', m.text()));
  await p.setContent(`<html><body><script type="module">
    import 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image.prod.js';
    window.READY = !!(window.MINDAR && window.MINDAR.IMAGE && window.MINDAR.IMAGE.Compiler);
  </script></body></html>`);
  await p.waitForFunction(() => window.READY !== undefined, null, { timeout: 60000 });
  console.log('compiler available:', await p.evaluate(() => window.READY));
  const data = await p.evaluate(async (b64) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
    const c = new window.MINDAR.IMAGE.Compiler();
    let last = -10;
    await c.compileImageTargets([im], (pr) => { if (pr - last >= 10) { console.log('progress ' + pr.toFixed(0)); last = pr; } });
    const buf = await c.exportData();
    return Array.from(new Uint8Array(buf));
  }, b64);
  fs.writeFileSync(out, Buffer.from(data));
  console.log('wrote', out, data.length, 'bytes');
  await b.close();
})();
