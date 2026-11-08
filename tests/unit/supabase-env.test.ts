import { describe, expect, it } from "vitest";

import { parseSupabasePublicEnv } from "@/lib/supabase/env";

describe("parseSupabasePublicEnv", () => {
  it("returns the URL without trailing slashes and the publishable key", () => {
    expect(
      parseSupabasePublicEnv(
        "https://credo-store.supabase.co/",
        "sb_publishable_example",
      ),
    ).toEqual({
      url: "https://credo-store.supabase.co",
      publishableKey: "sb_publishable_example",
    });
  });

  it("allows the default local Supabase loopback URL", () => {
    expect(
      parseSupabasePublicEnv(
        "http://127.0.0.1:54321",
        "sb_publishable_example",
      ).url,
    ).toBe("http://127.0.0.1:54321");
  });

  it("allows localhost HTTP for local development", () => {
    expect(
      parseSupabasePublicEnv(
        "http://localhost:54321",
        "sb_publishable_example",
      ).url,
    ).toBe("http://localhost:54321");
  });

  it("rejects missing configuration", () => {
    expect(() => parseSupabasePublicEnv(undefined, undefined)).toThrow(
      "Supabase is not configured",
    );
  });

  it("rejects malformed URLs", () => {
    expect(() =>
      parseSupabasePublicEnv("not-a-url", "sb_publishable_example"),
    ).toThrow("valid absolute URL");
  });

  it("rejects non-HTTPS remote URLs", () => {
    expect(() =>
      parseSupabasePublicEnv(
        "http://supabase.example.com",
        "sb_publishable_example",
      ),
    ).toThrow("must use HTTPS");
  });
});
