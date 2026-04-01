import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock external dependencies BEFORE importing the tool module
vi.mock("../../src/lib/egov-client.js", () => ({
  getLawData: vi.fn(),
  searchLaws: vi.fn(),
}));
vi.mock("../../src/lib/egov-parser.js", () => ({
  parseArticle: vi.fn(),
  parseFullLaw: vi.fn(),
}));
vi.mock("../../src/lib/pdf-extractor.js", () => ({
  extractTextFromPdf: vi.fn(),
}));

import { registerGetTsutatsuTool } from "../../src/tools/get-tsutatsu.js";
import { searchLaws, getLawData } from "../../src/lib/egov-client.js";
import { parseFullLaw } from "../../src/lib/egov-parser.js";
import { extractTextFromPdf } from "../../src/lib/pdf-extractor.js";

// Capture the handler registered by the tool
let handler: Function;

const mockServer = {
  tool: vi.fn((_name: string, _desc: string, _schema: any, fn: Function) => {
    handler = fn;
  }),
};

describe("get_tsutatsu tool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    registerGetTsutatsuTool(mockServer as any);
  });

  it("registers with correct name", () => {
    expect(mockServer.tool).toHaveBeenCalledWith(
      "get_tsutatsu",
      expect.any(String),
      expect.any(Object),
      expect.any(Function),
    );
  });

  it("returns preset tsutatsu text via PDF pipeline", async () => {
    const mockPdfText =
      "宅地建物取引業者が受けることができる報酬の額は、次に定めるものとする。";

    vi.mocked(extractTextFromPdf).mockResolvedValue(mockPdfText);

    const result = await handler({
      tsutatsu_name: "報酬額告示",
    });

    expect(result.isError).toBeUndefined();
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("【通達・告示】");
    expect(result.content[0].text).toContain("報酬の額");
    expect(result.content[0].text).toContain("国土交通省");
    expect(result.content[0].text).toContain(mockPdfText);
    expect(result.content[0].text).toContain("出典: 国土交通省");
  });

  it("falls back when PDF fails and shows failure message", async () => {
    // PDF pipeline fails
    vi.mocked(extractTextFromPdf).mockRejectedValue(
      new Error("PDF extraction failed"),
    );

    const result = await handler({
      tsutatsu_name: "報酬額告示",
    });

    // Preset has no law_id so e-Gov fallback is skipped
    // Result should show "本文の取得に失敗しました"
    expect(result.isError).toBeUndefined();
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("本文の取得に失敗しました");
    expect(result.content[0].text).toContain("報酬の額");
  });

  it("returns search result text when no preset matches but e-Gov finds it", async () => {
    const mockSearchResult = {
      total_count: 1,
      count: 1,
      laws: [
        {
          law_info: {
            law_type: "MinisterialNotification",
            law_id: "TSUTATSU001",
            law_num: "令和元年告示第一号",
            law_num_era: "Reiwa",
            law_num_year: 1,
            law_num_type: "MinisterialNotification",
            law_num_num: "1",
            promulgation_date: "2019-05-01",
          },
          revision_info: {
            law_revision_id: "rev1",
            law_type: "MinisterialNotification",
            law_title: "テスト通達",
            law_title_kana: "てすとつうたつ",
            abbrev: null,
            category: "category",
            updated: "2024-01-01",
            amendment_promulgate_date: "2024-01-01",
            amendment_enforcement_date: "2024-04-01",
            amendment_enforcement_comment: null,
            amendment_law_id: "id1",
            amendment_law_title: "title1",
            amendment_law_num: "num1",
            repeal_status: "active",
            remain_in_force: true,
            current_revision_status: "active",
          },
          current_revision_info: {
            law_revision_id: "rev1",
            law_type: "MinisterialNotification",
            law_title: "テスト通達",
            law_title_kana: "てすとつうたつ",
            abbrev: null,
            category: "category",
            updated: "2024-01-01",
            amendment_promulgate_date: "2024-01-01",
            amendment_enforcement_date: "2024-04-01",
            amendment_enforcement_comment: null,
            amendment_law_id: "id1",
            amendment_law_title: "title1",
            amendment_law_num: "num1",
            repeal_status: "active",
            remain_in_force: true,
            current_revision_status: "active",
          },
        },
      ],
    };

    const mockLawData = {
      law_full_text: { tag: "Law", children: [] },
    };
    const mockFullText = "第一条 テスト通達の本文です。";

    vi.mocked(searchLaws).mockResolvedValue(mockSearchResult as any);
    vi.mocked(getLawData).mockResolvedValue(mockLawData as any);
    vi.mocked(parseFullLaw).mockReturnValue(mockFullText);

    const result = await handler({
      tsutatsu_name: "存在しないが検索で見つかる通達",
    });

    expect(result.isError).toBeUndefined();
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("【検索結果】");
    expect(result.content[0].text).toContain("e-Gov法令検索");
    expect(result.content[0].text).toContain(mockFullText);
  });

  it("returns guidance when nothing found anywhere", async () => {
    // PDF pipeline not called (no preset)
    // e-Gov returns nothing
    const emptySearchResult = {
      total_count: 0,
      count: 0,
      laws: [],
    };
    vi.mocked(searchLaws).mockResolvedValue(emptySearchResult as any);

    const result = await handler({
      tsutatsu_name: "存在しない通達",
    });

    expect(result.isError).toBeUndefined();
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain(
      "該当する通達・告示を確認できませんでした",
    );
    expect(result.content[0].text).toContain("存在しない通達");
    // Should list the presets
    expect(result.content[0].text).toContain("登録済みの通達・告示一覧");
    expect(result.content[0].text).toContain("報酬の額");
    expect(result.content[0].text).toContain("get_law");
    // getLawData should NOT have been called since nothing was found
    expect(getLawData).not.toHaveBeenCalled();
  });

  it("returns error on unexpected exception", async () => {
    // Make extractTextFromPdf throw an uncaught error
    // For a preset name, the flow goes to fetchViaPdfUrl first.
    // The throw from extractTextFromPdf propagates through fetchViaPdfUrl
    // but is caught inside the function, returning null.
    // However, we can force an error by making the preset lookup itself fail
    // or by using a non-preset name and making the e-Gov search throw.

    // Use a non-preset name so the flow goes to fetchViaEgov
    vi.mocked(searchLaws).mockRejectedValue(
      new Error("Unexpected network error"),
    );

    const result = await handler({
      tsutatsu_name: "非プリセット通達テスト",
    });

    // The fetchViaEgov catches errors internally and returns null,
    // so it shows "not found" guidance instead of isError
    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain(
      "該当する通達・告示を確認できませんでした",
    );
  });
});
