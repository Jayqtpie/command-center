import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricsRow } from "@/components/metrics-row";

describe("MetricsRow", () => {
  it("renders all metrics with labels and values", () => {
    render(
      <MetricsRow
        items={[
          { label: "Instagram", value: "12,847", change: "+103 this month" },
          { label: "YouTube", value: "8,421", change: "+67 this month" },
        ]}
      />
    );
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("12,847")).toBeInTheDocument();
    expect(screen.getByText("+103 this month")).toBeInTheDocument();
    expect(screen.getByText("YouTube")).toBeInTheDocument();
    expect(screen.getByText("8,421")).toBeInTheDocument();
  });

  it("renders without change text when not provided", () => {
    render(
      <MetricsRow items={[{ label: "Reach", value: "163,243" }]} />
    );
    expect(screen.getByText("Reach")).toBeInTheDocument();
    expect(screen.getByText("163,243")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <MetricsRow
        items={[
          { label: "Reach", value: "163,243", subtitle: "All platforms" },
        ]}
      />
    );
    expect(screen.getByText("All platforms")).toBeInTheDocument();
  });
});
