import { NextRequest, NextResponse } from "next/server";
import { getSupabase, LEADS_TABLE } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Stores one brochure lead. The brochure URL itself comes from Site settings and
// is already resolved on the client, so this route only validates and inserts.
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, phone } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (phone !== undefined && phone !== null && typeof phone !== "string") {
    return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    console.error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not configured; brochure lead was not stored.",
    );
    return NextResponse.json(
      { error: "Brochure downloads are temporarily unavailable. Please try again shortly." },
      { status: 503 },
    );
  }

  const { error } = await supabase.from(LEADS_TABLE).insert({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: typeof phone === "string" ? phone.trim() : null,
  });

  if (error) {
    console.error("Failed to store brochure lead:", error.message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
