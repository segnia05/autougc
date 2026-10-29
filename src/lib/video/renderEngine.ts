import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import { UgcAdCompositionProps } from "@/remotion/types";

export interface RenderResult {
  outputPath: string;
  publicUrl: string;
  durationSeconds: number;
}

export async function renderUgcVideo(
  videoId: string,
  inputProps: UgcAdCompositionProps,
  options?: { durationInFrames?: number }
): Promise<RenderResult> {
  const outputDir = path.join(process.cwd(), "public/renders");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${videoId}.mp4`);
  const framesToRender = options?.durationInFrames || 90; // ~3 seconds for SaaS responsiveness

  const scriptPath = path.join(process.cwd(), "scripts/renderUgcCli.mjs");
  const payload = JSON.stringify({
    videoId,
    inputProps,
    framesToRender,
  });

  return new Promise((resolve, reject) => {
    const child = spawn("node", [scriptPath, payload], {
      cwd: process.cwd(),
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        try {
          const lines = stdout.trim().split("\n");
          const lastLine = lines[lines.length - 1];
          if (lastLine) {
            const result = JSON.parse(lastLine);
            if (result.success) {
              resolve({
                outputPath: result.outputPath,
                publicUrl: result.publicUrl,
                durationSeconds: result.durationSeconds,
              });
              return;
            }
          }
        } catch {
          if (fs.existsSync(outputPath)) {
            resolve({
              outputPath,
              publicUrl: `/renders/${videoId}.mp4`,
              durationSeconds: Number((framesToRender / 30).toFixed(1)),
            });
            return;
          }
        }
      }

      if (fs.existsSync(outputPath)) {
        resolve({
          outputPath,
          publicUrl: `/renders/${videoId}.mp4`,
          durationSeconds: Number((framesToRender / 30).toFixed(1)),
        });
      } else {
        reject(
          new Error(
            `Render process exited with code ${code}: ${stderr || stdout || "Unknown error"}`
          )
        );
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}
