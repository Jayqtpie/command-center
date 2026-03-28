import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GoalTracker } from "@/components/goal-tracker";

describe("GoalTracker", () => {
  it("renders platform name, target, and percentage", () => {
    render(
      <GoalTracker
        platform="Instagram"
        current={12847}
        target={25000}
        label="25K"
      />
    );
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("25K")).toBeInTheDocument();
    expect(screen.getByText("51%")).toBeInTheDocument();
  });

  it("caps percentage at 100%", () => {
    render(
      <GoalTracker
        platform="TikTok"
        current={60000}
        target={50000}
        label="50K"
      />
    );
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("renders progress bar with correct width", () => {
    const { container } = render(
      <GoalTracker
        platform="YouTube"
        current={5000}
        target={10000}
        label="10K"
      />
    );
    const progressBar = container.querySelector("[data-testid='progress-fill']");
    expect(progressBar).toHaveStyle({ width: "50%" });
  });
});
