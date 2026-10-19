import { notFound } from "next/navigation";
import { CaptureStage } from "./CaptureStage";

// Development-only tool that renders the hero stage at a point in its timeline, for the still images.
export const metadata = { robots: { index: false, follow: false } };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; t?: string; mobile?: string; save?: string; opening?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const sp = await searchParams;
  return <CaptureStage name={sp.name ?? "hero"} t={Number(sp.t ?? 10)} mobile={sp.mobile === "1"} save={sp.save === "1"} opening={sp.opening === "1"} />;
}
