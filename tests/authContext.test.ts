import { getAuthContext } from "../src/lib/auth/getAuthContext";

async function runAuthTests() {
  console.log("=== Running Multi-Tenant Auth Context Unit Tests ===");

  // 1. Unauthenticated request returns null
  const unauthContext = await getAuthContext();
  if (unauthContext !== null) {
    console.error("✗ Failed: Unauthenticated request should return null, got:", unauthContext);
    process.exit(1);
  }
  console.log("✓ Test 1 Passed: Unauthenticated request correctly rejected (null)");

  // 2. Personal user request resolves personal workspace
  const mockUserReq = new Request("https://autougc.ai/api/v1/videos", {
    headers: {
      "x-user-id": "user_prod_tester_01",
    },
  });

  const userContext = await getAuthContext(mockUserReq);
  if (!userContext || userContext.userId !== "user_prod_tester_01") {
    console.error("✗ Failed to resolve personal user context:", userContext);
    process.exit(1);
  }
  if (!userContext.orgId) {
    console.error("✗ Failed: User context missing orgId:", userContext);
    process.exit(1);
  }
  console.log(`✓ Test 2 Passed: Personal user context resolved (Org: ${userContext.orgId}, Role: ${userContext.role})`);

  // 3. Organization member request resolves explicit org
  const mockOrgReq = new Request("https://autougc.ai/api/v1/videos", {
    headers: {
      "x-user-id": "user_prod_tester_02",
      "x-organization-id": "org_enterprise_lumina",
    },
  });

  const orgContext = await getAuthContext(mockOrgReq);
  if (!orgContext || orgContext.orgId !== "org_enterprise_lumina") {
    console.error("✗ Failed to resolve explicit organization context:", orgContext);
    process.exit(1);
  }
  console.log("✓ Test 3 Passed: Explicit Clerk Organization context resolved");

  // 4. Tenant isolation: verify user_prod_tester_01 and user_prod_tester_03 get isolated orgs
  const mockUserReq2 = new Request("https://autougc.ai/api/v1/videos", {
    headers: {
      "x-user-id": "user_prod_tester_03",
    },
  });

  const userContext2 = await getAuthContext(mockUserReq2);
  if (userContext.orgId === userContext2?.orgId) {
    console.error("✗ Tenant isolation failure: Two distinct users mapped to the same orgId!");
    process.exit(1);
  }
  console.log("✓ Test 4 Passed: Multi-tenant workspace isolation verified");

  console.log("=== ALL AUTH CONTEXT TESTS PASSED CLEANLY! ===");
}

runAuthTests().catch((err) => {
  console.error("Auth test execution failed:", err);
  process.exit(1);
});
