import {
  EgovApiError,
  LawNotFoundError,
  ArticleNotFoundError,
  KokujiNotFoundError,
} from "./errors.js";

/**
 * URL pattern to strip from error messages.
 * Matches http(s)://... up to the next whitespace or end of string.
 */
const URL_PATTERN = /https?:\/\/[^\s)]+/g;

/**
 * File path patterns (Windows and Unix).
 */
const PATH_PATTERN =
  /(?:[A-Z]:\\[\w\\.-]+|\/(?:usr|home|tmp|var|etc)\/[\w/.-]+)/gi;

/**
 * Known safe error classes whose messages are designed for end users.
 */
function isKnownSafeError(error: unknown): error is Error {
  return (
    error instanceof LawNotFoundError ||
    error instanceof ArticleNotFoundError ||
    error instanceof KokujiNotFoundError
  );
}

/**
 * Sanitize an error for inclusion in MCP tool responses.
 *
 * - Known safe errors (LawNotFoundError etc.) pass through as-is.
 * - EgovApiError gets a user-friendly message with status code only.
 * - Other errors have URLs and file paths stripped, with a generic
 *   fallback if the result would be empty.
 */
export function sanitizeErrorMessage(error: unknown): string {
  if (isKnownSafeError(error)) {
    return error.message;
  }

  if (error instanceof EgovApiError) {
    const status = error.statusCode ? ` (HTTP ${error.statusCode})` : "";
    return `e-Gov法令APIへの問い合わせに失敗しました${status}。しばらく経ってから再度お試しください。`;
  }

  const raw = error instanceof Error ? error.message : String(error);

  // Strip URLs and file paths
  const cleaned = raw
    .replace(URL_PATTERN, "[URL]")
    .replace(PATH_PATTERN, "[path]");

  // If cleaning left nothing meaningful, use generic message
  if (
    !cleaned.trim() ||
    cleaned.trim() === "[URL]" ||
    cleaned.trim() === "[path]"
  ) {
    return "予期しないエラーが発生しました。しばらく経ってから再度お試しください。";
  }

  return cleaned;
}
