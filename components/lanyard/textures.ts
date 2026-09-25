import * as THREE from "three";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { signatureFont } from "@/lib/fonts";

/** Card size in world units (ID-1 badge proportions, portrait). */
export const CARD_WIDTH = 1.6;
export const CARD_HEIGHT = 2.25;

const W = 768;
const H = Math.round((W * CARD_HEIGHT) / CARD_WIDTH); // 1080
const RADIUS = 44;

const BLUE = "#3B82F6";
const GREEN = "#10B981";

const fonts = {
  sans: GeistSans.style.fontFamily,
  mono: GeistMono.style.fontFamily,
  script: signatureFont.style.fontFamily,
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function blueGreen(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, BLUE);
  g.addColorStop(1, GREEN);
  return g;
}

function setTracking(ctx: CanvasRenderingContext2D, px: number) {
  // `letterSpacing` is not in every browser's canvas implementation yet.
  if ("letterSpacing" in ctx)
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${px}px`;
}

/** Dark glassy card base shared by both faces. Leaves the context clipped to the card shape. */
function drawBase(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, W, H);
  roundRect(ctx, 0, 0, W, H, RADIUS);
  ctx.clip();

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0d1426");
  bg.addColorStop(1, "#08090d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glowA = ctx.createRadialGradient(0, 0, 0, 0, 0, W * 0.95);
  glowA.addColorStop(0, "rgba(59,130,246,0.38)");
  glowA.addColorStop(1, "rgba(59,130,246,0)");
  ctx.fillStyle = glowA;
  ctx.fillRect(0, 0, W, H);

  const glowB = ctx.createRadialGradient(W, H, 0, W, H, W * 0.9);
  glowB.addColorStop(0, "rgba(16,185,129,0.3)");
  glowB.addColorStop(1, "rgba(16,185,129,0)");
  ctx.fillStyle = glowB;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(255,255,255,0.035)";
  ctx.lineWidth = 1;
  for (let x = 48; x < W; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 48; y < H; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Lanyard slot
  roundRect(ctx, W / 2 - 64, 30, 128, 24, 12);
  ctx.fillStyle = "rgba(0,0,0,0.65)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawBorder(ctx: CanvasRenderingContext2D) {
  roundRect(ctx, 3, 3, W - 6, H - 6, RADIUS - 3);
  ctx.strokeStyle = blueGreen(ctx, 0, 0, W, H);
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, kind: "code" | "spark") {
  ctx.beginPath();
  ctx.arc(cx, cy, 44, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = blueGreen(ctx, cx - 44, cy - 44, cx + 44, cy + 44);
  ctx.stroke();

  if (kind === "code") {
    ctx.fillStyle = "#dbeafe";
    ctx.font = `700 30px ${fonts.mono}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("</>", cx, cy + 1);
  } else {
    // Four-point sparkle
    const r = 22;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.quadraticCurveTo(cx, cy, cx + r, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy + r);
    ctx.quadraticCurveTo(cx, cy, cx - r, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy - r);
    ctx.fillStyle = "#a7f3d0";
    ctx.fill();
  }
}

