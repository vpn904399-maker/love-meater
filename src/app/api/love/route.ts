import { NextResponse } from "next/server";
import { sendLoveToDiscord } from "@/lib/discord";
import { calculateLove, validateCoupleNames } from "@/lib/love-calculator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  const payload =
    body && typeof body === "object"
      ? (body as Record<string, unknown>)
      : {};

  const validation = validateCoupleNames(payload.hisName, payload.herName);
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, error: validation.error },
      { status: 400 }
    );
  }

  const result = calculateLove(validation.hisName, validation.herName);

  const hostHeader = request.headers.get("host");
  const sourceHost = hostHeader
    ? hostHeader.replace(/[^\w.:-]/g, "").slice(0, 80)
    : undefined;

  const discord = await sendLoveToDiscord(result, { sourceHost });

  return NextResponse.json({
    ok: true,
    result,
    discord: {
      configured: discord.configured,
      delivered: discord.delivered,
      ...(discord.delivered
        ? {}
        : { status: discord.status, reason: discord.reason }),
    },
  });
}

