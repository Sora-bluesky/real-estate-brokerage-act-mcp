import { describe, it, expect } from "vitest";
import { LawRegistry } from "../../src/lib/law-registry.js";

describe("LawRegistry", () => {
  const registry = new LawRegistry();

  describe("findByName", () => {
    it("finds a law by exact title", () => {
      const result = registry.findByName("宅地建物取引業法");
      expect(result).toBeDefined();
      expect(result!.title).toBe("宅地建物取引業法");
    });

    it("finds a law by abbreviation", () => {
      const result = registry.findByName("宅建業法");
      expect(result).toBeDefined();
      expect(result!.title).toBe("宅地建物取引業法");
    });

    it("finds a law by another abbreviation variant", () => {
      const result = registry.findByName("都計法");
      expect(result).toBeDefined();
      expect(result!.title).toBe("都市計画法");
    });

    it("finds a law by partial match when no exact or abbreviation match", () => {
      const result = registry.findByName("借地借家");
      expect(result).toBeDefined();
      expect(result!.title).toContain("借地借家");
    });

    it("returns undefined for an unknown law name", () => {
      const result = registry.findByName("存在しない法律");
      expect(result).toBeUndefined();
    });
  });

  describe("search", () => {
    it("returns matching aliases for a keyword in titles", () => {
      const results = registry.search("宅地建物");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((a) => a.title === "宅地建物取引業法")).toBe(true);
    });

    it("returns matching aliases for a keyword in abbreviations", () => {
      const results = registry.search("宅建業");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((a) => a.title === "宅地建物取引業法")).toBe(true);
    });

    it("returns matching aliases for a keyword in group", () => {
      const results = registry.search("契約・民事");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((a) => a.group.includes("契約・民事"))).toBe(true);
    });

    it("returns an empty array when no aliases match", () => {
      const results = registry.search("ランダムなキーワード");
      expect(results).toEqual([]);
    });
  });

  describe("getByGroup", () => {
    it("returns aliases belonging to a specific group", () => {
      const results = registry.getByGroup("コア（宅建業）");
      expect(results.length).toBeGreaterThan(0);
      for (const alias of results) {
        expect(alias.group).toContain("コア（宅建業）");
      }
    });

    it("includes expected laws in コア（宅建業） group", () => {
      const results = registry.getByGroup("コア（宅建業）");
      const titles = results.map((a) => a.title);
      expect(titles).toContain("宅地建物取引業法");
      expect(titles).toContain("宅地建物取引業法施行令");
      expect(titles).toContain("宅地建物取引業法施行規則");
    });

    it("includes 民法 in 契約・民事 group", () => {
      const results = registry.getByGroup("契約・民事");
      const titles = results.map((a) => a.title);
      expect(titles).toContain("民法");
    });

    it("returns an empty array for a non-existent group", () => {
      const results = registry.getByGroup("99章");
      expect(results).toEqual([]);
    });
  });

  describe("getAll", () => {
    it("returns all aliases", () => {
      const all = registry.getAll();
      expect(all.length).toBeGreaterThan(0);
    });

    it("returns a defensive copy (modifying result does not affect registry)", () => {
      const first = registry.getAll();
      const originalLength = first.length;
      first.pop();
      const second = registry.getAll();
      expect(second.length).toBe(originalLength);
    });
  });

  describe("alias data integrity", () => {
    it("contains at least 60 aliases", () => {
      const all = registry.getAll();
      expect(all.length).toBeGreaterThanOrEqual(60);
    });

    it("has no duplicate titles", () => {
      const all = registry.getAll();
      const titles = all.map((a) => a.title);
      const unique = new Set(titles);
      expect(unique.size).toBe(titles.length);
    });

    it("covers all major groups", () => {
      const expectedGroups = [
        "コア（宅建業）",
        "契約・民事",
        "重説・法令上の制限（都市計画）",
        "重説・法令上の制限（建築）",
        "重説・法令上の制限（防災・河川）",
        "重説・法令上の制限（環境・景観）",
        "重説・法令上の制限（農地・土地）",
        "重説・法令上の制限（道路・交通）",
        "重説・法令上の制限（その他）",
        "マンション関連",
        "住宅品質・瑕疵",
        "賃貸管理",
        "コンプライアンス",
      ];
      for (const group of expectedGroups) {
        const results = registry.getByGroup(group);
        expect(results.length).toBeGreaterThan(0);
      }
    });

    it("all aliases have non-empty abbrev", () => {
      const all = registry.getAll();
      for (const alias of all) {
        expect(alias.abbrev.length).toBeGreaterThan(0);
      }
    });

    it("finds newly added laws by name", () => {
      expect(registry.findByName("宅建業法")).toBeDefined();
      expect(registry.findByName("犯収法")).toBeDefined();
      expect(registry.findByName("景品表示法")).toBeDefined();
      expect(registry.findByName("盛土規制法")).toBeDefined();
    });
  });
});
