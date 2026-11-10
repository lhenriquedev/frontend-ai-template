import { z } from "zod";

const appEnv = z.enum(["develop", "homolog", "production"]).optional();

const envSchema = z.discriminatedUnion("VITE_API_MODE", [
  z.object({
    VITE_API_MODE: z.literal("mock"),
    VITE_API_BASE: z.string().optional(),
    VITE_APP_ENV: appEnv,
  }),
  z.object({
    VITE_API_MODE: z.literal("http"),
    VITE_API_BASE: z.url({
      error: (issue) =>
        issue.input === undefined
          ? "VITE_API_BASE is required when VITE_API_MODE=http"
          : "VITE_API_BASE must be an absolute URL",
    }),
    VITE_APP_ENV: appEnv,
  }),
]);

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: Record<string, string | undefined>): Env {
  // workaround: .env.example ships `KEY=` placeholders; loadEnv yields "" for those, which must count as unset
  const result = envSchema.safeParse(Object.fromEntries(Object.entries(source).filter(([, value]) => value !== "")));
  if (result.success) return result.data;
  const missing = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Invalid VITE_* environment:\n${missing.join("\n")}`);
}
