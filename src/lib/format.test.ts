import { describe, expect, it } from "vitest";
import { formatMoney, formatUptime } from "@/lib/format";

describe("format", () => {
  it("formats BRL from cents", () => {
    const result = formatMoney(125000, "BRL");
    expect(result).toContain("1.250");
  });

  it("formats uptime", () => {
    expect(formatUptime(90)).toBe("1m 30s");
    expect(formatUptime(3700)).toBe("1h 1m");
  });
});
