export interface WordTimestamp {
  word: string;
  start: number; // In seconds
  end: number;   // In seconds
}

export interface VoicePersona {
  id: string;
  name: string;
  description: string;
  gender: "male" | "female";
  style: string;
}

export interface AudioSynthesisResult {
  voiceId: string;
  audioUrl: string;
  durationSeconds: number;
  words: WordTimestamp[];
}

export const CREATOR_VOICE_PRESETS: VoicePersona[] = [
  {
    id: "alex_casual_dtc",
    name: "Alex",
    description: "Casual 24-year-old DTC creator, relatable and conversational.",
    gender: "male",
    style: "Conversational & Authentic",
  },
  {
    id: "emma_high_energy",
    name: "Emma",
    description: "High-energy, fast-paced 22-year-old TikTok creator.",
    gender: "female",
    style: "Enthusiastic & Engaging",
  },
  {
    id: "marcus_authoritative",
    name: "Marcus",
    description: "Confident, crisp B2B SaaS founder and tech lead.",
    gender: "male",
    style: "Authoritative & Direct",
  },
  {
    id: "sophia_lifestyle",
    name: "Sophia",
    description: "Articulate, aesthetic lifestyle and beauty reviewer.",
    gender: "female",
    style: "Relatable & Warm",
  },
  {
    id: "liam_chill_tech",
    name: "Liam",
    description: "Chill, tech-savvy developer with dry delivery.",
    gender: "male",
    style: "Modern & Tech-Focused",
  },
  {
    id: "chloe_expressive",
    name: "Chloe",
    description: "Dynamic storyteller with natural comedic timing.",
    gender: "female",
    style: "Expressive & Viral",
  },
];
