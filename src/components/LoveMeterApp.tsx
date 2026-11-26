"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeftRight,
  CalendarHeart,
  Check,
  Copy,
  Flame,
  Heart,
  History,
  MoonStar,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import type { LoveResult } from "@/lib/love-calculator";
import { HeartBurst } from "./HeartBurst";
import { HeartGauge } from "./HeartGauge";

interface ApiLoveResponse {
  ok: boolean;
  error?: string;
  result?: LoveResult;
  discord?: {
    configured: boolean;
    delivered: boolean;
  };
}

const HISTORY_STORAGE_KEY = "heartsync-recent-matches-v1";
const MAX_HISTORY_ITEMS = 5;

export function LoveMeterApp() {
  const [hisName, setHisName] = useState("");
  const [herName, setHerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LoveResult | null>(null);
  const [discordStatus, setDiscordStatus] = useState<{
    configured: boolean;
    delivered: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<LoveResult[]>([]);
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    setIsLocalhost(
      window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
    );

    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, MAX_HISTORY_ITEMS));
        }
      }
    } catch {
      // Ignore corrupt or unavailable localStorage
    }
  }, []);

  const persistHistory = (next: LoveResult[]) => {
    setHistory(next);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleSwapNames = () => {
    setHisName(herName);
    setHerName(hisName);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedHis = hisName.trim();
    const trimmedHer = herName.trim();

    if (!trimmedHis || !trimmedHer) {
      setError("Please enter both His Name and Her Name to calculate.");
      return;
    }

    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      const response = await fetch("/api/love", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hisName: trimmedHis,
          herName: trimmedHer,
        }),
      });

      const data = (await response.json()) as ApiLoveResponse;

      if (!response.ok || !data.ok || !data.result) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setResult(data.result);
      setDiscordStatus(data.discord ?? null);

      const deduped = history.filter(
        (item) =>
          !(
            item.hisName.toLowerCase() ===
              data.result!.hisName.toLowerCase() &&
            item.herName.toLowerCase() === data.result!.herName.toLowerCase()
          )
      );
      persistHistory([data.result, ...deduped].slice(0, MAX_HISTORY_ITEMS));
    } catch {
      setError("Network error while measuring love. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setDiscordStatus(null);
    setError(null);
    setCopied(false);
  };

  const handleCopyResult = async () => {
    if (!result) return;
    const summary = [
      `💘 ${result.hisName} ❤️ ${result.herName} — ${result.score}% (${result.tier.label})`,
      `🔥 Chemistry: ${result.breakdown.chemistry}% | 🤝 Trust: ${result.breakdown.trust}% | 😄 Vibe: ${result.breakdown.vibe}% | 🌙 Destiny: ${result.breakdown.destiny}%`,
      `💌 "${result.fortune}"`,
      `🌹 Date Idea: ${result.dateIdea}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard access denied
    }
  };

  const handleSelectHistory = (item: LoveResult) => {
    setHisName(item.hisName);
    setHerName(item.herName);
    setResult(item);
    setDiscordStatus(null);
    setError(null);
    setCopied(false);
  };

  const handleClearHistory = () => {
    persistHistory([]);
  };

  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-10 sm:px-6 sm:py-14">
      {result && (
        <HeartBurst triggerKey={result.calculatedAt} score={result.score} />
      )}

      {/* Hero Header */}
      <header className="mb-8 text-center sm:mb-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-rose-700 shadow-sm backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-rose-500" />
          <span>Love Compatibility Meter</span>
        </div>

        <h1 className="font-display text-4xl font-extrabold tracking-tight text-rose-950 sm:text-5xl">
          Measure the{" "}
          <span className="bg-gradient-to-r from-rose-600 via-pink-500 to-rose-500 bg-clip-text italic text-transparent">
            Spark
          </span>{" "}
          Between Two Hearts
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-rose-900/75 sm:text-base">
          Enter both names below to reveal your compatibility score, love
          breakdown, and cosmic date idea.
        </p>
      </header>

      {/* Main Glass Card */}
      <main className="w-full rounded-[2rem] border border-white/90 bg-white/78 p-5 shadow-[0_24px_65px_-16px_rgba(190,18,60,0.18)] backdrop-blur-xl sm:p-8">
        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
              {/* Male Name Field */}
              <div className="group rounded-2xl border border-rose-100 bg-gradient-to-b from-white to-rose-50/45 p-4 shadow-sm transition focus-within:border-rose-300 focus-within:ring-4 focus-within:ring-rose-200/45">
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="his-name"
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-900/80"
                  >
                    <User className="h-3.5 w-3.5 text-sky-600" />
                    <span>His Name</span>
                  </label>
                  <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-200/70">
                    ♂ Male
                  </span>
                </div>
                <input
                  id="his-name"
                  name="hisName"
                  type="text"
                  autoComplete="off"
                  maxLength={50}
                  value={hisName}
                  onChange={(e) => {
                    setHisName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter male name..."
                  className="w-full bg-transparent text-base font-semibold text-rose-950 placeholder:font-normal placeholder:text-rose-900/35 focus:outline-none sm:text-lg"
                />
              </div>

              {/* Center Swap / Heart Connector */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleSwapNames}
                  title="Swap names"
                  aria-label="Swap male and female names"
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-500 shadow-sm transition hover:scale-105 hover:border-rose-300 hover:bg-rose-50 active:scale-95"
                >
                  <Heart className="h-4 w-4 fill-rose-500 text-rose-500 transition-transform group-hover:hidden" />
                  <ArrowLeftRight className="hidden h-4 w-4 text-rose-600 group-hover:block" />
                </button>
              </div>

              {/* Female Name Field */}
              <div className="group rounded-2xl border border-rose-100 bg-gradient-to-b from-white to-pink-50/45 p-4 shadow-sm transition focus-within:border-rose-300 focus-within:ring-4 focus-within:ring-rose-200/45">
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="her-name"
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-900/80"
                  >
                    <User className="h-3.5 w-3.5 text-rose-500" />
                    <span>Her Name</span>
                  </label>
                  <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/70">
                    ♀ Female
                  </span>
                </div>
                <input
                  id="her-name"
                  name="herName"
                  type="text"
                  autoComplete="off"
                  maxLength={50}
                  value={herName}
                  onChange={(e) => {
                    setHerName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter female name..."
                  className="w-full bg-transparent text-base font-semibold text-rose-950 placeholder:font-normal placeholder:text-rose-900/35 focus:outline-none sm:text-lg"
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-center text-sm font-medium text-rose-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 px-6 py-4 text-base font-bold text-white shadow-[0_14px_30px_-8px_rgba(225,29,72,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-8px_rgba(225,29,72,0.6)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Heart
                className={`h-5 w-5 fill-white/90 ${
                  loading ? "animate-ping" : "transition-transform group-hover:scale-110"
                }`}
              />
              <span>
                {loading ? "Syncing Hearts..." : "Calculate Our Love"}
              </span>
            </button>
          </form>
        ) : (
          <div className="animate-fade-up space-y-6" aria-live="polite">
            {/* Couple Header */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50/90 px-3.5 py-1 text-xs font-bold text-rose-700">
                <span>{result.tier.emoji}</span>
                <span>{result.tier.badge}</span>
              </div>

              <h2 className="font-display flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-2xl font-bold text-rose-950 sm:text-3xl">
                <span>{result.hisName}</span>
                <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
                <span>{result.herName}</span>
              </h2>
            </div>

            {/* Animated Liquid Heart Gauge */}
            <HeartGauge
              targetScore={result.score}
              accentHex={result.tier.accentHex}
            />

            {/* Verdict Title & Fortune */}
            <div className="text-center">
              <p className="font-display text-2xl font-extrabold text-rose-900 sm:text-3xl">
                {result.tier.label}
              </p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-rose-900/80 sm:text-base">
                &ldquo;{result.fortune}&rdquo;
              </p>
            </div>

            {/* 4-Pillar Breakdown */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  label: "Chemistry",
                  value: result.breakdown.chemistry,
                  icon: Flame,
                  barColor: "from-rose-500 to-orange-400",
                },
                {
                  label: "Trust",
                  value: result.breakdown.trust,
                  icon: ShieldCheck,
                  barColor: "from-pink-500 to-rose-400",
                },
                {
                  label: "Vibe",
                  value: result.breakdown.vibe,
                  icon: Sparkles,
                  barColor: "from-amber-400 to-pink-500",
                },
                {
                  label: "Destiny",
                  value: result.breakdown.destiny,
                  icon: MoonStar,
                  barColor: "from-purple-500 to-rose-500",
                },
              ].map((metric) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-rose-100/90 bg-white/85 p-3.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-rose-900/75">
                      <span className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-rose-500" />
                        {metric.label}
                      </span>
                      <span className="font-bold text-rose-950">
                        {metric.value}%
                      </span>
                    </div>
                    <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-rose-100">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${metric.barColor} transition-all duration-700`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Suggested Date Card */}
            <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50/85 to-amber-50/70 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm">
                <CalendarHeart className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  Suggested Date Idea
                </p>
                <p className="mt-0.5 text-sm font-medium text-rose-950">
                  {result.dateIdea}
                </p>
              </div>
            </div>

            {/* Discord delivery badge */}
            {discordStatus?.delivered && (
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-700">
                <Send className="h-3.5 w-3.5" />
                <span>Match card delivered to Discord</span>
              </div>
            )}

            {isLocalhost &&
              discordStatus &&
              !discordStatus.configured && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-2.5 text-center text-xs font-medium text-amber-800">
                  Local dev note: add <code>DISCORD_WEBHOOK_URL</code> to{" "}
                  <code>.env.local</code> to forward submissions to Discord.
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleCopyResult}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-5 py-3.5 text-sm font-bold text-rose-900 shadow-sm transition hover:border-rose-300 hover:bg-rose-50/70"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-rose-500" />
                    <span>Copy Result</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 px-5 py-3.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Test Another Couple</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Recent Checks Strip */}
      {history.length > 0 && (
        <section
          aria-label="Recent checks"
          className="mt-7 w-full rounded-2xl border border-white/80 bg-white/60 px-4 py-3.5 backdrop-blur-md"
        >
          <div className="mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-900/70">
              <History className="h-3.5 w-3.5 text-rose-500" />
              Recent Checks
            </span>
            <button
              type="button"
              onClick={handleClearHistory}
              className="flex items-center gap-1 text-xs font-semibold text-rose-600/80 transition hover:text-rose-800"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((item) => (
              <button
                key={`${item.hisName}-${item.herName}-${item.calculatedAt}`}
                type="button"
                onClick={() => handleSelectHistory(item)}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/70 bg-white/90 px-3 py-1.5 text-xs font-semibold text-rose-900 shadow-xs transition hover:border-rose-300 hover:bg-rose-50"
              >
                <span>{item.hisName}</span>
                <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                <span>{item.herName}</span>
                <span className="ml-0.5 rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                  {item.score}%
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

