import { z } from "zod";

const envSchema = z.object({
  VITE_APP_ENV: z.enum(["develop", "homolog", "production"]),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(source);
  if (result.success) return result.data;
  const missing = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Invalid VITE_* environment:\n${missing.join("\n")}`);
}
