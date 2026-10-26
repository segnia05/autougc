/**
 * Autopilot 30-Day Drip-Feed Campaign & Multi-Account Distribution Engine.
 *
 * Mathematically allocates videos across 30-day calendars, applies target-country
 * timezone peak hours, and permutes creative layers across multiple linked accounts
 * to prevent duplicate content shadowbans.
 */

export type CampaignCadence =
  | "mon_wed_fri"
  | "mon_wed_fri_sun"
  | "weekdays"
  | "daily_30";

export interface TimezoneConfig {
  iana: string;
  name: string;
  utcOffsetStandard: number; // e.g. -5 for EST
}

export const TIMEZONE_CONFIGS: Record<string, TimezoneConfig> = {
  "America/New_York": { iana: "America/New_York", name: "US Eastern (New York / Miami)", utcOffsetStandard: -5 },
  "America/Chicago": { iana: "America/Chicago", name: "US Central (Chicago / Dallas)", utcOffsetStandard: -6 },
  "America/Los_Angeles": { iana: "America/Los_Angeles", name: "US Pacific (LA / SF)", utcOffsetStandard: -8 },
  "Europe/London": { iana: "Europe/London", name: "United Kingdom (London)", utcOffsetStandard: 0 },
  "Europe/Paris": { iana: "Europe/Paris", name: "European Union (Paris / Berlin)", utcOffsetStandard: 1 },
  "Australia/Sydney": { iana: "Australia/Sydney", name: "Australia (Sydney / Melbourne)", utcOffsetStandard: 10 },
};

export const HOOK_ANGLES = [
  { id: "pattern_interrupt", label: "Pattern Interrupt", promptPrefix: "Stop doing this in 2026..." },
  { id: "curiosity_hack", label: "Curiosity Hack", promptPrefix: "The hidden secret nobody talks about..." },
  { id: "problem_agitation", label: "Problem / Agitation", promptPrefix: "Why does nobody talk about how painful this is?..." },
  { id: "social_proof", label: "Social Proof / Case Study", promptPrefix: "Here is what happened when 10,000 people tried..." },
  { id: "myth_buster", label: "Direct Mythbuster", promptPrefix: "Everything you were told about this is completely wrong..." },
] as const;

export const CREATOR_VOICE_ROTATION = [
  "marcus",   // Energetic Male
  "chloe",    // GenZ Dynamic Female
  "leo",      // Tech Casual Male
  "sophia",   // Warm Authoritative Female
  "alex",     // Fast Punchy Creator
] as const;

export const SUBTITLE_STYLE_ROTATION = [
  "hormozi_amber",
  "beast_cyan",
  "electric_emerald",
  "minimal_white",
  "neon_violet",
] as const;

export interface ConnectedAccountInput {
  id: string;
  accountHandle: string;
  accountNickname?: string | null;
  platform: "tiktok" | "instagram" | "youtube";
  isBurner?: boolean;
}

export interface DistributionPlanInput {
  projectId: string;
  totalVideos: number;
  cadence: CampaignCadence;
  targetTimezone: string;
  preferredHour?: number; // 0-23 in local target timezone (default 16 = 4:00 PM)
  startDate?: Date;
  connectedAccounts: ConnectedAccountInput[];
}

export interface ScheduledSlot {
  slotIndex: number;
  utcScheduledFor: Date;
  localDisplayTime: string;
  assignedAccount: ConnectedAccountInput;
  hookAngle: (typeof HOOK_ANGLES)[number]["id"];
  hookLabel: string;
  voiceId: (typeof CREATOR_VOICE_ROTATION)[number];
  subtitleStyle: (typeof SUBTITLE_STYLE_ROTATION)[number];
  captionVariant: string;
}

export interface DistributionPlanResult {
  campaignName: string;
  cadence: CampaignCadence;
  targetTimezone: string;
  totalScheduled: number;
  startDate: Date;
  endDate: Date;
  slots: ScheduledSlot[];
  accountBreakdown: Record<string, { handle: string; nickname?: string | null; count: number }>;
}

/**
 * Checks if a given day-of-week matches the chosen cadence.
 * Day is 0 (Sunday) to 6 (Saturday).
 */
function isCadenceDay(dayOfWeek: number, cadence: CampaignCadence): boolean {
  switch (cadence) {
    case "mon_wed_fri":
      return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5; // Mon, Wed, Fri
    case "mon_wed_fri_sun":
      return dayOfWeek === 0 || dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5; // Sun, Mon, Wed, Fri
    case "weekdays":
      return dayOfWeek >= 1 && dayOfWeek <= 5; // Mon-Fri
    case "daily_30":
      return true; // Everyday
    default:
      return true;
  }
}

/**
 * Calculates local time offset to UTC for the target timezone.
 * Uses standard offset lookup as baseline.
 */
function getUtcOffsetHours(ianaTimezone: string): number {
  const config = TIMEZONE_CONFIGS[ianaTimezone];
  return config ? config.utcOffsetStandard : -5;
}

/**
 * Generates an end-to-end 30-day distribution plan.
 * Guarantees balanced multi-account allocation and anti-shadowban creative permutation.
 */
