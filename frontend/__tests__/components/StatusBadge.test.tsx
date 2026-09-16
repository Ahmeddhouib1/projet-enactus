import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge from "@/components/public/StatusBadge";

describe("StatusBadge", () => {
  it("renders a human-readable label for each status", () => {
    render(<StatusBadge status="IN_PROGRESS" />);
    expect(screen.getByText("In Progress")).toBeDefined();
  });

  it("renders the Archived label", () => {
    render(<StatusBadge status="ARCHIVED" />);
    expect(screen.getByText("Archived")).toBeDefined();
  });
});
