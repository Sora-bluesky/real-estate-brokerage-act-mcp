import { logger } from "./logger.js";

/**
 * Security audit logger for MCP tool invocations.
 *
 * Records tool calls (input, duration, status) and security-relevant
 * events (SSRF rejection, validation failure) as structured JSONL
 * to stderr via the existing logger infrastructure.
 */

/**
 * Wrap a tool handler to automatically log invocation, completion,
 * and error events.
 *
 * Usage:
 *   server.tool("get_law", desc, schema, withAuditLog("get_law", handler));
 */
export function withAuditLog<TArgs extends Record<string, unknown>, TResult>(
  toolName: string,
  handler: (args: TArgs) => Promise<TResult>,
): (args: TArgs) => Promise<TResult> {
  return async (args: TArgs) => {
    logger.info("tool invoked", {
      event: "tool_invoked",
      tool: toolName,
      input: redactLargeValues(args),
    });

    const start = performance.now();
    try {
      const result = await handler(args);
      const durationMs = Math.round(performance.now() - start);

      const isError =
        result != null &&
        typeof result === "object" &&
        "isError" in result &&
        (result as Record<string, unknown>).isError;

      if (isError) {
        logger.warn("tool error response", {
          event: "tool_error",
          tool: toolName,
          duration_ms: durationMs,
        });
      } else {
        logger.info("tool completed", {
          event: "tool_completed",
          tool: toolName,
          duration_ms: durationMs,
        });
      }

      return result;
    } catch (error) {
      const durationMs = Math.round(performance.now() - start);
      const errorType =
        error instanceof Error ? error.constructor.name : "unknown";
      const errorMsg = error instanceof Error ? error.message : String(error);

      logger.error("tool exception", {
        event: "tool_exception",
        tool: toolName,
        error_type: errorType,
        error_message: errorMsg,
        duration_ms: durationMs,
      });

      throw error;
    }
  };
}

/**
 * Log when an SSRF-suspicious PDF URL is rejected.
 */
export function logSsrfRejection(attemptedUrl: string, hostname: string): void {
  logger.warn("PDF URL rejected (SSRF prevention)", {
    event: "ssrf_blocked",
    attempted_hostname: hostname,
  });
}

/**
 * Redact values that are too large for audit logs.
 * Preserves structure but truncates long strings.
 */
function redactLargeValues(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const MAX_STRING_LENGTH = 200;
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string" && value.length > MAX_STRING_LENGTH) {
      result[key] = value.slice(0, MAX_STRING_LENGTH) + "...[truncated]";
    } else if (Array.isArray(value)) {
      result[key] = `[Array(${value.length})]`;
    } else {
      result[key] = value;
    }
  }

  return result;
}
