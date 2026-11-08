import type { VercelRequest, VercelResponse } from "@vercel/node";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "../src/server.js";

/**
 * Allowed CORS origins.
 * Default: claude.ai only.
 * Override: set CORS_ORIGINS env var (comma-separated).
 * Set CORS_ORIGINS=* to allow all origins (not recommended for production).
 */
function getAllowedOrigin(requestOrigin: string | undefined): string | null {
  const envOrigins = process.env.CORS_ORIGINS;

  if (envOrigins === "*") return "*";

  const allowed = envOrigins
    ? envOrigins.split(",").map((o) => o.trim())
    : ["https://claude.ai"];

  if (
    requestOrigin &&
    allowed.some(
      (o) =>
        requestOrigin === o ||
        requestOrigin.endsWith("." + new URL(o).hostname),
    )
  ) {
    return requestOrigin;
  }

  return null;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  const origin = getAllowedOrigin(req.headers.origin as string | undefined);
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, mcp-session-id, mcp-protocol-version",
  );

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  // Stateless server: no SSE stream (GET) and no session to end (DELETE).
  // An open GET stream is held until the function timeout and billed as
  // provisioned memory for the whole time, so reject it at once.
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).end();
    return;
  }

  const server = createServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
}
