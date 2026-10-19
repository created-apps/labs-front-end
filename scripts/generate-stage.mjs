// One-off: photoreal set surfaces for the 3D hero stage. No people, no projects, no text.
// Usage: node --env-file=.env.local scripts/generate-stage.mjs
import { writeFile } from "node:fs/promises";

const MODEL = "gemini-nano-banana-2.1";
const KEY = process.env.GEMINI_API_KEY;
const RULES = "No people, no hands, no faces, no text, no labels, no logos, no brand names. Photorealistic, high-end product photography, physically plausible lighting.";

const jobs = [
  {
    name: "workbench",
    aspect: "16:9",
    prompt: `Perfectly top-down photograph of a premium modern laboratory workbench. The worktop is polished black epoxy resin with a subtle satin sheen, faint soft reflections of overhead strip lights and very fine micro-scratches. A brushed stainless-steel edge trim runs along the bottom of the frame. Only near the outer edges: a closed black hardcover laboratory notebook with a pen, a clear glass graduated cylinder lying on its side, a stainless steel spatula, a small white ceramic weighing dish, a pair of nitrile gloves folded neatly. The large central area of the worktop is completely empty and clean. Cool neutral overhead lighting with a warm accent from the upper left, realistic soft shadows, high-end scientific facility. ${RULES}`,
  },
];

for (const job of jobs) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: job.prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: job.aspect, imageSize: "4K" } },
    }),
  });
  const data = await res.json();
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) {
    console.error(job.name, JSON.stringify(data).slice(0, 300));
    continue;
  }
  await writeFile(`src/assets/images/generated/${job.name}-4k.raw.jpg`, Buffer.from(part.inlineData.data, "base64"));
  console.log("saved", job.name);
}
