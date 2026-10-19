// One-off: short product-style clip of a lab flask with gentle vapour for the Mentorship section.
// No people, no projects, no text. Usage: node --env-file=.env.local scripts/generate-flask-video.mjs
import { writeFile } from "node:fs/promises";

const KEY = process.env.GEMINI_API_KEY;
const MODEL = "veo-3.1-generate-preview";
const prompt =
  "Minimal, bright, high-key product shot. A single clear borosilicate glass Erlenmeyer flask, half filled with pale golden-yellow liquid, stands on a seamless, evenly lit, very light grey studio cyclorama (uniform colour #ECEDEE everywhere, no dark gradient, no vignette). From the flask's neck a barely visible, very thin, slow ribbon of faint white vapour rises a short distance and fades away; the vapour stays subtle and delicate for the entire clip and never becomes thick smoke. Soft diffused light from the upper left casts one long, soft shadow to the lower right. Locked-off static camera, slightly elevated three-quarter angle, the flask centred with generous empty space around it. Calm, elegant, scientific, photorealistic glass refraction. No people, no hands, no text, no labels, no logos, no other objects.";

const start = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predictLongRunning`, {
  method: "POST",
  headers: { "content-type": "application/json", "x-goog-api-key": KEY },
  body: JSON.stringify({
    instances: [{ prompt }],
    parameters: { aspectRatio: "16:9", durationSeconds: 8, negativePrompt: "people, hands, faces, text, labels, logos, thick smoke, heavy smoke, billowing smoke, dark background, vignette, explosion, bubbling, cartoon" },
  }),
});
const op = await start.json();
if (!op.name) {
  console.error(JSON.stringify(op).slice(0, 600));
  process.exit(1);
}
console.log("operation", op.name);
for (;;) {
  await new Promise((r) => setTimeout(r, 10000));
  const st = await (await fetch(`https://generativelanguage.googleapis.com/v1beta/${op.name}`, { headers: { "x-goog-api-key": KEY } })).json();
  if (!st.done) continue;
  if (st.error) {
    console.error(JSON.stringify(st.error));
    process.exit(1);
  }
  const uri = st.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
  if (!uri) {
    console.error(JSON.stringify(st).slice(0, 800));
    process.exit(1);
  }
  const vid = await fetch(uri, { headers: { "x-goog-api-key": KEY } });
  await writeFile("../_media-work/flask-vapour-2.raw.mp4", Buffer.from(await vid.arrayBuffer()));
  console.log("saved");
  break;
}
