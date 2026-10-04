import { describe, it, expect } from "vitest";

describe("utils", () => {
  it("should merge class names", async () => {
    const { cn } = await import("./utils");
    expect(cn("px-2", "py-1")).toContain("px-2");
    expect(cn("px-2", "px-4")).toContain("px-4");
  });

  it("should handle undefined values", async () => {
    const { cn } = await import("./utils");
    const result = cn("px-2", undefined, "py-1");
    expect(result).toContain("px-2");
    expect(result).toContain("py-1");
  });

  it("should merge conflicting classes", async () => {
    const { cn } = await import("./utils");
    const result = cn("px-2", "px-4");
    expect(result).toContain("px-4");
    expect(result).not.toContain("px-2");
  });
});
