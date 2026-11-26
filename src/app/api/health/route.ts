import { NextResponse } from "next/server";
import { isValidDiscordWebhookUrl } from "@/lib/discord";

export const runtime = "nodejs";

export async function GET() {
  const raw = process.env.DISCORD_WEBHOOK_URL?.trim();
  return NextResponse.json({
    ok: true,
    hasEnvVar: Boolean(raw),
    discordWebhookConfigured: isValidDiscordWebhookUrl(raw),
  });
}

