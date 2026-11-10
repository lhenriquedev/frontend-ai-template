import { describe, expect, it } from "vitest";
import { parseEnv } from "@app/env-schema";

describe("parseEnv", () => {
  it("accepts mock mode without an API base", () => {
    expect(parseEnv({ VITE_API_MODE: "mock", VITE_API_BASE: "" })).toEqual({ VITE_API_MODE: "mock" });
  });

  it("accepts http mode with an absolute API base", () => {
    expect(parseEnv({ VITE_API_MODE: "http", VITE_API_BASE: "https://api.example.com" })).toEqual({
      VITE_API_MODE: "http",
      VITE_API_BASE: "https://api.example.com",
    });
  });

  it("rejects http mode without an API base", () => {
    expect(() => parseEnv({ VITE_API_MODE: "http" })).toThrow("VITE_API_BASE is required when VITE_API_MODE=http");
  });

  it("rejects a missing API mode", () => {
    expect(() => parseEnv({})).toThrow("Invalid VITE_* environment");
  });
});
