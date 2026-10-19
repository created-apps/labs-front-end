// One-off: vector-style illustrations for the 2:1 Mentorship section (one per stage of the mentorship).
// Generic scientific motifs only: no people, no faces, no text, no real projects or results.
// Usage: node --env-file=.env.local scripts/generate-mentor-illustrations.mjs
import { writeFile } from "node:fs/promises";

const MODEL = "gemini-nano-banana-2.1";
const KEY = process.env.GEMINI_API_KEY;
const STYLE =
  "Minimal editorial flat vector illustration, thin consistent charcoal line work (#232323, 2px look), flat fills only in sunglow yellow (#F1CA01) and cornflower blue (#649CF4), lots of white space, pure plain white background, centred composition, crisp clean vector shapes like a scientific journal infographic. No text, no letters, no numbers, no labels, no logos, no people, no hands, no faces.";
const jobs = [
  { name: "mentor-question", prompt: `An open research journal with a few highlighted lines, a magnifying glass resting on it, and three small reference cards linked by thin dotted lines to a single circled point, representing a literature review that narrows to a research question. ${STYLE}` },
  { name: "mentor-method", prompt: `An experiment design schematic: a glass beaker on a small magnetic stirrer, a pipette above it, an Erlenmeyer flask beside it, joined by a simple flow diagram of three boxes with arrows, representing designing and running an experiment. ${STYLE}` },
  { name: "mentor-paper", prompt: `A simple scatter chart with a smooth trend line, and an arrow leading from it to a research paper document showing a small figure and blank text lines, representing data analysis and writing a paper. ${STYLE}` },
];
for (const job of jobs) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": KEY },
    body: JSON.stringify({ contents: [{ parts: [{ text: job.prompt }] }], generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "4:3", imageSize: "2K" } } }),
  });
  const data = await res.json();
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) {
    console.error(job.name, JSON.stringify(data).slice(0, 300));
    continue;
  }
  await writeFile(`public/images/generated/${job.name}.raw.png`, Buffer.from(part.inlineData.data, "base64"));
  console.log("saved", job.name);
}
