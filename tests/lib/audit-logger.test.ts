import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { withAuditLog, logSsrfRejection } from "../../src/lib/audit-logger.js";

describe("audit-logger", () => {
  let stderrSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    stderrSpy = vi.spyOn(process.stderr, "write").mockReturnValue(true);
  });

  afterEach(() => {
    stderrSpy.mockRestore();
  });

  function parseLogs(): Array<Record<string, unknown>> {
    return stderrSpy.mock.calls
      .map((call) => {
        try {
          return JSON.parse(String(call[0]));
        } catch {
          return null;
        }
      })
      .filter(Boolean) as Array<Record<string, unknown>>;
  }

  describe("withAuditLog", () => {
    it("logs tool_invoked on entry", async () => {
      const handler = withAuditLog("test_tool", async () => ({
        content: [{ type: "text" as const, text: "ok" }],
      }));

      await handler({ law_name: "建築基準法" });

      const logs = parseLogs();
      const invoked = logs.find(
        (l) => (l.data as Record<string, unknown>)?.event === "tool_invoked",
      );
      expect(invoked).toBeDefined();
      expect((invoked!.data as Record<string, unknown>).tool).toBe("test_tool");
      expect(
        (
          (invoked!.data as Record<string, unknown>).input as Record<
            string,
            unknown
          >
        ).law_name,
      ).toBe("建築基準法");
    });

    it("logs tool_completed on success", async () => {
      const handler = withAuditLog("test_tool", async () => ({
        content: [{ type: "text" as const, text: "ok" }],
      }));

      await handler({});

      const logs = parseLogs();
      const completed = logs.find(
        (l) => (l.data as Record<string, unknown>)?.event === "tool_completed",
      );
      expect(completed).toBeDefined();
      expect(
        (completed!.data as Record<string, unknown>).duration_ms,
      ).toBeTypeOf("number");
    });

    it("logs tool_error when handler returns isError", async () => {
      const handler = withAuditLog("test_tool", async () => ({
        content: [{ type: "text" as const, text: "failed" }],
        isError: true as const,
      }));

      await handler({});

      const logs = parseLogs();
      const errorLog = logs.find(
        (l) => (l.data as Record<string, unknown>)?.event === "tool_error",
      );
      expect(errorLog).toBeDefined();
      expect(errorLog!.level).toBe("warn");
    });

    it("logs tool_exception when handler throws", async () => {
      const handler = withAuditLog("test_tool", async () => {
        throw new Error("unexpected");
      });

      await expect(handler({})).rejects.toThrow("unexpected");

      const logs = parseLogs();
      const exception = logs.find(
        (l) => (l.data as Record<string, unknown>)?.event === "tool_exception",
      );
      expect(exception).toBeDefined();
      expect(exception!.level).toBe("error");
      expect((exception!.data as Record<string, unknown>).error_type).toBe(
        "Error",
      );
    });

    it("truncates large input values", async () => {
      const handler = withAuditLog("test_tool", async () => ({
        content: [{ type: "text" as const, text: "ok" }],
      }));

      await handler({ keyword: "x".repeat(300) });

      const logs = parseLogs();
      const invoked = logs.find(
        (l) => (l.data as Record<string, unknown>)?.event === "tool_invoked",
      );
      const input = (invoked!.data as Record<string, unknown>).input as Record<
        string,
        unknown
      >;
      expect((input.keyword as string).length).toBeLessThan(300);
      expect(input.keyword).toContain("[truncated]");
    });
  });

  describe("logSsrfRejection", () => {
    it("logs ssrf_blocked event", () => {
      logSsrfRejection("https://evil.com/secret.pdf", "evil.com");

      const logs = parseLogs();
      const ssrf = logs.find(
        (l) => (l.data as Record<string, unknown>)?.event === "ssrf_blocked",
      );
      expect(ssrf).toBeDefined();
      expect(ssrf!.level).toBe("warn");
      expect((ssrf!.data as Record<string, unknown>).attempted_hostname).toBe(
        "evil.com",
      );
    });
  });
});
