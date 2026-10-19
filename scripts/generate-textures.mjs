// One-off: generates abstract decorative textures with Gemini. No people, no projects.
// Usage: node --env-file=.env.local scripts/generate-textures.mjs
import { writeFile } from "node:fs/promises";

const MODEL = "gemini-nano-banana-2.1";
const KEY = process.env.GEMINI_API_KEY;
if (!KEY) throw new Error("GEMINI_API_KEY missing");

const RULES =
  "Strictly abstract. No people, no hands, no faces, no text, no logos, no laboratory equipment brands, no recognisable objects or products. Photographic, high-end, minimal, soft studio light.";

const jobs = [
  {
    name: "texture-dispersion",
    aspect: "4:3",
    prompt: `Macro photograph of a single drop of golden-amber dye dispersing in perfectly clear water, delicate swirling tendrils and soft plumes, background a very pale icy azure (#F2FDFF), lots of empty negative space on the left, the plume on the right third. Colours limited to warm sunflower yellow (#F1CA01), amber and pale azure. ${RULES}`,
  },
  {
    name: "texture-caustics",
    aspect: "16:9",
    prompt: `Abstract light caustics cast through curved borosilicate glass onto a smooth charcoal surface (#232323), thin rippling lines of warm golden-yellow light (#F1CA01) with subtle cool blue fringes, dark and calm, gentle falloff into deep shadow at edges. ${RULES}`,
  },
  {
    name: "texture-glass-azure",
    aspect: "16:9",
    prompt: `Extreme close-up abstract of light refracting through thick clear glass with a thin layer of pale yellow liquid, very soft focus, bright airy palette of pale icy azure (#F2FDFF) and white with a few warm yellow (#F1CA01) highlights, high-key, minimal, suitable as a subtle website background. ${RULES}`,
  },
  {
    name: "og-backdrop",
    aspect: "16:9",
    prompt: `Minimal high-key studio composition: soft abstract golden-yellow liquid swirl suspended in clear water, positioned on the right side, left two-thirds empty pale icy azure (#F2FDFF) for text overlay. Colours: sunflower yellow, amber, pale azure, a touch of charcoal shadow. ${RULES}`,
  },
];

for (const job of jobs) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: job.prompt }] }],
        generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: job.aspect } },
      }),
    },
  );
  const data = await res.json();
  if (!res.ok) {
    console.error(job.name, JSON.stringify(data).slice(0, 400));
    continue;
  }
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) {
    console.error(job.name, "no image", JSON.stringify(data).slice(0, 400));
    continue;
  }
  const ext = part.inlineData.mimeType.includes("png") ? "png" : "jpg";
  const out = `src/assets/images/generated/${job.name}.raw.${ext}`;
  await writeFile(out, Buffer.from(part.inlineData.data, "base64"));
  console.log("saved", out);
}
