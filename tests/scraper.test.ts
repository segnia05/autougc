import { validateSafeUrl } from "../src/lib/scraper/ssrfFilter";

async function runTests() {
  console.log("--- Running SSRF Filter Tests ---");

  const testCases = [
    { url: "http://127.0.0.1/admin", shouldPass: false },
    { url: "http://localhost:3000", shouldPass: false },
    { url: "http://169.254.169.254/latest/meta-data", shouldPass: false },
    { url: "http://192.168.1.1/router", shouldPass: false },
    { url: "http://10.0.0.1/internal", shouldPass: false },
    { url: "https://stripe.com", shouldPass: true },
    { url: "https://shopify.com/products/example", shouldPass: true },
  ];

  let passed = 0;
  for (const tc of testCases) {
    const result = validateSafeUrl(tc.url);
    if (result.isValid === tc.shouldPass) {
      console.log(`✓ Passed: ${tc.url} -> isValid: ${result.isValid}`);
      passed++;
    } else {
      console.error(`✗ Failed: ${tc.url} expected ${tc.shouldPass}, got ${result.isValid} (${result.error})`);
    }
  }

  console.log(`\nResults: ${passed}/${testCases.length} tests passed.`);
  if (passed !== testCases.length) {
    process.exit(1);
  }
}

runTests();