export function generateDistributionPlan(input: DistributionPlanInput): DistributionPlanResult {
  const {
    totalVideos,
    cadence,
    targetTimezone,
    preferredHour = 16,
    startDate = new Date(),
    connectedAccounts,
  } = input;

  if (connectedAccounts.length === 0) {
    throw new Error("Cannot generate distribution plan without at least one connected social account.");
  }

  const offsetHours = getUtcOffsetHours(targetTimezone);
  const slots: ScheduledSlot[] = [];
  const accountBreakdown: Record<string, { handle: string; nickname?: string | null; count: number }> = {};

  // Initialize breakdown counters
  connectedAccounts.forEach((acc) => {
    accountBreakdown[acc.id] = {
      handle: acc.accountHandle,
      nickname: acc.accountNickname,
      count: 0,
    };
  });

  const currentDate = new Date(startDate);
  // Normalize start date to start of day in UTC
  currentDate.setUTCHours(0, 0, 0, 0);

  let slotIndex = 0;
  let safetyDayCounter = 0;
  const MAX_DAYS_SCAN = 90; // Ensure we don't loop forever

  while (slots.length < totalVideos && safetyDayCounter < MAX_DAYS_SCAN) {
    // Current day of week in target timezone (approx UTC + offset)
    const dayOfWeek = currentDate.getUTCDay();

    if (isCadenceDay(dayOfWeek, cadence)) {
      // Determine how many posts on this day (e.g. if Growth 60 videos over 30 days = 2 per day)
      const postsToday = cadence === "daily_30" && totalVideos > 30 ? Math.ceil(totalVideos / 30) : 1;

      for (let p = 0; p < postsToday && slots.length < totalVideos; p++) {
        // Rotate accounts round-robin
        const accountIndex = slotIndex % connectedAccounts.length;
        const assignedAccount = connectedAccounts[accountIndex];
        if (!assignedAccount) continue;

        // Creative layer permutations: offset by accountIndex to ensure different accounts get different styles
        const hookObj = HOOK_ANGLES[(slotIndex + accountIndex) % HOOK_ANGLES.length] ?? HOOK_ANGLES[0];
        const voiceId = CREATOR_VOICE_ROTATION[(slotIndex + accountIndex) % CREATOR_VOICE_ROTATION.length] ?? CREATOR_VOICE_ROTATION[0];
        const subtitleStyle = SUBTITLE_STYLE_ROTATION[(slotIndex + accountIndex) % SUBTITLE_STYLE_ROTATION.length] ?? SUBTITLE_STYLE_ROTATION[0];

        // Stagger hours if multiple posts on same day (e.g., Growth: 12 PM & 6 PM; Scale: every 2 hours)
        let hourForPost = preferredHour;
        if (postsToday > 1 && p > 0) {
          const step = postsToday <= 2 ? 6 : Math.max(2, Math.floor(12 / (postsToday - 1)));
          hourForPost = (preferredHour + (p * step)) % 24;
        }

        // Calculate UTC scheduled timestamp
        // UTC = Local Hour - Offset
        // Example: 16:00 EST (UTC-5) -> 16 - (-5) = 21:00 UTC
        const utcHour = (hourForPost - offsetHours + 24) % 24;
        const scheduledUtc = new Date(currentDate);
        scheduledUtc.setUTCHours(utcHour, 0, 0, 0);

        // Human-readable local time label
        const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const monthsMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dayName = daysMap[dayOfWeek] ?? "Mon";
        const monthName = monthsMap[currentDate.getUTCMonth()] ?? "Jan";
        const dayNum = currentDate.getUTCDate();
        const ampm = hourForPost >= 12 ? "PM" : "AM";
        const displayHour = hourForPost % 12 === 0 ? 12 : hourForPost % 12;
        const tzAbbr = targetTimezone.includes("New_York") ? "EST" : targetTimezone.includes("Los_Angeles") ? "PST" : "Local";
        const localDisplayTime = `${dayName}, ${monthName} ${dayNum} @ ${displayHour}:00 ${ampm} ${tzAbbr}`;

        slots.push({
          slotIndex,
          utcScheduledFor: scheduledUtc,
          localDisplayTime,
          assignedAccount,
          hookAngle: hookObj.id,
          hookLabel: hookObj.label,
          voiceId,
          subtitleStyle,
          captionVariant: `${hookObj.promptPrefix} [AutoUGC Creative Layer]`,
        });

        const currentAccBreakdown = accountBreakdown[assignedAccount.id];
        if (currentAccBreakdown) {
          currentAccBreakdown.count += 1;
        }
        slotIndex++;
      }
    }

    // Advance to next day
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    safetyDayCounter++;
  }

  const firstDate = slots.length > 0 && slots[0] ? slots[0].utcScheduledFor : new Date();
  const lastDate = slots.length > 0 && slots[slots.length - 1] ? slots[slots.length - 1]!.utcScheduledFor : new Date();

  const cadenceNameMap: Record<CampaignCadence, string> = {
    mon_wed_fri: "Mon/Wed/Fri Drip",
    mon_wed_fri_sun: "Mon/Wed/Fri/Sun Drip",
    weekdays: "Weekdays Only",
    daily_30: "Daily 30-Day Blitz",
  };

  return {
    campaignName: `30-Day Autopilot (${cadenceNameMap[cadence]} - ${connectedAccounts.length} Account${connectedAccounts.length > 1 ? "s" : ""})`,
    cadence,
    targetTimezone,
    totalScheduled: slots.length,
    startDate: firstDate,
    endDate: lastDate,
    slots,
    accountBreakdown,
  };
}
