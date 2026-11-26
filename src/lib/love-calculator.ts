export interface LoveBreakdown {
  chemistry: number;
  trust: number;
  vibe: number;
  destiny: number;
}

export interface LoveTier {
  id: "soulmates" | "magnetic" | "steady" | "opposites" | "wildcard";
  label: string;
  badge: string;
  emoji: string;
  embedColor: number;
  accentHex: string;
}

export interface LoveResult {
  hisName: string;
  herName: string;
  score: number;
  tier: LoveTier;
  breakdown: LoveBreakdown;
  fortune: string;
  dateIdea: string;
  calculatedAt: string;
}

export type NameValidationResult =
  | { ok: true; hisName: string; herName: string }
  | { ok: false; error: string };

const MAX_NAME_LENGTH = 50;

const TIER_DEFINITIONS: Record<
  LoveTier["id"],
  {
    tier: LoveTier;
    fortunes: Array<(his: string, her: string) => string>;
    dateIdeas: string[];
  }
> = {
  soulmates: {
    tier: {
      id: "soulmates",
      label: "Written in the Stars",
      badge: "Cosmic Soulmates",
      emoji: "💘",
      embedColor: 0xf43f5e,
      accentHex: "#f43f5e",
    },
    fortunes: [
      (his, her) =>
        `${his} and ${her} share a rare kind of magnetism — effortless conversations, lingering glances, and a rhythm that feels like home.`,
      (his, her) =>
        `When ${his} meets ${her}, small moments turn into favorite memories. Your wavelengths align almost uncannily well.`,
      (his, her) =>
        `${his} & ${her} carry pure main-character energy together — balanced, fiercely loyal, and endlessly inspiring.`,
    ],
    dateIdeas: [
      "Sunset picnic with acoustic playlists and shared desserts",
      "Stargazing drive with warm drinks and zero phone screens",
      "Cooking each other's favorite comfort dish from scratch",
      "Late-night city walk ending at a cozy dessert cafe",
    ],
  },
  magnetic: {
    tier: {
      id: "magnetic",
      label: "Magnetic Chemistry",
      badge: "True Match",
      emoji: "💖",
      embedColor: 0xec4899,
      accentHex: "#ec4899",
    },
    fortunes: [
      (his, her) =>
        `There is serious spark between ${his} and ${her} — playful teasing backed by genuine warmth and loyalty.`,
      (his, her) =>
        `${his} brings out the brightest laugh in ${her}, while ${her} keeps ${his} grounded and inspired.`,
      (his, her) =>
        `${his} and ${her} have the kind of chemistry people notice the moment you both walk into a room.`,
    ],
    dateIdeas: [
      "Golden-hour coffee walk followed by a bookstore browse",
      "Street food crawl where each person picks a surprise stop",
      "Sunset bowling or mini-golf with a playful bet on the loser",
      "Art gallery stroll and spontaneous gelato afterwards",
    ],
  },
  steady: {
    tier: {
      id: "steady",
      label: "Sweet & Steady",
      badge: "Warm Sparks",
      emoji: "🌹",
      embedColor: 0xfb7185,
      accentHex: "#fb7185",
    },
    fortunes: [
      (his, her) =>
        `${his} and ${her} have a gentle, growing connection — the kind of bond that gets sweeter every single week.`,
      (his, her) =>
        `Patience and curiosity unlock magic for ${his} and ${her}. One shared adventure could send this sky-high.`,
      (his, her) =>
        `${his} and ${her} complement each other softly, turning ordinary afternoons into easy smiles.`,
    ],
    dateIdeas: [
      "Cozy indie cafe hangout with two iced drinks and board games",
      "Afternoon botanical garden walk and polaroid photos",
      "Movie marathon at home with homemade popcorn and fairy lights",
      "Weekend farmer's market stroll and brunch",
    ],
  },
  opposites: {
    tier: {
      id: "opposites",
      label: "Opposites Attract",
      badge: "Spicy Dynamic",
      emoji: "✨",
      embedColor: 0xf59e0b,
      accentHex: "#f59e0b",
    },
    fortunes: [
      (his, her) =>
        `${his} and ${her} see the world differently — and that friction creates unpredictable, electric fun.`,
      (his, her) =>
        `Never a dull moment with ${his} and ${her}! Half the fun is debating everything and laughing halfway through.`,
      (his, her) =>
        `${his} brings chaos, ${her} brings plot twists — somehow, together you keep each other guessing in the best way.`,
    ],
    dateIdeas: [
      "Competitive retro arcade night with bragging rights on the line",
      "Trying a brand-new cuisine neither of you has ever tasted",
      "Escape room challenge to test your teamwork under pressure",
      "Karaoke night with zero judgment and bold song picks",
    ],
  },
  wildcard: {
    tier: {
      id: "wildcard",
      label: "Chaotic Plot Twist",
      badge: "Wildcard Duo",
      emoji: "🔥",
      embedColor: 0xa855f7,
      accentHex: "#a855f7",
    },
    fortunes: [
      (his, her) =>
        `The stars raised an eyebrow at ${his} and ${her} — unpredictable, dramatic, and impossible to ignore.`,
      (his, her) =>
        `${his} & ${her} break every compatibility rulebook. Expect iconic banter and surprising plot twists.`,
      (his, her) =>
        `Logic says maybe not, yet ${his} and ${her} somehow keep finding their way back into each other's orbit.`,
    ],
    dateIdeas: [
      "Midnight drive-thru feast and honest hot-takes",
      "Trivia night where you team up against the entire room",
      "Spontaneous thrift-store outfit swap challenge",
      "Roller skating or go-karts to burn off the chaotic energy",
    ],
  },
};

