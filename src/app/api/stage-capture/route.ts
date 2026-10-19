// Development-only: saves a stage still posted by /stage-capture?save=1 into public/images/stage.
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") return new NextResponse("Not found", { status: 404 });
  const { name, data } = (await req.json()) as { name: string; data: string };
  if (!/^[a-z-]+$/.test(name) || !data.startsWith("data:image/webp;base64,")) return new NextResponse("Bad request", { status: 400 });
  const file = path.join(process.cwd(), "public/images/stage", `${name}.webp`);
  await writeFile(file, Buffer.from(data.split(",")[1], "base64"));
  return NextResponse.json({ saved: file });
}
