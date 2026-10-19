// Video clips imported from src/assets/media resolve to their emitted URL (see turbopack.rules in
// next.config.ts). Images use Next's built-in static image imports (next/image-types/global).
declare module "*.mp4" {
  const src: string;
  export default src;
}
