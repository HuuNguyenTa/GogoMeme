import { writeFile } from 'node:fs/promises';

const DEBUG_ORIGIN = 'http://127.0.0.1:9223';
const APP_URL = 'http://127.0.0.1:5173/';

const delay = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

class CdpSession {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });

    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      const isRuntimeException = message.method === 'Runtime.exceptionThrown';
      const logEntry = message.method === 'Log.entryAdded' ? message.params?.entry : null;
      const isPetLog = logEntry?.url?.includes('/components/pixel-pets/');
      if ((isRuntimeException || isPetLog) && this.events.length < 50) {
        this.events.push(message);
      }
    });
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
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

  async screenshot(path) {
    const result = await this.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    await writeFile(path, Buffer.from(result.data, 'base64'));
  }

  close() {
    this.socket.close();
  }
}

async function setViewport(session, width, height, mobile = false) {
  await session.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile
  });
}

async function setMedia(session, colorScheme, reducedMotion = false) {
  await session.send('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [
      { name: 'prefers-color-scheme', value: colorScheme },
      { name: 'prefers-reduced-motion', value: reducedMotion ? 'reduce' : 'no-preference' }
    ]
  });
}

const inspectExpression = `(() => {
  const overlay = document.querySelector('.pixel-pets-overlay');
  const dog = document.querySelector('.pixel-pet--dog');
  const cat = document.querySelector('.pixel-pet--cat');
  const describe = (element) => {
    if (!element) return null;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      display: style.display,
      opacity: style.opacity,
      pointerEvents: style.pointerEvents,
      state: element.dataset.state,
      moving: element.dataset.moving,
      visible: element.dataset.visible,
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      animationName: getComputedStyle(element.querySelector('.pixel-pet__strip')).animationName
    };
  };
  return {
    theme: document.documentElement.dataset.theme,
    petCount: document.querySelectorAll('.pixel-pet').length,
    ariaHidden: overlay?.getAttribute('aria-hidden'),
    overlayPointerEvents: overlay ? getComputedStyle(overlay).pointerEvents : null,
    viewport: [innerWidth, innerHeight],
    horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    visiblePetCount: [dog, cat].filter((element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      return style.display !== 'none' && Number.parseFloat(style.opacity) > 0;
    }).length,
    scrollY: Math.round(scrollY),
    dog: describe(dog),
    cat: describe(cat)
  };
})()`;

async function main() {
  const target = await fetch(`${DEBUG_ORIGIN}/json/new?${encodeURIComponent(APP_URL)}`, { method: 'PUT' }).then((response) => response.json());
  const session = new CdpSession(target.webSocketDebuggerUrl);
  await session.connect();
  await Promise.all([
    session.send('Page.enable'),
    session.send('Runtime.enable'),
    session.send('Log.enable')
  ]);

  await session.evaluate(`(() => { try { localStorage.removeItem('tram-yeu-thuong-theme-v1'); } catch {} })()`);
  await setViewport(session, 1440, 1000);
  await setMedia(session, 'light');
  await session.send('Page.navigate', { url: APP_URL });
  await delay(6000);
  const desktopDay = await session.evaluate(inspectExpression);
  await session.screenshot('pixel-pets-desktop-day.png');

  await session.evaluate(`(() => {
    window.__pixelPetDog = document.querySelector('.pixel-pet--dog');
    window.__pixelPetCat = document.querySelector('.pixel-pet--cat');
    document.querySelector('.theme-toggle')?.click();
  })()`);
  await delay(800);
  const nightToggle = await session.evaluate(`({
    theme: document.documentElement.dataset.theme,
    sameDog: window.__pixelPetDog === document.querySelector('.pixel-pet--dog'),
    sameCat: window.__pixelPetCat === document.querySelector('.pixel-pet--cat')
  })`);

  await session.evaluate(`(() => {
    const faq = document.querySelector('#faq');
    document.documentElement.style.scrollBehavior = 'auto';
    if (faq) window.scrollTo(0, faq.getBoundingClientRect().bottom + scrollY - innerHeight);
  })()`);
  await delay(3000);
  await session.evaluate(`(() => {
    const faq = document.querySelector('#faq');
    if (faq) window.scrollTo(0, faq.getBoundingClientRect().bottom + scrollY - innerHeight);
  })()`);
  await delay(700);
  const desktopNightFaq = await session.evaluate(inspectExpression);
  await session.screenshot('pixel-pets-desktop-night-faq.png');

  await session.evaluate('window.scrollTo(0, 0)');
  await delay(3000);
  const desktopReturn = await session.evaluate(inspectExpression);
  await session.screenshot('pixel-pets-desktop-return.png');

  await setViewport(session, 800, 900);
  await delay(2800);
  const tablet = await session.evaluate(inspectExpression);

  await setViewport(session, 390, 844, true);
  await session.evaluate(`(() => {
    const faq = document.querySelector('#faq');
    document.documentElement.style.scrollBehavior = 'auto';
    if (faq) window.scrollTo(0, faq.getBoundingClientRect().bottom + scrollY - innerHeight);
  })()`);
  await delay(3200);
  const mobile = await session.evaluate(inspectExpression);
  await session.screenshot('pixel-pets-mobile.png');

  await setMedia(session, 'light', true);
  await delay(1200);
  const reducedMotion = await session.evaluate(inspectExpression);

  const relevantEvents = session.events
    .filter((event) => ['Runtime.exceptionThrown', 'Log.entryAdded'].includes(event.method))
    .map((event) => ({ method: event.method, params: event.params }));

  console.log(JSON.stringify({
    desktopDay,
    nightToggle,
    desktopNightFaq,
    desktopReturn,
    tablet,
    mobile,
    reducedMotion,
    relevantEvents
  }, null, 2));

  await session.send('Page.close');
  session.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
