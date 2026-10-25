import { synthesizeVoiceover } from "../src/lib/audio/ttsProvider";

async function runTests() {
  console.log("--- Running Audio Synthesis & Timestamp Unit Tests ---");

  const sampleScript = "Stop coding under harsh fluorescent lights in 2026. If you get headaches by 3 PM, your monitor setup is ruining your eyes.";
  const result = await synthesizeVoiceover(sampleScript, "alex_casual_dtc");

  console.log(`Synthesized ${result.words.length} words. Total Duration: ${result.durationSeconds}s`);

  if (result.words.length === 0) {
    console.error("✗ Failed: No words returned.");
    process.exit(1);
  }

  // Verify timestamps are monotonically increasing
  for (let i = 0; i < result.words.length; i++) {
    const w = result.words[i]!;
    if (w.start >= w.end) {
      console.error(`✗ Failed: Invalid word timestamp range for "${w.word}": ${w.start} >= ${w.end}`);
      process.exit(1);
    }
    if (i > 0) {
      const prev = result.words[i - 1]!;
      if (w.start < prev.start) {
        console.error(`✗ Failed: Non-monotonic timestamp at word "${w.word}"`);
        process.exit(1);
      }
    }
  }

  console.log("First 5 synchronized words:", result.words.slice(0, 5));
  console.log("✓ All Audio Synthesis tests passed successfully!");
}

runTests();
