import { describe, expect, it } from "vitest";
import { isTokenValid } from "@/lib/auth";

function base64url(input: object): string {
  return Buffer.from(JSON.stringify(input)).toString("base64url");
}

function fakeJwt(exp: number): string {
  const header = base64url({ alg: "HS256", typ: "JWT" });
  const payload = base64url({ sub: "admin@test.local", role: "ROLE_ADMIN", exp });
  return `${header}.${payload}.fake-signature`;
}

describe("isTokenValid", () => {
  it("returns false when no token is provided", () => {
    expect(isTokenValid(null)).toBe(false);
  });

  it("returns false for a malformed token", () => {
    expect(isTokenValid("not-a-jwt")).toBe(false);
  });

  it("returns false for an expired token", () => {
    const expired = fakeJwt(Math.floor(Date.now() / 1000) - 3600);
    expect(isTokenValid(expired)).toBe(false);
  });

  it("returns true for a token that has not expired yet", () => {
    const valid = fakeJwt(Math.floor(Date.now() / 1000) + 3600);
    expect(isTokenValid(valid)).toBe(true);
  });
});