function drawPhoto(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
  const size = 540;
  const x = (W - size) / 2;
  const y = 186;

  ctx.save();
  roundRect(ctx, x, y, size, size, 36);
  ctx.clip();
  // object-fit: cover
  const scale = Math.max(size / img.naturalWidth, size / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.drawImage(img, x + (size - dw) / 2, y + (size - dh) / 2, dw, dh);
  // Blend the photo's bright background into the dark card
  const fade = ctx.createLinearGradient(0, y + size * 0.6, 0, y + size);
  fade.addColorStop(0, "rgba(9,9,11,0)");
  fade.addColorStop(1, "rgba(9,9,11,0.35)");
  ctx.fillStyle = fade;
  ctx.fillRect(x, y, size, size);
  ctx.restore();

  roundRect(ctx, x, y, size, size, 36);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.stroke();
}

function drawFront(ctx: CanvasRenderingContext2D, photo: HTMLImageElement) {
  ctx.save();
  drawBase(ctx);

  drawBadge(ctx, 96, 112, "code");
  drawBadge(ctx, W - 96, 112, "spark");

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 34px ${fonts.mono}`;
  ctx.fillText("BHD.", W / 2, 112);
  ctx.fillStyle = "#a1a1aa";
  ctx.font = `500 16px ${fonts.mono}`;
  setTracking(ctx, 4);
  ctx.fillText("SOFTWARE ENGINEER", W / 2, 144);
  setTracking(ctx, 0);

  drawPhoto(ctx, photo);

  ctx.fillStyle = "#ffffff";
  ctx.font = `600 40px ${fonts.sans}`;
  ctx.fillText("Begüm Handan Demir", W / 2, 800);
  ctx.fillStyle = "#71717a";
  ctx.font = `500 17px ${fonts.mono}`;
  setTracking(ctx, 3);
  ctx.fillText("FULL-STACK · MOBILE · AI", W / 2, 838);
  setTracking(ctx, 0);

  // Signature
  ctx.save();
  ctx.translate(W / 2, 962);
  ctx.rotate(-0.07);
  ctx.font = `700 118px ${fonts.script}`;
  ctx.fillStyle = blueGreen(ctx, -170, 0, 170, 0);
  ctx.shadowColor = "rgba(59,130,246,0.45)";
  ctx.shadowBlur = 24;
  ctx.fillText("Begüm", 0, 0);
  ctx.restore();

  ctx.fillStyle = "#52525b";
  ctx.font = `500 15px ${fonts.mono}`;
  ctx.textAlign = "left";
  ctx.fillText("ID · 2026", 52, H - 40);
  ctx.textAlign = "right";
  ctx.fillText("SAMSUN · TR", W - 52, H - 40);

  drawBorder(ctx);
  ctx.restore();
}

function drawBack(ctx: CanvasRenderingContext2D) {
  ctx.save();
  drawBase(ctx);
  ctx.textBaseline = "middle";
  ctx.font = `700 132px ${fonts.mono}`;
  const logoW = ctx.measureText("BHD").width;
  const startX = W / 2 - (logoW + ctx.measureText(".").width) / 2;
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("BHD", startX, H / 2 - 30);
  ctx.fillStyle = GREEN;
  ctx.fillText(".", startX + logoW, H / 2 - 30);
  ctx.textAlign = "center";
  ctx.fillStyle = "#71717a";
  ctx.font = `500 18px ${fonts.mono}`;
  setTracking(ctx, 4);
  ctx.fillText("FULL-STACK · MOBILE · AI", W / 2, H / 2 + 70);
  setTracking(ctx, 0);
  drawBorder(ctx);
  ctx.restore();
}

function drawBand(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "#0b0d14";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = blueGreen(ctx, 0, 0, w, 0);
  ctx.fillRect(0, 0, w, 5);
  ctx.fillRect(0, h - 5, w, 5);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = `700 26px ${fonts.mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("BHD.", w / 2, h / 2 + 1);
}

function toTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export interface LanyardTextures {
  front: THREE.CanvasTexture;
  back: THREE.CanvasTexture;
  band: THREE.CanvasTexture;
}

/** Loads the photo + fonts, then paints card faces and the band onto canvases. */
export async function createLanyardTextures(photoSrc: string): Promise<LanyardTextures> {
  const photo = new Image();
  photo.src = photoSrc;

  await Promise.all([
    photo.decode(),
    document.fonts.load(`700 118px ${fonts.script}`, "Begüm"),
    document.fonts.load(`700 34px ${fonts.mono}`),
    document.fonts.load(`600 40px ${fonts.sans}`),
  ]);

  const make = (w: number, h: number) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return [c, c.getContext("2d")!] as const;
  };

  const [frontCanvas, frontCtx] = make(W, H);
  drawFront(frontCtx, photo);

  const [backCanvas, backCtx] = make(W, H);
  drawBack(backCtx);

  const [bandCanvas, bandCtx] = make(256, 64);
  drawBand(bandCtx, 256, 64);
  const band = toTexture(bandCanvas);
  band.wrapS = band.wrapT = THREE.RepeatWrapping;

  return { front: toTexture(frontCanvas), back: toTexture(backCanvas), band };
}
