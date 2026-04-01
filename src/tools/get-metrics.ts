import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getMetrics } from "../lib/metrics.js";
import { withAuditLog } from "../lib/audit-logger.js";

export function registerGetMetricsTool(server: McpServer): void {
  server.tool(
    "get_metrics",
    "サーバーの使用量メトリクスを返す（ツール呼び出し回数・APIリクエスト数・キャッシュヒット率・稼働時間）",
    {},
    withAuditLog("get_metrics", async () => {
      const metrics = getMetrics();
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(metrics, null, 2),
          },
        ],
      };
    }),
  );
}
