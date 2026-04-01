import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { findBestMatch } from "../lib/best-match.js";
import { TsutatsuRegistry } from "../lib/tsutatsu-registry.js";
import { extractTextFromPdf } from "../lib/pdf-extractor.js";
import { searchLaws, getLawData } from "../lib/egov-client.js";
import { parseFullLaw } from "../lib/egov-parser.js";

const registry = new TsutatsuRegistry();

const schema = {
  tsutatsu_name: z
    .string()
    .describe(
      "通達・ガイドライン・告示名（例: 報酬額告示、原状回復ガイドライン、解釈・運用の考え方）",
    ),
};

/**
 * Attempt to fetch tsutatsu text via the preset PDF URL.
 * Downloads the PDF and extracts text directly.
 *
 * Returns the text on success, or null on failure.
 */
async function fetchViaPdfUrl(
  pdfUrl: string,
): Promise<{ text: string | null; error: string | null }> {
  try {
    const text = await extractTextFromPdf(pdfUrl);
    return { text, error: null };
  } catch (err) {
    return {
      text: null,
      error: err instanceof Error ? err.message : "PDF テキスト抽出に失敗",
    };
  }
}

/**
 * Attempt to fetch tsutatsu text via the e-Gov API fallback:
 * Search by title, then fetch the first result.
 */
async function fetchViaEgov(
  name: string,
): Promise<{ title: string; lawNum: string; text: string } | null> {
  try {
    const searchResult = await searchLaws(name);
    if (searchResult.count === 0) {
      return null;
    }

    const firstLaw = findBestMatch(searchResult.laws, name);
    const title =
      firstLaw.revision_info?.law_title ??
      firstLaw.current_revision_info?.law_title ??
      name;
    const lawId = firstLaw.law_info.law_id;

    const lawData = await getLawData(lawId);
    const text = parseFullLaw(lawData.law_full_text);

    return { title, lawNum: firstLaw.law_info.law_num, text };
  } catch {
    return null;
  }
}

export function registerGetTsutatsuTool(server: McpServer): void {
  server.tool(
    "get_tsutatsu",
    "不動産取引に関する国交省の通達・ガイドライン・告示を取得する。PDFから内容を抽出し、見つからない場合はe-Gov APIで検索を試みる。",
    schema,
    async ({ tsutatsu_name }) => {
      try {
        // Step 1: Check preset registry for known tsutatsu
        const preset = registry.findByName(tsutatsu_name);

        if (preset) {
          // Step 2a: Try fetching from preset PDF URL
          const { text: pdfText, error: pdfError } = await fetchViaPdfUrl(
            preset.pdf_url,
          );

          if (pdfText) {
            const text = [
              `【通達・告示】${preset.title}`,
              `発行元: ${preset.issuer}`,
              `概要: ${preset.description}`,
              "",
              pdfText,
              "",
              `出典: 国土交通省`,
              `URL: ${preset.pdf_url}`,
              "",
              "※ 掲載情報の正確性については万全を期しておりますが、",
              "本データの利用に伴って発生した不利益や問題について責任を負うものではありません。",
              "正確な内容は原本で確認してください。",
            ].join("\n");

            return { content: [{ type: "text" as const, text }] };
          }

          // Step 2b: PDF failed — try e-Gov API if law_id exists
          if (preset.law_id) {
            try {
              const lawData = await getLawData(preset.law_id);
              const fullText = parseFullLaw(lawData.law_full_text);

              const text = [
                `【通達・告示】${preset.title}`,
                `発行元: ${preset.issuer}`,
                `概要: ${preset.description}`,
                "",
                fullText,
                "",
                "出典: e-Gov法令検索",
              ].join("\n");

              return { content: [{ type: "text" as const, text }] };
            } catch {
              // e-Gov also failed — fall through to "not found" message
            }
          }

          // Preset found but no text available from any source
          const diagLines = [];
          if (preset.pdf_url) {
            diagLines.push(`PDF URL: ${preset.pdf_url}`);
          }
          if (pdfError) {
            diagLines.push(`原因: ${pdfError}`);
          }

          const text = [
            `【通達・告示】${preset.title}`,
            `発行元: ${preset.issuer}`,
            `概要: ${preset.description}`,
            "",
            "本文の取得に失敗しました。",
            "PDF および e-Gov 法令検索のいずれからも取得できませんでした。",
            ...(diagLines.length > 0 ? ["", "診断情報:", ...diagLines] : []),
            "",
            "ネットワーク接続を確認するか、時間をおいて再度お試しください。",
          ].join("\n");

          return { content: [{ type: "text" as const, text }] };
        }

        // Step 3: No preset — try e-Gov API as fallback
        const egovResult = await fetchViaEgov(tsutatsu_name);
        if (egovResult) {
          const text = [
            `【検索結果】${egovResult.title}`,
            `法令番号: ${egovResult.lawNum}`,
            "",
            egovResult.text,
            "",
            "出典: e-Gov法令検索",
            "",
            "※ この通達・告示はプリセットに含まれていないため、検索結果から取得しました。",
          ].join("\n");

          return { content: [{ type: "text" as const, text }] };
        }

        // Nothing found anywhere
        const allTsutatsu = registry.getAll();
        const text = [
          `該当する通達・告示を確認できませんでした: ${tsutatsu_name}`,
          "",
          "通達・ガイドラインは e-Gov 法令 API の検索対象に含まれていない場合があります。",
          "正式名称で再度お試しいただくか、関連する法令の該当条文を",
          "get_law ツールで確認してください。",
          "",
          "登録済みの通達・告示一覧:",
          ...allTsutatsu.map((t) => `  - ${t.title}`),
        ].join("\n");

        return { content: [{ type: "text" as const, text }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text" as const, text: `エラー: ${message}` }],
          isError: true,
        };
      }
    },
  );
}
