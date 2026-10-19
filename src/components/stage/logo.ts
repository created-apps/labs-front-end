// Prepares the existing CreatED logo (public/images/created-logo.png, 1945 × 586) for the hero's
// opening. The artwork is not redrawn; it's split into two layers:
//   ink       every stroke outside the bulb, recoloured light for the dark scene (as in the header)
//   interior  the bulb's Sunglow fill and its filament, with their original colours, so the scene can
//             fill the bulb from the bottom
// Then it adds the header lockup beside it: a thin Sunglow rule and "LABS" in Be Vietnam Pro Light,
// at the header's proportions (logo 28px tall, LABS 12px with 0.26em tracking, 12px gaps).

export type LogoArt = {
  ink: HTMLCanvasElement;
  interior: HTMLCanvasElement;
  width: number; // full lockup, in logo pixels
  height: number;
};

/** Points in the logo's own pixel space that the animation follows. */
export const LOGO = {
  w: 1945,
  h: 586,
  tube: { x0: 1387, x1: 1546, y0: 224.5, y1: 231.5 }, // the gap between the E's double middle bar
  arrow: { x0: 1558, x1: 1578, yTop: 218, yBot: 240 }, // inside the outlined ▷ that points into the bulb
  bulb: { top: 86, bottom: 376 }, // the Sunglow interior of the D
  tip: { x: 1671, y: 550 }, // bottom of the bulb's screw base, where the pour leaves
  drop: { x: 1404, y: 228 }, // where the pipette's drop lands in the tube
} as const;

const INK = [242, 253, 255]; // --azure
const HEADER_SCALE = 586 / 28; // header logo is 28px tall

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = src;
  });

export async function buildLogo(src: string): Promise<LogoArt> {
  const img = await loadImage(src);
  const { w, h } = LOGO;

  // the header lockup, scaled up from CSS pixels
  const gap = 12 * HEADER_SCALE;
  const rule = Math.max(1, Math.round(1 * HEADER_SCALE));
  const fontPx = 12 * HEADER_SCALE;
  const track = 0.26 * fontPx;
  const family = getComputedStyle(document.body).fontFamily;
  const font = `300 ${fontPx}px ${family}`;
  try {
    await document.fonts.load(font, "LABS");
  } catch {}
  const measure = document.createElement("canvas").getContext("2d")!;
  measure.font = font;
  const letters = "LABS".split("");
  const textW = letters.reduce((s, c) => s + measure.measureText(c).width, 0) + track * (letters.length - 1);
  const ruleX = w + gap;
  const textX = ruleX + rule + gap;
  const width = Math.ceil(textX + textW + 8);

  const ink = document.createElement("canvas");
  const interior = document.createElement("canvas");
  ink.width = interior.width = width;
  ink.height = interior.height = h;
  const gi = ink.getContext("2d", { willReadFrequently: true })!;
  const gx = interior.getContext("2d")!;
  gi.drawImage(img, 0, 0);
  const data = gi.getImageData(0, 0, w, h);
  const px = data.data;
  const inside = new ImageData(w, h);

  // the bulb interior, row by row: everything between the leftmost and rightmost Sunglow pixel
  const yellow = (i: number) => px[i + 3] > 40 && px[i] > 150 && px[i + 1] > 110 && px[i + 2] < 110 && px[i] - px[i + 2] > 90;
  for (let y = 0; y < h; y++) {
    let x0 = -1, x1 = -1;
    for (let x = 1550; x < w; x++) {
      if (yellow((y * w + x) * 4)) {
        if (x0 < 0) x0 = x;
        x1 = x;
      }
    }
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (px[i + 3] === 0) continue;
      if (x0 >= 0 && x > x0 && x < x1) {
        // keep the bulb exactly as drawn (Sunglow and the dark filament) on its own layer
        inside.data.set([px[i], px[i + 1], px[i + 2], px[i + 3]], i);
        px[i + 3] = 0;
      } else {
        // ink: light, keeping the artwork's own anti-aliasing (its alpha, darkened by any yellow blend)
        const dark = 1 - Math.min(1, (px[i] + px[i + 1] + px[i + 2]) / 3 / 255);
        const a = yellow(i) ? px[i + 3] * 0.15 : px[i + 3] * Math.max(0.35, dark * 1.15);
        px[i] = INK[0];
        px[i + 1] = INK[1];
        px[i + 2] = INK[2];
        px[i + 3] = Math.min(255, a);
      }
    }
  }
  gi.clearRect(0, 0, width, h);
  gi.putImageData(data, 0, 0);
  gx.putImageData(inside, 0, 0);

  // "| LABS", centred on the logo box like the header's flex row
  const cy = h / 2;
  const lineBox = 12 * 1.6 * HEADER_SCALE;
  gi.fillStyle = "#F1CA01";
  gi.fillRect(ruleX, cy - lineBox / 2, rule, lineBox);
  gi.font = font;
  gi.fillStyle = `rgb(${INK.join(",")})`;
  gi.textBaseline = "middle";
  let x = textX;
  for (const c of letters) {
    gi.fillText(c, x, cy + fontPx * 0.04);
    x += measure.measureText(c).width + track;
  }
  return { ink, interior, width, height: h };
}
