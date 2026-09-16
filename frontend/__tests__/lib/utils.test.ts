import { describe, expect, it } from "vitest";
import { resolveMediaUrl, formatDate } from "@/lib/utils";

describe("resolveMediaUrl", () => {
  it("returns an empty string for null/undefined", () => {
    expect(resolveMediaUrl(null)).toBe("");
    expect(resolveMediaUrl(undefined)).toBe("");
  });

  it("passes absolute URLs through unchanged", () => {
    expect(resolveMediaUrl("https://cdn.example.com/logo.png")).toBe(
      "https://cdn.example.com/logo.png",
    );
  });

  it("prefixes backend-uploaded paths with the API base URL", () => {
    expect(resolveMediaUrl("/uploads/team/abc.jpg")).toBe(
      "http://localhost:8080/uploads/team/abc.jpg",
    );
  });

  it("leaves frontend-static placeholder paths untouched", () => {
    expect(resolveMediaUrl("/images/team/placeholder.svg")).toBe("/images/team/placeholder.svg");
  });
});

describe("formatDate", () => {
  it("returns an empty string for a missing date", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate(undefined)).toBe("");
  });

  it("formats an ISO date string", () => {
    expect(formatDate("2025-11-10")).toContain("2025");
  });
});
