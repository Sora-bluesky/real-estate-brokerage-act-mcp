import { describe, it, expect } from "vitest";
import { TsutatsuRegistry } from "../../src/lib/tsutatsu-registry.js";

describe("TsutatsuRegistry", () => {
  const registry = new TsutatsuRegistry();

  describe("getAll", () => {
    it("returns 5 tsutatsu presets", () => {
      const all = registry.getAll();
      expect(all).toHaveLength(5);
    });

    it("returns a defensive copy (different reference each call)", () => {
      const first = registry.getAll();
      const second = registry.getAll();
      expect(first).not.toBe(second);
    });

    it("all presets have required fields", () => {
      const all = registry.getAll();
      for (const preset of all) {
        expect(preset).toHaveProperty("title");
        expect(preset).toHaveProperty("abbrev");
        expect(preset).toHaveProperty("issuer");
        expect(preset).toHaveProperty("pdf_url");
        expect(typeof preset.title).toBe("string");
        expect(Array.isArray(preset.abbrev)).toBe(true);
        expect(typeof preset.issuer).toBe("string");
        expect(typeof preset.pdf_url).toBe("string");
      }
    });
  });

  describe("findByName", () => {
    it("finds preset by exact title match", () => {
      const result = registry.findByName(
        "宅地建物取引業者が宅地又は建物の売買等に関して受けることができる報酬の額",
      );
      expect(result).toBeDefined();
      expect(result!.title).toContain("報酬の額");
    });

    it("finds preset by abbreviation", () => {
      const result = registry.findByName("報酬額告示");
      expect(result).toBeDefined();
      expect(result!.title).toContain("報酬の額");
    });

    it("finds preset by another abbreviation", () => {
      const result = registry.findByName("原状回復ガイドライン");
      expect(result).toBeDefined();
      expect(result!.title).toContain("原状回復");
    });

    it("returns undefined for unknown names", () => {
      const result = registry.findByName("存在しない通達名");
      expect(result).toBeUndefined();
    });

    it("returns a match for empty string (partial match matches all titles)", () => {
      // Empty string is included in every title, so partial match returns the first preset
      const result = registry.findByName("");
      expect(result).toBeDefined();
    });
  });

  describe("search", () => {
    it("finds presets by keyword in title", () => {
      const results = registry.search("報酬");
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.some((p) => p.title.includes("報酬"))).toBe(true);
    });

    it("finds presets by keyword in abbreviation", () => {
      const results = registry.search("原状回復");
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(
        results.some(
          (p) =>
            p.title.includes("原状回復") ||
            p.abbrev.some((a) => a.includes("原状回復")),
        ),
      ).toBe(true);
    });

    it("returns empty array for unknown keyword", () => {
      const results = registry.search("絶対に存在しないキーワード");
      expect(results).toEqual([]);
    });

    it("finds presets by keyword 媒介", () => {
      const results = registry.search("媒介");
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(
        results.some(
          (p) =>
            p.title.includes("媒介") ||
            p.abbrev.some((a) => a.includes("媒介")),
        ),
      ).toBe(true);
    });
  });

  describe("findByName (additional presets)", () => {
    it("finds 解釈・運用の考え方 by abbreviation", () => {
      const result = registry.findByName("解釈・運用の考え方");
      expect(result).toBeDefined();
      expect(result!.title).toContain("解釈・運用の考え方");
    });

    it("finds 重説様式 by abbreviation", () => {
      const result = registry.findByName("重説様式");
      expect(result).toBeDefined();
      expect(result!.title).toContain("重要事項説明書");
    });
  });
});
