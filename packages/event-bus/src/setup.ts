import { describe, it, expect } from "vitest";

describe("EventBus", () => {
  it("should be importable", async () => {
    const { default: eventBus } = await import("./index");
    expect(eventBus).toBeDefined();
  });
});
