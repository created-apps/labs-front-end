import { notFound, permanentRedirect, redirect } from "next/navigation";
import { getRedirect } from "@/lib/content";

// Unknown URLs: follow a CMS redirect if one exists, otherwise 404.
export default async function CatchAll({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const match = await getRedirect(`/${path.join("/")}`);
  if (!match) notFound();
  if (match.permanent === false) redirect(match.to);
  permanentRedirect(match.to);
}
