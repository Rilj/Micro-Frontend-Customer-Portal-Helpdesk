import { describe, it, expect } from "vitest";
import eventBus from "./index";

describe("event-bus", () => {
  it("should emit and receive events", () => {
    const handler = eventBus.on("theme:change", (data) => {
      expect(data.mode).toBe("dark");
    });
    eventBus.emit("theme:change", { mode: "dark" });
    handler();
  });

  it("should support multiple subscribers", () => {
    let count = 0;
    const unsub1 = eventBus.on("auth", () => count++);
    const unsub2 = eventBus.on("auth", () => count++);
    eventBus.emit("auth", { user: null });
    expect(count).toBe(2);
    unsub1();
    unsub2();
  });

  it("should unsubscribe correctly", () => {
    let called = false;
    const unsub = eventBus.on("notification:show", () => { called = true; });
    unsub();
    eventBus.emit("notification:show", { title: "T", message: "M", type: "info" });
    expect(called).toBe(false);
  });
});
