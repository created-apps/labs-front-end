import Image from "next/image";
import type { Img } from "@/lib/types";

// next/image with the CMS focal point and blur placeholder applied.
export function Picture({
  img,
  sizes,
  preload,
  className,
  decorative,
}: {
  img: Img;
  sizes: string;
  preload?: boolean;
  className?: string;
  decorative?: boolean;
}) {
  const pos = img.focus ? `${Math.round(img.focus.x * 100)}% ${Math.round(img.focus.y * 100)}%` : undefined;
  return (
    <Image
      src={img.src}
      alt={decorative ? "" : img.alt}
      width={img.width}
      height={img.height}
      sizes={sizes}
      preload={preload}
      className={className}
      style={pos ? { objectPosition: pos } : undefined}
      {...(img.lqip ? { placeholder: "blur" as const, blurDataURL: img.lqip } : {})}
    />
  );
}
