// Sanity calls this on every publish/unpublish (see README: "Publish webhook").
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

const KNOWN = new Set(["siteSettings", "program", "project", "testimonial", "achievement", "redirect"]);

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return new NextResponse("Webhook secret not configured", { status: 500 });

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
  if (!isValidSignature) return new NextResponse("Invalid signature", { status: 401 });
  if (!body?._type || !KNOWN.has(body._type)) return NextResponse.json({ revalidated: false, reason: "ignored type" });

  // Expire immediately so the next visitor (and the sitemap) sees the published content.
  revalidateTag(body._type, { expire: 0 });
  return NextResponse.json({ revalidated: true, tag: body._type, now: Date.now() });
}
