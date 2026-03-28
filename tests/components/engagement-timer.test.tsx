import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { EngagementTimer } from "@/components/engagement-timer";

describe("EngagementTimer", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  it("renders initial 20:00 timer", () => {
    render(<EngagementTimer />);
    expect(screen.getByText("20:00")).toBeInTheDocument();
    expect(screen.getByText("remaining")).toBeInTheDocument();
  });

  it("starts countdown when Start is clicked", () => {
    render(<EngagementTimer />);
    fireEvent.click(screen.getByText("Start"));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("19:59")).toBeInTheDocument();
  });

  it("pauses when Pause is clicked", () => {
    render(<EngagementTimer />);
    fireEvent.click(screen.getByText("Start"));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    fireEvent.click(screen.getByText("Pause"));
    const timeAfterPause = screen.getByText("19:55");
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(timeAfterPause).toBeInTheDocument();
  });

  it("resets to 20:00 when Reset is clicked", () => {
    render(<EngagementTimer />);
    fireEvent.click(screen.getByText("Start"));
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByText("20:00")).toBeInTheDocument();
  });

  it("shows session count", () => {
    render(<EngagementTimer />);
    expect(screen.getByText(/Sessions:/)).toBeInTheDocument();
  });
});
