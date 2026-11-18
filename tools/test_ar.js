const { chromium } = require('playwright');
(async () => {
  const [url, cam, out] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: process.env.LOCALAPPDATA + '/ms-playwright/chromium-1193/chrome-win/chrome.exe',
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-video-capture=' + cam,
           '--autoplay-policy=no-user-gesture-required', '--use-gl=angle', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: 960, height: 720 }, permissions: ['camera'] });
  const p = await ctx.newPage();
  p.on('console', m => console.log('[page]', m.type(), m.text().slice(0, 200)));
  p.on('pageerror', e => console.log('[pageerror]', e.message));
  await p.goto(url, { waitUntil: 'load' });
  await p.evaluate(() => { const t = document.getElementById('tgt');
    window.FOUND = 0; t.addEventListener('targetFound', () => { window.FOUND++; }); });
  await p.click('#go');
  for (let i = 0; i < 30; i++) { await p.waitForTimeout(1000); if (await p.evaluate(() => window.FOUND)) break; }
  console.log('targetFound events:', await p.evaluate(() => window.FOUND));
  await p.waitForTimeout(2500);
  console.log('video playing:', await p.evaluate(() => !document.getElementById('vid').paused), 't=', await p.evaluate(() => document.getElementById('vid').currentTime));
  console.log(await p.evaluate(() => [...document.querySelectorAll('video')].map(v => [v.id, v.style.cssText, v.parentElement.tagName, v.videoWidth, v.readyState, getComputedStyle(v).zIndex, getComputedStyle(v).display].join(' | ')).join(' ## ')));
  await p.screenshot({ path: out });
  await b.close();
})();
