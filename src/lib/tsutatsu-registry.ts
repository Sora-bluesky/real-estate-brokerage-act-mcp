import type { TsutatsuPreset } from "./types.js";

/**
 * Tsutatsu (notice/guideline) presets for real estate brokerage.
 *
 * These presets cover major notices, guidelines, and ministerial
 * announcements from MLIT relevant to real estate transactions.
 * PDF URLs point directly to MLIT-hosted documents.
 */
const PRESETS: TsutatsuPreset[] = [
  {
    id: "houshu-kokuji",
    title:
      "宅地建物取引業者が宅地又は建物の売買等に関して受けることができる報酬の額",
    abbrev: ["報酬額告示", "報酬告示", "仲介手数料告示"],
    issuer: "国土交通省",
    year: 2024,
    pdf_url:
      "https://www.mlit.go.jp/tochi_fudousan_kensetsugyo/const/content/001749923.pdf",
    description:
      "宅建業者の媒介報酬（仲介手数料）の上限額を定める告示。昭和45年建設省告示第1552号、最終改正令和6年国交省告示第949号。",
  },
  {
    id: "kaishaku-unyo",
    title: "宅地建物取引業法の解釈・運用の考え方",
    abbrev: ["解釈・運用の考え方", "解釈運用", "宅建業法通達"],
    issuer: "国土交通省",
    year: 2026,
    pdf_url: "https://www.mlit.go.jp/totikensangyo/const/content/001881261.pdf",
    description:
      "宅建業法の各条文について具体的な解釈と運用方針を示した通達。令和8年4月1日以降版。",
  },
  {
    id: "genjo-kaifuku",
    title: "原状回復をめぐるトラブルとガイドライン",
    abbrev: ["原状回復ガイドライン", "原状回復GL", "退去時ガイドライン"],
    issuer: "国土交通省住宅局",
    year: 2011,
    pdf_url:
      "https://www.mlit.go.jp/jutakukentiku/house/jutakukentiku_house_tk3_000023.html",
    description:
      "賃貸住宅の退去時の原状回復に関する費用負担の一般的基準。平成23年8月再改訂版。",
  },
  {
    id: "hyojun-baikai",
    title: "標準媒介契約約款",
    abbrev: ["標準媒介契約約款", "媒介契約約款", "標準約款"],
    issuer: "国土交通省",
    year: 2022,
    pdf_url: "https://www.mlit.go.jp/totikensangyo/const/content/001480695.pdf",
    description:
      "宅建業法第34条の2第2項に基づく媒介契約の標準約款。令和4年国交省告示第539号。",
  },
  {
    id: "jusetsu-yoshiki",
    title: "重要事項説明書の様式例",
    abbrev: ["重説様式", "重要事項説明書様式", "35条書面様式"],
    issuer: "国土交通省",
    year: 2026,
    pdf_url: "https://www.mlit.go.jp/totikensangyo/const/content/001895540.pdf",
    description: "重要事項説明書の標準的な様式例。令和8年4月1日以降版。",
  },
];

/**
 * Registry for looking up tsutatsu (notice/guideline) presets.
 *
 * Contains major notices, guidelines, and ministerial announcements
 * from MLIT relevant to real estate brokerage transactions.
 */
export class TsutatsuRegistry {
  private readonly presets: TsutatsuPreset[];

  constructor() {
    this.presets = PRESETS;
  }

  /**
   * Find a single tsutatsu by exact title or abbreviation.
   * Falls back to partial match if no exact/abbreviation match is found.
   */
  findByName(name: string): TsutatsuPreset | undefined {
    const exact = this.presets.find((p) => p.title === name);
    if (exact) return exact;

    const abbr = this.presets.find((p) => p.abbrev.some((a) => a === name));
    if (abbr) return abbr;

    return this.presets.find(
      (p) => p.title.includes(name) || name.includes(p.title),
    );
  }

  /**
   * Get a defensive copy of all tsutatsu presets.
   */
  getAll(): TsutatsuPreset[] {
    return [...this.presets];
  }

  /**
   * Search tsutatsu by keyword (partial match on title and abbreviations).
   */
  search(keyword: string): TsutatsuPreset[] {
    return this.presets.filter(
      (p) =>
        p.title.includes(keyword) ||
        p.abbrev.some((a) => a.includes(keyword)) ||
        keyword.includes(p.title),
    );
  }
}
