import { describe, expect, it } from "vitest";
import { parseEnv } from "@app/env-schema";

describe("parseEnv", () => {
  it.each(["develop", "homolog", "production"])("accepts VITE_APP_ENV=%s", (appEnv) => {
    expect(parseEnv({ VITE_APP_ENV: appEnv })).toEqual({ VITE_APP_ENV: appEnv });
  });

  it("drops variables outside the schema", () => {
    expect(parseEnv({ VITE_APP_ENV: "develop", VITE_API_MODE: "mock" })).toEqual({ VITE_APP_ENV: "develop" });
  });

  it("rejects a missing VITE_APP_ENV", () => {
    expect(() => parseEnv({})).toThrow(/Invalid VITE_\* environment:\nVITE_APP_ENV/);
  });

  it("rejects an empty VITE_APP_ENV", () => {
    expect(() => parseEnv({ VITE_APP_ENV: "" })).toThrow(/Invalid VITE_\* environment:\nVITE_APP_ENV/);
  });

  it("rejects a VITE_APP_ENV outside the known environments", () => {
    expect(() => parseEnv({ VITE_APP_ENV: "staging" })).toThrow(/Invalid VITE_\* environment:\nVITE_APP_ENV/);
  });
});
