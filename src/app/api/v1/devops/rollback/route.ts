import { NextRequest, NextResponse } from "next/server";
import {
  releaseRegistry,
  evaluateCanaryHealth,
  type DeploymentEnvironment,
  type CanaryMetrics,
} from "@/lib/devops/rollbackManager";
import { logger } from "@/lib/observability/logger";

function isAuthorizedDevOpsRequest(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const configuredSecret = process.env.DEVOPS_ROLLBACK_API_KEY || "sec_devops_CHANGE_ME_KEY";

  // Allow in test/development or if valid Bearer token matches
  if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
    return true;
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  return token === configuredSecret;
}

export async function GET(req: NextRequest) {
  try {
    if (!isAuthorizedDevOpsRequest(req)) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing DevOps credentials" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const envParam = (searchParams.get("env") as DeploymentEnvironment) || "production";

    const activeRelease = releaseRegistry.getActiveRelease(envParam);
    const history = releaseRegistry.getHistory(envParam);

    return NextResponse.json({
      environment: envParam,
      activeRelease,
      historyCount: history.length,
      history,
    });
  } catch (err: unknown) {
    const error = err as Error;
    logger.error("Failed to query DevOps releases", { error: error.message });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorizedDevOpsRequest(req)) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing DevOps credentials" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action, environment = "production", version, commitSha, canaryMetrics, targetReleaseId, reason } = body;

    const env = environment as DeploymentEnvironment;

    if (action === "evaluate_canary") {
      const evaluation = evaluateCanaryHealth(canaryMetrics as CanaryMetrics);
      return NextResponse.json({
        evaluation,
        environment: env,
      });
    }

    if (action === "register") {
      if (!version || !commitSha) {
        return NextResponse.json(
          { error: "Missing required fields: version, commitSha" },
          { status: 400 }
        );
      }

      const registered = releaseRegistry.registerRelease({
        version,
        commitSha,
        environment: env,
        deployedBy: body.deployedBy || "ci-cd-runner",
        canaryMetrics,
      });

      logger.info(`New release deployed in ${env}`, { releaseId: registered.id, version });
      return NextResponse.json({ success: true, release: registered });
    }

    if (action === "rollback") {
      const rollbackResult = releaseRegistry.executeRollback({
        environment: env,
        targetReleaseId,
        reason: reason || "Emergency DevOps Rollback Invocation",
        triggeredBy: body.triggeredBy || "devops-engineer",
      });

      logger.warn(`Zero-downtime rollback executed for ${env}`, {
        rollbackId: rollbackResult.rollbackId,
        targetVersion: rollbackResult.targetVersion,
      });

      return NextResponse.json({
        success: true,
        rollback: rollbackResult,
      });
    }

    return NextResponse.json(
      { error: "Unsupported DevOps action. Use: 'register', 'rollback', or 'evaluate_canary'" },
      { status: 400 }
    );
  } catch (err: unknown) {
    const error = err as Error;
    logger.error("DevOps rollback handler exception", { error: error.message });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
