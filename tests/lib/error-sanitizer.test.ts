import { describe, it, expect } from "vitest";
import { sanitizeErrorMessage } from "../../src/lib/error-sanitizer.js";
import {
  EgovApiError,
  LawNotFoundError,
  ArticleNotFoundError,
  KokujiNotFoundError,
} from "../../src/lib/errors.js";

describe("sanitizeErrorMessage", () => {
  describe("known safe errors pass through", () => {
    it("LawNotFoundError message is preserved", () => {
      const err = new LawNotFoundError("建築基準法");
      expect(sanitizeErrorMessage(err)).toBe(
        "法令が見つかりません: 建築基準法",
      );
    });

    it("ArticleNotFoundError message is preserved", () => {
      const err = new ArticleNotFoundError("第20条", "建築基準法");
      expect(sanitizeErrorMessage(err)).toBe(
        "建築基準法の第20条が見つかりません",
      );
    });

    it("KokujiNotFoundError message is preserved", () => {
      const err = new KokujiNotFoundError("耐火構造告示");
      expect(sanitizeErrorMessage(err)).toBe(
        "告示が見つかりません: 耐火構造告示",
      );
    });
  });

  describe("EgovApiError gets user-friendly message", () => {
    it("includes HTTP status code when available", () => {
      const err = new EgovApiError("some internal detail", 500, "/laws");
      const result = sanitizeErrorMessage(err);
      expect(result).toContain("e-Gov法令API");
      expect(result).toContain("HTTP 500");
      expect(result).not.toContain("/laws");
      expect(result).not.toContain("some internal detail");
    });

    it("omits status code when not available", () => {
      const err = new EgovApiError("network timeout");
      const result = sanitizeErrorMessage(err);
      expect(result).toContain("e-Gov法令API");
      expect(result).not.toContain("network timeout");
    });
  });

  describe("URL stripping", () => {
    it("strips https URLs from error messages", () => {
      const err = new Error(
        "PDF取得に失敗しました: https://www.mlit.go.jp/content/001234.pdf",
      );
      const result = sanitizeErrorMessage(err);
      expect(result).not.toContain("https://");
      expect(result).not.toContain("mlit.go.jp");
      expect(result).toContain("[URL]");
    });

    it("strips http URLs from error messages", () => {
      const err = new Error("Request failed: http://example.com/api/v1/data");
      const result = sanitizeErrorMessage(err);
      expect(result).not.toContain("http://");
      expect(result).not.toContain("example.com");
    });

    it("strips multiple URLs", () => {
      const err = new Error(
        "Redirect from https://a.com to https://b.com failed",
      );
      const result = sanitizeErrorMessage(err);
      expect(result).not.toContain("a.com");
      expect(result).not.toContain("b.com");
    });
  });

  describe("file path stripping", () => {
    it("strips Windows paths", () => {
      const err = new Error(
        "ENOENT: no such file C:\\Users\\admin\\secret\\config.json",
      );
      const result = sanitizeErrorMessage(err);
      expect(result).not.toContain("C:\\Users");
      expect(result).not.toContain("config.json");
    });

    it("strips Unix paths", () => {
      const err = new Error("Cannot read /tmp/cache/data.json");
      const result = sanitizeErrorMessage(err);
      expect(result).not.toContain("/tmp/cache");
      expect(result).not.toContain("data.json");
    });
  });

  describe("fallback for empty/meaningless results", () => {
    it("returns generic message when error is just a URL", () => {
      const err = new Error("https://internal-api.example.com/secret");
      const result = sanitizeErrorMessage(err);
      expect(result).toContain("予期しないエラー");
      expect(result).not.toContain("internal-api");
    });

    it("returns generic message for empty string error", () => {
      const result = sanitizeErrorMessage(new Error(""));
      expect(result).toContain("予期しないエラー");
    });
  });

  describe("non-Error inputs", () => {
    it("handles string input", () => {
      const result = sanitizeErrorMessage("something went wrong");
      expect(result).toBe("something went wrong");
    });

    it("handles undefined input", () => {
      const result = sanitizeErrorMessage(undefined);
      expect(result).toContain("undefined");
    });

    it("strips URLs from string input", () => {
      const result = sanitizeErrorMessage(
        "failed at https://secret.api.com/key",
      );
      expect(result).not.toContain("secret.api.com");
    });
  });
});
