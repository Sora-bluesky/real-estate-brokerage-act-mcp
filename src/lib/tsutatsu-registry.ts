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
  {
    id: "hito-no-shi",
    title: "宅地建物取引業者による人の死の告知に関するガイドライン",
    abbrev: ["人の死の告知GL", "事故物件ガイドライン", "告知ガイドライン"],
    issuer: "国土交通省",
    year: 2021,
    pdf_url:
      "https://www.mlit.go.jp/tochi_fudousan_kensetsugyo/const/content/001727517.pdf",
    description:
      "不動産取引における人の死の告知に関する判断基準。自然死・日常生活の事故死は原則告知不要、賃貸は概ね3年経過で告知不要等を規定。令和3年10月策定。",
  },
  {
    id: "sublease-gl",
    title: "サブリース事業に係る適正な業務のためのガイドライン",
    abbrev: [
      "サブリースGL",
      "サブリースガイドライン",
      "サブリース事業適正化GL",
    ],
    issuer: "国土交通省",
    year: 2023,
    pdf_url:
      "https://www.mlit.go.jp/tochi_fudousan_kensetsugyo/const/content/001474901.pdf",
    description:
      "賃貸住宅管理業法に基づくサブリース業者の勧誘・契約締結の適正化に関するガイドライン。令和5年3月31日改正。",
  },
  {
    id: "chintai-kanri-kaishaku",
    title: "賃貸住宅の管理業務等の適正化に関する法律の解釈・運用の考え方",
    abbrev: ["賃管法解釈・運用", "賃貸管理業法通達", "賃管法通達"],
    issuer: "国土交通省",
    year: 2023,
    pdf_url:
      "https://www.mlit.go.jp/tochi_fudousan_kensetsugyo/const/content/001474894.pdf",
    description:
      "賃貸住宅管理業法の各条文について具体的な解釈と運用方針を示した通達。令和5年3月31日施行版。",
  },
  {
    id: "it-jusetsu",
    title:
      "重要事項説明書等の電磁的方法による提供及びITを活用した重要事項説明実施マニュアル",
    abbrev: ["IT重説マニュアル", "IT重説", "電子書面マニュアル"],
    issuer: "国土交通省",
    year: 2024,
    pdf_url: "https://www.mlit.go.jp/totikensangyo/const/content/001853617.pdf",
    description:
      "ITを活用した重要事項説明（IT重説）と書面の電子化に関する実施マニュアル。令和6年12月改訂版。",
  },
  {
    id: "inspection-gl",
    title: "既存住宅インスペクション・ガイドライン",
    abbrev: [
      "インスペクションGL",
      "既存住宅インスペクション",
      "住宅インスペクションガイドライン",
    ],
    issuer: "国土交通省",
    year: 2013,
    pdf_url: "https://www.mlit.go.jp/common/001001034.pdf",
    description:
      "既存住宅売買時の目視等を中心とする基礎的なインスペクションの検査方法・留意事項を定めたガイドライン。平成25年6月策定。",
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
