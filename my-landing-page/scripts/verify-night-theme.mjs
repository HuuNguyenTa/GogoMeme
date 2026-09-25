// Run against the local Vite server and an isolated Chrome CDP session on port 9224.
// Browser automation never submits wishes or changes remote data.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const base = process.env.THEME_QA_URL || 'http://127.0.0.1:5173/';
const pages = await fetch('http://127.0.0.1:9224/json').then((r) => r.json());
const page = pages.find((p) => p.type === 'page');
assert(page, 'Launch isolated Chrome with --remote-debugging-port=9224 first');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
const pending = new Map();
let sequence = 0;
const errors = [];
ws.onmessage = ({ data }) => {
  const msg = JSON.parse(data);
  if (pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(msg.error.message)); else resolve(msg.result);
  }
  if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
};
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, includeCommandLineAPI: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const until = async (expression) => {
  for (let i = 0; i < 80; i++) { if (await evaluate(expression)) return; await wait(150); }
  throw new Error(`Timed out: ${expression}`);
};
const directory = join(tmpdir(), 'tram-night-screenshots');
await mkdir(directory, { recursive: true });
const capture = async (name) => {
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile(join(directory, `${name}.png`), Buffer.from(data, 'base64'));
};
const goTo = async (selector) => {
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`);
  await wait(1100);
};
const toggle = async () => { await evaluate("document.querySelector('.theme-toggle').click()"); await wait(1000); };
const media = async (dark, reduced = false) => send('Emulation.setEmulatedMedia', { features: [
  { name: 'prefers-color-scheme', value: dark ? 'dark' : 'light' },
  { name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }
] });
const viewport = async (width, height, mobile = false) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
const reload = async () => {
  await send('Page.reload', { ignoreCache: true });
  await until("Boolean(document.querySelector('.theme-toggle'))");
  await wait(1700);
};
const theme = () => evaluate('document.documentElement.dataset.theme');
const overflow = async () => {
  const result = await evaluate('({width:innerWidth,scrollWidth:document.documentElement.scrollWidth})');
  assert(result.scrollWidth <= result.width, `Horizontal overflow: ${JSON.stringify(result)}`);
};
await send('Page.enable'); await send('Runtime.enable'); await send('Performance.enable');
await send('Page.addScriptToEvaluateOnNewDocument', { source: `
  window.__themeQA = {contexts:0, frames:0, draws:0, firstTheme:null};
  const contexts = new WeakSet();
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(...args) {
    const context = original.apply(this,args);
    if (context && /webgl/.test(args[0]) && !contexts.has(context)) {
      contexts.add(context); window.__themeQA.contexts++;
      for (const method of ['drawElements','drawArrays','drawElementsInstanced','drawArraysInstanced']) {
        if (!context[method]) continue;
        const draw = context[method].bind(context);
        context[method] = (...values) => {window.__themeQA.draws++; return draw(...values)};
      }
    }
    return context;
  };
  requestAnimationFrame(() => {window.__themeQA.firstTheme = document.documentElement.dataset.theme});
` });
await viewport(1440, 960);
await media(true);
await send('Page.navigate', { url: base });
await until("Boolean(document.querySelector('.theme-toggle'))");
await evaluate("localStorage.removeItem('tram-yeu-thuong-theme-v1')");
await reload();
assert.equal(await theme(), 'night', 'Fresh system dark preference');
assert.equal(await evaluate('window.__themeQA.firstTheme'), 'night', 'Theme available on first animation frame');
await evaluate("window.scrollTo({top:0,behavior:'instant'})"); await wait(1000);
await capture('night-hero'); await overflow();
const before = await evaluate('({contexts:window.__themeQA.contexts,canvasCount:document.querySelectorAll("#scene,.scenario-3d-canvas,.final-cta-3d-canvas").length,listeners:Object.fromEntries(Object.entries(getEventListeners(window)).map(([k,v])=>[k,v.length]))})');
for (let i = 0; i < 10; i++) { await evaluate("document.querySelector('.theme-toggle').click()"); await wait(45); }
await wait(1100);
assert.equal(await theme(), 'night');
const after = await evaluate('({contexts:window.__themeQA.contexts,canvasCount:document.querySelectorAll("#scene,.scenario-3d-canvas,.final-cta-3d-canvas").length,listeners:Object.fromEntries(Object.entries(getEventListeners(window)).map(([k,v])=>[k,v.length]))})');
assert.deepEqual(after, before, 'Rapid toggles must reuse contexts, canvases and window listeners');
await evaluate("document.querySelector('.theme-toggle').focus()");
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
await wait(1000);
assert.equal(await theme(), 'day', 'Keyboard activation');
assert.equal(await evaluate("document.querySelector('.theme-toggle').getAttribute('aria-pressed')"), 'false');
assert.equal(await evaluate("document.querySelector('.theme-toggle').getAttribute('aria-label')"), 'Chuyển sang chế độ ban đêm');
assert.notEqual(await evaluate("getComputedStyle(document.querySelector('.theme-toggle')).outlineStyle"), 'none', 'Visible keyboard focus');
await capture('day-hero');
await toggle(); await media(false); await reload();
assert.equal(await theme(), 'night', 'Saved user preference wins over system light');
assert.equal(await evaluate('window.__themeQA.firstTheme'), 'night', 'Saved night first paint');
for (const id of ['about','comparison','choose-friend','station','protection-layers','learn','support','journey','faq','final-cta']) {
  await goTo(`#${id}`); await capture(`night-${id}`);
}
await goTo('#station');
const heroFrame = await evaluate("document.querySelector('#scene').toDataURL()");
await toggle(); await toggle();
await goTo('#hero');
assert.equal(await theme(), 'night');
assert.notEqual(await evaluate("document.querySelector('#scene').toDataURL()"), heroFrame, 'Hero renders again after offscreen toggle');