export function sanitizeDisplayName(raw: string): string {
  return raw
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

export function validateCoupleNames(
  hisNameInput: unknown,
  herNameInput: unknown
): NameValidationResult {
  if (typeof hisNameInput !== "string" || typeof herNameInput !== "string") {
    return { ok: false, error: "Please enter both names as text." };
  }

  const hisName = sanitizeDisplayName(hisNameInput);
  const herName = sanitizeDisplayName(herNameInput);

  if (!hisName || !herName) {
    return {
      ok: false,
      error: "Both His Name and Her Name are required to measure the spark.",
    };
  }

  if (hisName.length > MAX_NAME_LENGTH || herName.length > MAX_NAME_LENGTH) {
    return {
      ok: false,
      error: `Names must be ${MAX_NAME_LENGTH} characters or fewer.`,
    };
  }

  return { ok: true, hisName, herName };
}

function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return hash >>> 0;
}

function seededInt(seed: string, min: number, max: number): number {
  const hash = fnv1a32(seed);
  return min + (hash % (max - min + 1));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function pickTierId(score: number): LoveTier["id"] {
  if (score >= 85) return "soulmates";
  if (score >= 72) return "magnetic";
  if (score >= 56) return "steady";
  if (score >= 38) return "opposites";
  return "wildcard";
}

const IGNORED_TITLE_TOKENS = new Set(["mr", "ms", "mrs", "miss", "dr"]);

function extractNameTokens(raw: string): string[] {
  return raw
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 0 && !IGNORED_TITLE_TOKENS.has(token));
}

function isAathithyaVariant(raw: string): boolean {
  const tokens = extractNameTokens(raw);
  const wordTokens = tokens.filter((t) => t.length > 1);
  if (wordTokens.length === 0) return false;

  const matchesToken = (t: string) =>
    /^a{1,3}(?:th|dh)i(?:th|t)i?ya{1,2}n?$/.test(t) ||
    /^a{1,3}di(?:th)i?ya{1,2}n?$/.test(t) ||
    /^[a-z]?aathithya[a-z]?$/.test(t);

  return wordTokens.some(matchesToken) || matchesToken(wordTokens.join(""));
}

function isJanakiVariant(raw: string): boolean {
  const tokens = extractNameTokens(raw);
  const wordTokens = tokens.filter((t) => t.length > 1);
  if (wordTokens.length === 0) return false;

  const matchesToken = (t: string) =>
    /^[a-z]?ja{1,2}na{1,2}(?:k|g|gh)(?:i{1,2}|ee|y)[a-z]?$/.test(t);

  return wordTokens.some(matchesToken) || matchesToken(wordTokens.join(""));
}

function isSpecialCouple(hisName: string, herName: string): boolean {
  return (
    (isAathithyaVariant(hisName) && isJanakiVariant(herName)) ||
    (isAathithyaVariant(herName) && isJanakiVariant(hisName))
  );
}

export function buildMeterBar(score: number, segments = 10): string {
  const filled = clamp(Math.round((score / 100) * segments), 0, segments);
  return "▰".repeat(filled) + "▱".repeat(segments - filled);
}

export function calculateLove(hisRaw: string, herRaw: string): LoveResult {
  const hisName = sanitizeDisplayName(hisRaw);
  const herName = sanitizeDisplayName(herRaw);

  // Sort normalized names so the couple's core compatibility is consistent regardless of order.
  const pairKey = [hisName.toLowerCase(), herName.toLowerCase()]
    .sort()
    .join("::");

  const isSpecial = isSpecialCouple(hisName, herName);

  let score: number;
  let breakdown: LoveBreakdown;

  if (isSpecial) {
    score = seededInt(`special-score::${pairKey}`, 99, 100);
    breakdown = {
      chemistry: seededInt(`special-chem::${pairKey}`, 99, 100),
      trust: seededInt(`special-trust::${pairKey}`, 99, 100),
      vibe: seededInt(`special-vibe::${pairKey}`, 99, 100),
      destiny: seededInt(`special-destiny::${pairKey}`, 99, 100),
    };
  } else {
    const roll = seededInt(`tier-roll::${pairKey}`, 0, 99);

    if (roll < 22) {
      score = seededInt(`score::${pairKey}`, 85, 95);
    } else if (roll < 54) {
      score = seededInt(`score::${pairKey}`, 72, 84);
    } else if (roll < 78) {
      score = seededInt(`score::${pairKey}`, 56, 71);
    } else if (roll < 91) {
      score = seededInt(`score::${pairKey}`, 38, 55);
    } else {
      score = seededInt(`score::${pairKey}`, 19, 37);
    }

    breakdown = {
      chemistry: clamp(
        score + seededInt(`chem::${pairKey}`, -9, 10),
        15,
        96
      ),
      trust: clamp(score + seededInt(`trust::${pairKey}`, -11, 9), 15, 96),
      vibe: clamp(score + seededInt(`vibe::${pairKey}`, -10, 10), 15, 96),
      destiny: clamp(score + seededInt(`destiny::${pairKey}`, -12, 9), 15, 96),
    };
  }

  const tierId = pickTierId(score);
  const config = TIER_DEFINITIONS[tierId];

  const fortuneIndex = seededInt(
    `fortune::${pairKey}`,
    0,
    config.fortunes.length - 1
  );
  const dateIndex = seededInt(
    `date::${pairKey}`,
    0,
    config.dateIdeas.length - 1
  );

  return {
    hisName,
    herName,
    score,
    tier: config.tier,
    breakdown,
    fortune: config.fortunes[fortuneIndex](hisName, herName),
    dateIdea: config.dateIdeas[dateIndex],
    calculatedAt: new Date().toISOString(),
  };
}

