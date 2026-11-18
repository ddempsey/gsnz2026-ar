// usage: node capture_full.js in.html outDir NV label
// Full viewer canvas (profiles, column, strips, P0 timeline), swept uniformly in TIME.
const { chromium } = require('playwright'); const { pathToFileURL } = require('url'); const fs = require('fs');
(async () => {
  const [html, outDir, NVs, label] = process.argv.slice(2);
  const NV = Number(NVs);
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch({ executablePath: process.env.LOCALAPPDATA + '/ms-playwright/chromium-1193/chrome-win/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 1.5 });
  await p.goto(pathToFileURL(html).toString(), { waitUntil: 'load' });
  const r = await p.evaluate(() => { playing = false; window.requestAnimationFrame = () => 0;
    const q = document.getElementById('cv').getBoundingClientRect(); return { x: q.x, y: q.y }; });
  await p.waitForTimeout(200);
  for (let k = 0; k < NV; k++) {
    await p.evaluate(([k, NV, label]) => {
      const tmax = D.tYr[F - 1], tt = k / (NV - 1) * tmax;
      let best = 0; for (let j = 0; j < F; j++) { if (D.tYr[j] <= tt + 1e-9) best = j; else break; }
      frame = best; tick = k;
      draw();
      // opaque background under everything
      ctx.save(); ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = '#141414'; ctx.fillRect(0, 0, cv.width, cv.height); ctx.restore();
      ctx.fillStyle = '#F2EEE6'; ctx.font = '600 19px Segoe UI, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(`${label}   t = ${Math.round(tt).toLocaleString()} yr`, 14, 22);
    }, [k, NV, label]);
    await p.screenshot({ path: `${outDir}/f${String(k).padStart(5, '0')}.png`, clip: { x: r.x, y: r.y, width: 950, height: 700 } });
  }
  await b.close(); console.log('done', NV);
})();