const perfSample = async () => {
  const beforeMetrics = (await send('Performance.getMetrics')).metrics;
  const drawStart = await evaluate('window.__themeQA.draws');
  await wait(2000);
  const endMetrics = (await send('Performance.getMetrics')).metrics;
  const get = (list,name) => list.find((m) => m.name === name)?.value;
  return {taskSeconds:get(endMetrics,'TaskDuration')-get(beforeMetrics,'TaskDuration'),heapBytes:get(endMetrics,'JSHeapUsedSize'),drawCalls:await evaluate('window.__themeQA.draws')-drawStart};
};
const performanceNight = await perfSample(); await toggle(); const performanceDay = await perfSample();
await toggle();
await goTo('#choose-friend'); await evaluate("document.querySelector('.choose-continue-cta').click()"); await wait(1300); await capture('night-write-form');
assert(await evaluate("Boolean(document.querySelector('.wish-compose-card textarea'))"));
await evaluate("document.querySelector('.letter-back-btn').click()");

await viewport(390, 844, true); await reload(); await evaluate("window.scrollTo({top:0,behavior:'instant'})"); await wait(1300);
await overflow(); await capture('night-mobile-hero');
const toggleBox = await evaluate("(()=>{const r=document.querySelector('.theme-toggle').getBoundingClientRect(); return {width:r.width,height:r.height,left:r.left,right:r.right}})()");
assert(toggleBox.width >= 44 && toggleBox.height >= 44 && toggleBox.left >= 0 && toggleBox.right <= 390, 'Mobile toggle target fits viewport');
await goTo('#station'); await capture('night-mobile-garden');
await goTo('#final-cta'); await capture('night-mobile-cta');
await toggle(); await goTo('#hero'); await capture('day-mobile-hero'); await overflow();
await media(true, true); await evaluate("localStorage.removeItem('tram-yeu-thuong-theme-v1')"); await reload(); await goTo('#hero');
assert.equal(await theme(), 'night');
const drawStart = await evaluate('window.__themeQA.draws'); await wait(800);
assert.equal(await evaluate('window.__themeQA.draws'), drawStart, 'Reduced motion hero has no continuous WebGL draws');
await capture('night-reduced-motion');
await goTo('#station');
assert.equal(await evaluate("getComputedStyle(document.querySelector('.garden-fireflies i')).animationName"), 'none');
await goTo('#hero');
const blocked = await send('Page.addScriptToEvaluateOnNewDocument', { source: "Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Disabled','SecurityError')}})" });
await reload(); assert.equal(await theme(), 'night'); await toggle(); assert.equal(await theme(), 'day');
await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: blocked.identifier });
assert.equal(errors.length, 0, errors.join('\n'));
console.log(JSON.stringify({result:'PASS',before,after,toggleBox,performanceDay,performanceNight,errors,screenshots:directory},null,2));
ws.close();
