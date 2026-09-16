import { describe, expect, it, vi } from "vitest";

const getMock = vi.fn();

vi.mock("@/lib/api-client", () => ({
  publicApi: { get: (...args: unknown[]) => getMock(...args) },
}));

describe("public projects service", () => {
  it("returns the project list on success", async () => {
    getMock.mockResolvedValueOnce({ data: [{ id: 1, slug: "demo", name: "Demo" }] });
    const { getProjects } = await import("@/services/public/projects");

    const result = await getProjects();

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("demo");
  });

  it("propagates API errors so callers can decide how to handle them", async () => {
    getMock.mockRejectedValueOnce(new Error("Network Error"));
    const { getProjects } = await import("@/services/public/projects");

    await expect(getProjects()).rejects.toThrow("Network Error");
  });

  it("lets a caller degrade gracefully with .catch, matching page-level usage", async () => {
    getMock.mockRejectedValueOnce(new Error("Backend unavailable"));
    const { getProjects } = await import("@/services/public/projects");

    const result = await getProjects().catch(() => []);

    expect(result).toEqual([]);
  });
});
