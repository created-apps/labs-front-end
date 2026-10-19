/**
 * Imports the launch content (src/content/seed.ts) and the lab photos into Sanity.
 * Safe to re-run: documents are created or replaced by fixed IDs.
 *
 *   npx sanity exec scripts/seed-sanity.ts --with-user-token
 */
import "./register-assets.cjs"; // the content imports its media from src/assets; see that file
import { createReadStream } from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-10-01" });
const uploaded = new Map<string, string>();
let keyN = 0;
const key = () => `k${(keyN++).toString(36)}`;

// with register-assets, every imported image or clip's src is its absolute path under src/assets
type Img = { src: string; alt: string; caption?: string | null };
const isImg = (v: unknown): v is Img =>
  !!v && typeof v === "object" && "src" in v && "alt" in v && typeof (v as Img).src === "string" && /\.(jpe?g|png|webp)$/i.test((v as Img).src);

async function upload(src: string, kind: "image" | "file" = "image") {
  if (uploaded.has(src)) return uploaded.get(src)!;
  if (!path.isAbsolute(src)) throw new Error(`Expected an imported asset path, got ${src}`);
  const file = src;
  const asset = await client.assets.upload(kind, createReadStream(file), { filename: path.basename(file) });
  uploaded.set(src, asset._id);
  console.log("  uploaded", src);
  return asset._id;
}

type Clip = { src: string; poster?: string | null; alt?: string };
const isClip = (v: unknown): v is Clip => !!v && typeof v === "object" && typeof (v as Clip).src === "string" && (v as Clip).src.endsWith(".mp4");

async function clipToSanity(c: Clip, inArray: boolean) {
  return {
    _type: "videoClip",
    ...(inArray ? { _key: key() } : {}),
    file: { _type: "file", asset: { _type: "reference", _ref: await upload(c.src, "file") } },
    ...(c.poster ? { poster: { _type: "image", asset: { _type: "reference", _ref: await upload(c.poster) } } } : {}),
    alt: c.alt ?? "",
  };
}

// Converts the frontend shapes back into Sanity's stored shapes.
async function toSanity(v: unknown, inArray = false): Promise<unknown> {
  if (Array.isArray(v)) return Promise.all(v.map((x) => toSanity(x, true)));
  // mixed media items: { kind: "image", img } | { kind: "video", clip }
  if (v && typeof v === "object" && "kind" in v) {
    const m = v as { kind: string; img?: unknown; clip?: Clip };
    if (m.kind === "video" && m.clip) return clipToSanity(m.clip, inArray);
    if (m.kind === "image" && m.img) return toSanity(m.img, inArray);
  }
  if (isClip(v)) return clipToSanity(v, inArray);
  // official logos (outcome links): a plain image field
  if (v && typeof v === "object" && typeof (v as { src?: unknown }).src === "string" && (v as { src: string }).src.includes(`${path.sep}assets${path.sep}images${path.sep}logos${path.sep}`)) {
    return { _type: "image", asset: { _type: "reference", _ref: await upload((v as { src: string }).src) } };
  }
  if (isImg(v)) {
    const ref = await upload(v.src);
    return { _type: "figure", ...(inArray ? { _key: key() } : {}), asset: { _type: "reference", _ref: ref }, alt: v.alt, ...(v.caption ? { caption: v.caption } : {}) };
  }
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v)) {
      if (val === null || val === undefined) continue;
      if (k === "anchorId" && typeof val === "string") out[k] = { _type: "slug", current: val };
      else out[k] = await toSanity(val);
    }
    if (inArray && !("_key" in out)) out._key = key();
    return out;
  }
  return v;
}

async function main() {
  // loaded only now, after register-assets has taught Node to read media imports
  const { seedProgram, seedSettings } = await import("../src/content/seed");
  console.log("Site settings…");
  const { gaMeasurementId, defaultSeo, brochure, ...settings } = seedSettings;
  // the brochure import is the PDF's path on disk: upload it as a Sanity file
  const brochureFile = brochure?.url
    ? await client.assets.upload("file", createReadStream(brochure.url), { filename: brochure.filename || path.basename(brochure.url) })
    : null;
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    ...(await toSanity(settings) as object),
    ...(brochureFile ? { brochure: { _type: "file", asset: { _type: "reference", _ref: brochureFile._id } } } : {}),
    ...(gaMeasurementId ? { gaMeasurementId } : {}),
    defaultSeo: await toSanity(defaultSeo),
  });

  console.log("CreatED Labs program page…");
  const { _id, slug, sections, ...rest } = seedProgram;
  delete (rest as { updatedAt?: unknown }).updatedAt;
  await client.createOrReplace({
    _id,
    _type: "program",
    ...(await toSanity(rest) as object),
    slug: { _type: "slug", current: slug },
    sections: await toSanity(sections),
  });
  console.log("Done. Open /studio to edit.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
