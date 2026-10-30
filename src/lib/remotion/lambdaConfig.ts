/**
 * Enterprise Remotion Lambda Configuration & Deployment Scaffold.
 *
 * For high-volume production deployments (>1,000 videos/day), Remotion Lambda
 * delegates rendering across 200+ AWS Lambda functions in parallel, achieving
 * sub-30s renders for full 60s 1080p compositions without touching server CPU.
 */

export interface RemotionLambdaConfig {
  region: string;
  functionName: string;
  serveUrl: string;
  compositionId: string;
  memorySizeInMb: number;
  timeoutInSeconds: number;
}

export const DEFAULT_LAMBDA_CONFIG: RemotionLambdaConfig = {
  region: process.env.REMOTION_AWS_REGION || "us-east-1",
  functionName: process.env.REMOTION_FUNCTION_NAME || "remotion-render-arm64",
  serveUrl: process.env.REMOTION_SERVE_URL || "",
  compositionId: "UgcAdComposition",
  memorySizeInMb: 3008,
  timeoutInSeconds: 240,
};

export function isLambdaConfigured(): boolean {
  return Boolean(
    process.env.REMOTION_AWS_ACCESS_KEY_ID &&
      process.env.REMOTION_AWS_SECRET_ACCESS_KEY &&
      process.env.REMOTION_SERVE_URL
  );
}

