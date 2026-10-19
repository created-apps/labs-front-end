// ES-module half of register-assets.cjs: resolves "@/assets/…" media imports and loads them as their
// file path (see that file).
import { fileURLToPath } from "node:url";

const ASSET = /\.(jpe?g|png|webp|avif|gif|mp4|pdf)$/i;
let srcUrl = "";

export function initialize(data) {
  srcUrl = data.src;
}

export async function resolve(specifier, context, next) {
  if (specifier.startsWith("@/") && ASSET.test(specifier)) {
    return { url: new URL(specifier.slice(2), srcUrl).href, shortCircuit: true };
  }
  return next(specifier, context);
}

export async function load(url, context, next) {
  if (ASSET.test(url)) {
    const file = fileURLToPath(url);
    const value = /\.(mp4|pdf)$/i.test(file) ? file : { src: file, width: 0, height: 0, blurDataURL: "" };
    return { format: "module", source: `export default ${JSON.stringify(value)};`, shortCircuit: true };
  }
  return next(url, context);
}
