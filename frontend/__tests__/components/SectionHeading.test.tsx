import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SectionHeading from "@/components/public/SectionHeading";

describe("SectionHeading", () => {
  it("renders the title, eyebrow and description", () => {
    render(
      <SectionHeading eyebrow="Our work" title="Featured Projects" description="Real ventures." />,
    );

    expect(screen.getByRole("heading", { name: "Featured Projects" })).toBeDefined();
    expect(screen.getByText("Our work")).toBeDefined();
    expect(screen.getByText("Real ventures.")).toBeDefined();
  });

  it("renders without eyebrow or description", () => {
    render(<SectionHeading title="Partners" />);
    expect(screen.getByRole("heading", { name: "Partners" })).toBeDefined();
  });
});
