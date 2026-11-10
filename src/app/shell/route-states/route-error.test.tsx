import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RouteError } from "./route-error";

const mocks = vi.hoisted(() => ({
  invalidate: vi.fn(),
  queryErrorBoundary: { reset: vi.fn() },
}));

vi.mock("@tanstack/react-router", () => ({ useRouter: () => ({ invalidate: mocks.invalidate }) }));
vi.mock("@tanstack/react-query", () => ({ useQueryErrorResetBoundary: () => mocks.queryErrorBoundary }));

describe("RouteError", () => {
  beforeEach(() => {
    mocks.invalidate.mockReset();
    mocks.queryErrorBoundary.reset.mockReset();
  });

  it("clears the query error state when it shows, so the next attempt fetches again", () => {
    render(<RouteError error={new Error("boom")} reset={vi.fn()} />);

    expect(mocks.queryErrorBoundary.reset).toHaveBeenCalledTimes(1);
  });

  it("retries by resetting the route and reloading its data", () => {
    const reset = vi.fn();
    render(<RouteError error={new Error("boom")} reset={reset} />);

    fireEvent.click(screen.getByRole("button", { name: "Tentar de novo" }));

    expect(reset).toHaveBeenCalledTimes(1);
    expect(mocks.invalidate).toHaveBeenCalledTimes(1);
  });

  it("does not retry before the user asks", () => {
    const reset = vi.fn();
    render(<RouteError error={new Error("boom")} reset={reset} />);

    expect(reset).not.toHaveBeenCalled();
    expect(mocks.invalidate).not.toHaveBeenCalled();
  });
});
