import peekingCat from '../../assets/decor/peeking-cat.png';
import peekingDog from '../../assets/decor/peeking-dog.png';

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1350;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Không thể tải ảnh: ${src}`));
    image.src = src;
  });
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawFlower(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#fffdf7';
  for (let i = 0; i < 5; i += 1) {
    ctx.save();
    ctx.rotate((Math.PI * 2 * i) / 5);
    ctx.beginPath();
    ctx.ellipse(0, -14 * scale, 8 * scale, 15 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = '#f4b942';
  ctx.beginPath();
  ctx.arc(0, 0, 7 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawLeaf(ctx, x, y, rotation, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = '#75a86b';
  ctx.beginPath();
  ctx.ellipse(0, 0, 10 * scale, 25 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#4d7a50';
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(0, -20 * scale);
  ctx.lineTo(0, 20 * scale);
  ctx.stroke();
  ctx.restore();
}

function drawPaw(ctx, x, y, scale = 1, color = '#ef8b70') {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 10 * scale, 15 * scale, 13 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  [[-14, -6], [-5, -13], [5, -13], [14, -6]].forEach(([px, py]) => {
    ctx.beginPath();
    ctx.ellipse(px * scale, py * scale, 5 * scale, 7 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawTape(ctx, x, y, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = '#f8c9a8';
  ctx.strokeStyle = 'rgba(190, 126, 87, 0.18)';
  ctx.lineWidth = 2;
  ctx.fillRect(-52, -12, 104, 24);
  ctx.strokeRect(-52, -12, 104, 24);
  ctx.restore();
}

function drawCoverImage(ctx, image, frame, position, zoom) {
  const baseScale = Math.max(frame.width / image.naturalWidth, frame.height / image.naturalHeight);
  const scale = baseScale * zoom;
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  const x = frame.x - Math.max(0, width - frame.width) * (position.x / 100);
  const y = frame.y - Math.max(0, height - frame.height) * (position.y / 100);

  ctx.save();
  roundedRect(ctx, frame.x, frame.y, frame.width, frame.height, 34);
  ctx.clip();
  ctx.drawImage(image, x, y, width, height);
  ctx.restore();
}

function drawCenteredLines(ctx, lines, y, lineHeight) {
  lines.forEach((line, index) => ctx.fillText(line, CARD_WIDTH / 2, y + index * lineHeight));
}

export async function exportKeepsakeCard({ photoUrl, displayName, photoPosition, zoom }) {
  const [logo, photo, cat, dog] = await Promise.all([
    loadImage('/images/brand/gogomeme-logo.png'),
    loadImage(photoUrl),
    loadImage(peekingCat),
    loadImage(peekingDog)
  ]);

  await document.fonts?.ready;

  const canvas = document.createElement('canvas');
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fff9e9';
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  ctx.fillStyle = '#dff0df';
  ctx.beginPath();
  ctx.arc(96, 140, 124, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e8f5fb';
  ctx.beginPath();
  ctx.arc(1020, 210, 160, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 7; i += 1) drawLeaf(ctx, 55 + i * 30, 75 + (i % 2) * 28, -0.7 + i * 0.18, 0.9);
  drawFlower(ctx, 82, 186, 1.2);
  drawFlower(ctx, 996, 260, 1);
  drawPaw(ctx, 954, 110, 1.1, '#f4aa5f');

  const logoWidth = 300;
  const logoHeight = (logo.naturalHeight / logo.naturalWidth) * logoWidth;
  ctx.drawImage(logo, (CARD_WIDTH - logoWidth) / 2, 34, logoWidth, logoHeight);

  ctx.save();
  ctx.translate(CARD_WIDTH / 2, 253);
  ctx.rotate(-0.012);
  ctx.fillStyle = '#fff0a8';
  ctx.beginPath();
  ctx.moveTo(-320, -32);
  ctx.bezierCurveTo(-210, -44, -86, -37, 0, -35);
  ctx.bezierCurveTo(118, -43, 232, -38, 320, -25);
  ctx.bezierCurveTo(306, 15, 198, 37, 4, 32);
  ctx.bezierCurveTo(-178, 41, -296, 22, -320, -32);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#235f47';
  ctx.font = '800 34px "Baloo 2", Nunito, sans-serif';
  ctx.fillText('Một khoảnh khắc cùng GogoMeme', CARD_WIDTH / 2, 263);
  ctx.fillStyle = '#e7775f';
  ctx.font = '700 25px Nunito, sans-serif';
  ctx.fillText('✿', 255, 262);
  ctx.fillText('♡', 826, 262);

  const photoFrame = { x: 124, y: 320, width: 832, height: 620 };
  ctx.save();
  ctx.shadowColor = 'rgba(77, 84, 52, 0.16)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 14;
  ctx.fillStyle = '#fffdf7';
  roundedRect(ctx, photoFrame.x - 18, photoFrame.y - 18, photoFrame.width + 36, photoFrame.height + 36, 46);
  ctx.fill();
  ctx.restore();
  drawCoverImage(ctx, photo, photoFrame, photoPosition, zoom);

  ctx.save();
  ctx.setLineDash([]);
  ctx.strokeStyle = '#ef8b70';
  ctx.lineWidth = 4;
  roundedRect(ctx, photoFrame.x - 9, photoFrame.y - 9, photoFrame.width + 18, photoFrame.height + 18, 40);
  ctx.stroke();
  ctx.restore();

  drawTape(ctx, photoFrame.x + 96, photoFrame.y - 16, -0.12);
  drawTape(ctx, photoFrame.x + photoFrame.width - 96, photoFrame.y - 16, 0.12);

  ctx.drawImage(cat, 46, 736, 190, 190);
  ctx.drawImage(dog, 844, 730, 190, 190);
  drawFlower(ctx, 145, 950, 0.9);
  drawFlower(ctx, 932, 946, 0.85);
  drawLeaf(ctx, 176, 966, 1, 0.75);
  drawLeaf(ctx, 902, 965, -1, 0.75);

  let messageStart = 1018;
  let emotionTop = 1110;
  if (displayName.trim()) {
    ctx.fillStyle = '#205a43';
    let nameFontSize = 42;
    do {
      ctx.font = `800 ${nameFontSize}px "Baloo 2", Nunito, sans-serif`;
      nameFontSize -= 1;
    } while (ctx.measureText(displayName.trim()).width > 900 && nameFontSize >= 18);
    ctx.fillText(displayName.trim(), CARD_WIDTH / 2, 1008);
    messageStart = 1074;
    emotionTop = 1160;
  }

  ctx.fillStyle = '#5f493c';
  ctx.font = '600 24px Nunito, sans-serif';
  drawCenteredLines(ctx, [
    'Cảm ơn bạn đã ghé thăm GogoMeme, gửi một lời chúc',
    'và đồng hành cùng những người bạn bốn chân.'
  ], messageStart, 34);

  ctx.save();
  ctx.translate(CARD_WIDTH / 2, emotionTop + 50);
  ctx.rotate(0.01);
  ctx.fillStyle = '#fde1d8';
  ctx.beginPath();
  ctx.moveTo(-330, -42);
  ctx.bezierCurveTo(-205, -55, -83, -45, 22, -47);
  ctx.bezierCurveTo(170, -52, 289, -39, 330, -20);
  ctx.bezierCurveTo(304, 34, 146, 49, -12, 45);
  ctx.bezierCurveTo(-174, 53, -303, 35, -330, -42);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#a04f3d';
  ctx.font = '800 25px "Baloo 2", Nunito, sans-serif';
  drawCenteredLines(ctx, [
    'Mỗi hành động nhỏ đều có thể lan tỏa',
    'thêm một chút yêu thương.'
  ], emotionTop + 41, 30);

  drawPaw(ctx, 116, 1280, 0.75, '#f4aa5f');
  drawPaw(ctx, 964, 1280, 0.75, '#f4aa5f');
  ctx.fillStyle = '#e99172';
  ctx.font = '700 23px Nunito, sans-serif';
  ctx.fillText('♡     ✦     ♡', CARD_WIDTH / 2, 1310);

  const link = document.createElement('a');
  link.download = 'gogomeme-loi-cam-on.png';
  link.href = canvas.toDataURL('image/png', 1);
  link.click();
}
