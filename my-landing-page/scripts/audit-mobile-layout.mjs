import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DEBUG_ORIGIN = process.env.CDP_ORIGIN || 'http://127.0.0.1:9223';
const APP_URL = 'http://127.0.0.1:5173/';
const OUTPUT_DIR = '.tmp/mobile-audit';
const delay = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

class CdpSession {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.nextId = 1;
    this.pending = new Map();
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  }

  async fullScreenshot(path) {
    const metrics = await this.send('Page.getLayoutMetrics');
    const { width, height } = metrics.cssContentSize;
    const result = await this.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
      clip: { x: 0, y: 0, width, height, scale: 1 }
    });
    await writeFile(path, Buffer.from(result.data, 'base64'));
  }

  async viewportScreenshot(path) {
    const result = await this.send('Page.captureScreenshot', { format: 'png' });
    await writeFile(path, Buffer.from(result.data, 'base64'));
  }
}

const auditExpression = `(() => {
  const ids = ['hero', 'about', 'comparison', 'choose-friend', 'station', 'layers', 'learn', 'support', 'journey', 'faq', 'final-cta'];
  const rect = (element) => {
    if (!element) return null;
    const box = element.getBoundingClientRect();
    return { x: Math.round(box.x), y: Math.round(box.y + scrollY), width: Math.round(box.width), height: Math.round(box.height) };
  };
  const smallTargets = [...document.querySelectorAll('button, a, select, input, textarea')]
    .filter((element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0 && (box.width < 44 || box.height < 44);
    })
    .slice(0, 30)
    .map((element) => ({
      tag: element.tagName,
      className: element.className,
      label: element.getAttribute('aria-label') || element.textContent.trim().slice(0, 45),
      width: Math.round(element.getBoundingClientRect().width),
      height: Math.round(element.getBoundingClientRect().height)
    }));
  const overflowing = [...document.querySelectorAll('body *')]
    .filter((element) => {
      const box = element.getBoundingClientRect();
      return box.right > innerWidth + 1 || box.left < -1;
    })
    .slice(0, 40)
    .map((element) => ({ tag: element.tagName, className: element.className, rect: rect(element) }));
  return {
    viewport: [innerWidth, innerHeight],
    theme: document.documentElement.dataset.theme,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    pageHeight: document.documentElement.scrollHeight,
    sections: Object.fromEntries(ids.map((id) => [id, rect(document.getElementById(id))])),
    heroCanvas: rect(document.querySelector('#scene')),
    heroStage: rect(document.querySelector('.stage')),
    gardenViewport: rect(document.querySelector('.wish-garden-canvas-wrap')),
    gardenWorld: rect(document.querySelector('.wish-garden-meadow')),
    residents: document.querySelectorAll('.garden-resident-anchor').length,
    visibleResidentLabels: [...document.querySelectorAll('.garden-resident-name')].filter((element) => getComputedStyle(element).display !== 'none').length,
    findResident: rect(document.querySelector('.garden-find-resident')),
    navItems: [...document.querySelectorAll('.dock-item')].filter((element) => getComputedStyle(element).display !== 'none').length,
    pets: [...document.querySelectorAll('.pixel-pet')].map((element) => ({ className: element.className, display: getComputedStyle(element).display, rect: rect(element) })),
    smallTargets,
    overflowing
  };
})()`;

async function visitSections(session, screenshotPrefix = null) {
  const ids = ['hero', 'about', 'comparison', 'choose-friend', 'station', 'layers', 'learn', 'support', 'journey', 'faq', 'final-cta'];
  for (const id of ids) {
    await session.evaluate(`document.getElementById('${id}')?.scrollIntoView({ block: 'start' })`);
    await delay(240);
    if (screenshotPrefix && ['hero', 'about', 'comparison', 'choose-friend', 'station', 'learn', 'support', 'faq', 'final-cta'].includes(id)) {
      await session.viewportScreenshot(join(OUTPUT_DIR, `${screenshotPrefix}-${id}.png`));
    }
  }
  await session.evaluate('scrollTo(0, 0)');
  await delay(220);
}

async function audit(session, width, theme, { screenshots = false, reducedMotion = false } = {}) {
  await session.send('Emulation.setDeviceMetricsOverride', {
    width,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true
  });
  await session.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: reducedMotion ? 'reduce' : 'no-preference' }]
  });
  await session.evaluate(`document.documentElement.dataset.theme = '${theme}'`);
  await delay(800);
  const suffix = `${width}-${theme}${reducedMotion ? '-reduced' : ''}`;
  await visitSections(session, screenshots ? suffix : null);
  const result = await session.evaluate(auditExpression);
  if (screenshots) await session.fullScreenshot(join(OUTPUT_DIR, `mobile-audit-${suffix}.png`));
  return result;
}

await mkdir(OUTPUT_DIR, { recursive: true });
const target = await fetch(`${DEBUG_ORIGIN}/json/new?${encodeURIComponent(APP_URL)}`, { method: 'PUT' }).then((response) => response.json());
const session = new CdpSession(target.webSocketDebuggerUrl);
await session.connect();
await Promise.all([session.send('Page.enable'), session.send('Runtime.enable')]);
const fixtureRows = Array.from({ length: 28 }, (_, index) => ({
  id: `qa-wish-${index + 1}`,
  animal_id: index % 3 === 0 ? 'cat-may' : index % 3 === 1 ? 'dog-bo' : 'cat-bong',
  animal_type: index % 3 === 1 ? 'dog' : 'cat',
  message: `Lời chúc QA số ${index + 1}: mong các bé luôn bình an và sớm có một mái nhà yêu thương.`,
  sender_display_name: index % 4 === 0 ? `Người bạn ${index + 1}` : null,
  created_at: new Date(Date.now() - index * 60000).toISOString()
}));
await session.send('Page.addScriptToEvaluateOnNewDocument', {
  source: `(() => {
    const nativeFetch = window.fetch.bind(window);
    const rows = ${JSON.stringify(fixtureRows)};
    window.fetch = (input, init) => {
      const url = typeof input === 'string' ? input : input?.url || '';
      if (url.includes('/rest/v1/wishes') && (!init?.method || init.method === 'GET')) {
        return Promise.resolve(new Response(JSON.stringify(rows), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }
      return nativeFetch(input, init);
    };
  })();`
});
await session.send('Page.navigate', { url: APP_URL });
await delay(1800);

const results = {};
for (const width of [360, 375, 390, 412, 430, 768]) {
  results[`${width}-day`] = await audit(session, width, 'day', { screenshots: width === 360 || width === 390 });
}
results['360-night'] = await audit(session, 360, 'night', { screenshots: true });
results['390-night'] = await audit(session, 390, 'night', { screenshots: true });
results['390-reduced'] = await audit(session, 390, 'day', { reducedMotion: true });
results['1440-desktop'] = await audit(session, 1440, 'day', { screenshots: true });

console.log(JSON.stringify(results, null, 2));
await session.send('Page.close');
session.socket.close();
