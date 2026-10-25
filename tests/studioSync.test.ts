import { synthesizeVoiceover } from "../src/lib/audio/ttsProvider";
import { BACKGROUND_TRACKS } from "../src/components/studio/MusicPicker";

async function runStudioTests() {
  console.log("--- Running Studio Dynamic Sync & Audio Ducking Unit Tests ---");

  // 1. Verify music background presets
  if (BACKGROUND_TRACKS.length < 4) {
    console.error("✗ Failed: Not enough background tracks registered.");
    process.exit(1);
  }
  console.log(`✓ Verified ${BACKGROUND_TRACKS.length} background audio presets available.`);

  // 2. Test dynamic script edits and word synchronization
  const hook = "Stop wasting $500 a month on UGC agencies in 2026.";
  const body = "AutoUGC turns any URL into a high-converting vertical ad in 15 seconds flat.";
  const cta = "Try it free today.";

  const fullText = `${hook} ${body} ${cta}`;
  const audioSync = await synthesizeVoiceover(fullText, "alex_casual_dtc");

  if (!audioSync.words || audioSync.words.length === 0) {
    console.error("✗ Failed: Zero words returned from synthesis.");
    process.exit(1);
  }

  // Check first word and last word
  const firstWord = audioSync.words[0];
  const lastWord = audioSync.words[audioSync.words.length - 1];

  if (firstWord.word !== "Stop") {
    console.error(`✗ Failed: Expected first word 'Stop', got '${firstWord.word}'`);
    process.exit(1);
  }

  if (lastWord.word !== "today") {
    console.error(`✗ Failed: Expected last word 'today', got '${lastWord.word}'`);
    process.exit(1);
  }

  console.log(`✓ Synchronized ${audioSync.words.length} words for real-time Remotion player canvas.`);
  console.log(`✓ Total estimated ad duration: ${audioSync.durationSeconds}s.`);
  console.log("✓ All Studio synchronization tests passed cleanly!");
}

runStudioTests();
