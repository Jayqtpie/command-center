import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EngagementChecklist } from "@/components/engagement-checklist";

const defaultItems = [
  { id: "1", text: "Comment on 5 Reels in your niche" },
  { id: "2", text: "Reply to 3 Stories from peers" },
  { id: "3", text: "Like 10 posts from hashtag feed" },
];

describe("EngagementChecklist", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders all checklist items", () => {
    render(<EngagementChecklist items={defaultItems} />);
    expect(screen.getByText("Comment on 5 Reels in your niche")).toBeInTheDocument();
    expect(screen.getByText("Reply to 3 Stories from peers")).toBeInTheDocument();
    expect(screen.getByText("Like 10 posts from hashtag feed")).toBeInTheDocument();
  });

  it("shows progress counter", () => {
    render(<EngagementChecklist items={defaultItems} />);
    expect(screen.getByText("0 / 3")).toBeInTheDocument();
  });

  it("toggles item on click and updates counter", () => {
    render(<EngagementChecklist items={defaultItems} />);
    fireEvent.click(screen.getByText("Comment on 5 Reels in your niche"));
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("un-toggles item on second click", () => {
    render(<EngagementChecklist items={defaultItems} />);
    fireEvent.click(screen.getByText("Comment on 5 Reels in your niche"));
    fireEvent.click(screen.getByText("Comment on 5 Reels in your niche"));
    expect(screen.getByText("0 / 3")).toBeInTheDocument();
  });
});
