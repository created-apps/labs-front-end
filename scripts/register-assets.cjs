// Lets Node scripts (the Sanity seed) load the site's content files, which import their media from
// src/assets the way Next does. Each image import becomes { src: <absolute file path>, width, height }
// and each .mp4 import becomes its absolute file path, so the script can upload the files directly.
// Works whether the script runs as CommonJS (require hooks) or as ES modules (loader hooks).
const Module = require("node:module");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const SRC = path.join(__dirname, "..", "src");
const IMAGES = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];

for (const ext of [...IMAGES, ".mp4"]) {
  Module._extensions[ext] = (mod, filename) => {
    mod.exports = ext === ".mp4" ? filename : { src: filename, width: 0, height: 0, blurDataURL: "" };
  };
}
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  return resolveFilename.call(this, request.startsWith("@/") ? path.join(SRC, request.slice(2)) : request, ...rest);
};

if (typeof Module.register === "function") {
  Module.register(pathToFileURL(path.join(__dirname, "asset-loader.mjs")), { data: { src: pathToFileURL(SRC + path.sep).href } });
}
