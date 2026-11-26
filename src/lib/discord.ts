import { buildMeterBar, type LoveResult } from "./love-calculator";

export interface DiscordDispatchResult {
  configured: boolean;
  delivered: boolean;
  status?: number;
  reason?: string;
}

const DISCORD_WEBHOOK_HOSTS = new Set([
  "discord.com",
  "discordapp.com",
  "ptb.discord.com",
  "canary.discord.com",
]);

const DISCORD_WEBHOOK_PATH_RE = /^\/api(?:\/v\d+)?\/webhooks\/\d+\/[\w.-]+\/?$/;

export function normalizeWebhookUrl(rawUrl: string | undefined): string {
  if (!rawUrl) return "";
  let cleaned = rawUrl.trim().replace(/^["']|["']$/g, "").trim();
  if (cleaned.startsWith("DISCORD_WEBHOOK_URL=")) {
    cleaned = cleaned
      .slice("DISCORD_WEBHOOK_URL=".length)
      .trim()
      .replace(/^["']|["']$/g, "")
      .trim();
  }
  return cleaned;
}

export function isValidDiscordWebhookUrl(rawUrl: string | undefined): boolean {
  const normalized = normalizeWebhookUrl(rawUrl);
  if (!normalized) return false;

  try {
    const parsed = new URL(normalized);
    const isLocalTestHost =
      (process.env.NODE_ENV !== "production" ||
        process.env.ALLOW_TEST_WEBHOOK === "true") &&
      (parsed.hostname === "127.0.0.1" || parsed.hostname === "localhost") &&
      parsed.protocol === "http:";

    if (isLocalTestHost) {
      return true;
    }

    return (
      parsed.protocol === "https:" &&
      DISCORD_WEBHOOK_HOSTS.has(parsed.hostname.toLowerCase()) &&
      DISCORD_WEBHOOK_PATH_RE.test(parsed.pathname)
    );
  } catch {
    return false;
  }
}

export function sanitizeForDiscord(text: string): string {
  return text
    .replace(/@(everyone|here)/gi, "@\u200b$1")
    .replace(/<([@#!&])/g, "<\u200b$1")
    .replace(/([\\*_~`|>`])/g, "\\$1");
}

export function buildDiscordWebhookPayload(
  result: LoveResult,
  meta?: { sourceHost?: string }
) {
  const safeHis = sanitizeForDiscord(result.hisName);
  const safeHer = sanitizeForDiscord(result.herName);
  const safeFortune = sanitizeForDiscord(result.fortune);
  const meterBar = buildMeterBar(result.score, 10);

  return {
    username: "Love Meter",
    allowed_mentions: {
      parse: [] as string[],
    },
    embeds: [
      {
        author: {
          name: "💘 New Love Meter Submission",
        },
        title: `${safeHis}  ❤️  ${safeHer}`,
        description: [
          `**${result.tier.emoji} ${result.tier.label}** — *${result.tier.badge}*`,
          "",
          `\`${meterBar}\`  **${result.score}%**`,
          "",
          `> ${safeFortune}`,
        ].join("\n"),
        color: result.tier.embedColor,
        fields: [
          {
            name: "♂️ Male Name",
            value: `**${safeHis}**`,
            inline: true,
          },
          {
            name: "♀️ Female Name",
            value: `**${safeHer}**`,
            inline: true,
          },
          {
            name: "💯 Love Score",
            value: `**${result.score}%**`,
            inline: true,
          },
          {
            name: "📊 Compatibility Breakdown",
            value: [
              `🔥 Chemistry: **${result.breakdown.chemistry}%**`,
              `🤝 Trust: **${result.breakdown.trust}%**`,
              `😄 Vibe: **${result.breakdown.vibe}%**`,
              `🌙 Destiny: **${result.breakdown.destiny}%**`,
            ].join("  •  "),
            inline: false,
          },
          {
            name: "🌹 Suggested Date",
            value: result.dateIdea,
            inline: false,
          },
        ],
        footer: {
          text: meta?.sourceHost
            ? `Love Meter • ${meta.sourceHost}`
            : "Love Meter",
        },
        timestamp: result.calculatedAt,
      },
    ],
  };
}

export async function sendLoveToDiscord(
  result: LoveResult,
  meta?: { sourceHost?: string }
): Promise<DiscordDispatchResult> {
  const webhookUrl = normalizeWebhookUrl(process.env.DISCORD_WEBHOOK_URL);

  if (!webhookUrl) {
    console.warn(
      "[love-meter] DISCORD_WEBHOOK_URL is not configured; skipping Discord delivery."
    );
    return {
      configured: false,
      delivered: false,
      reason: "webhook_not_configured",
    };
  }

  if (!isValidDiscordWebhookUrl(webhookUrl)) {
    console.error("[love-meter] DISCORD_WEBHOOK_URL has an invalid format.");
    return {
      configured: false,
      delivered: false,
      reason: "invalid_webhook_url",
    };
  }

  const payload = buildDiscordWebhookPayload(result, meta);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "HeartSyncLoveMeter/1.0",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(
        `[love-meter] Discord webhook returned HTTP ${response.status}: ${errorText.slice(0, 200)}`
      );
      return {
        configured: true,
        delivered: false,
        status: response.status,
        reason: "discord_http_error",
      };
    }

    return {
      configured: true,
      delivered: true,
      status: response.status,
    };
  } catch (error) {
    console.error("[love-meter] Failed to send payload to Discord:", error);
    return {
      configured: true,
      delivered: false,
      reason: "network_or_timeout",
    };
  }
}

