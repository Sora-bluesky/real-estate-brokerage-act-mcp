import type { LawAlias } from "../lib/types.js";

/**
 * Law alias map: abbreviation -> official title for e-Gov API search.
 *
 * This replaces the former law-presets (which contained law_id, law_num, etc.).
 * The system now resolves law_id dynamically via e-Gov API search,
 * using these aliases only for abbreviation expansion and keyword search.
 *
 * Organized for real-estate brokerage practice:
 * - Core brokerage laws (Takken-gyo)
 * - Contract / civil law
 * - Important matters explanation (jusetsu) / statutory restrictions
 * - Condominium (mansion) related
 * - Housing quality / defect liability
 * - Rental property management
 * - Compliance
 */
export const ALL_LAW_ALIASES: LawAlias[] = [
  // ── Core (Takken-gyo) ──
  {
    title: "宅地建物取引業法",
    abbrev: ["宅建業法"],
    group: "コア（宅建業）",
  },
  {
    title: "宅地建物取引業法施行令",
    abbrev: ["宅建業法施行令"],
    group: "コア（宅建業）",
  },
  {
    title: "宅地建物取引業法施行規則",
    abbrev: ["宅建業法施行規則"],
    group: "コア（宅建業）",
  },

  // ── Contract / Civil law ──
  {
    title: "民法",
    abbrev: ["民法"],
    group: "契約・民事",
  },
  {
    title: "借地借家法",
    abbrev: ["借地借家法"],
    group: "契約・民事",
  },
  {
    title: "建物の区分所有等に関する法律",
    abbrev: ["区分所有法"],
    group: "契約・民事",
  },
  {
    title: "不動産登記法",
    abbrev: ["不登法"],
    group: "契約・民事",
  },
  {
    title: "不動産登記令",
    abbrev: ["不登令"],
    group: "契約・民事",
  },
  {
    title: "信託法",
    abbrev: ["信託法"],
    group: "契約・民事",
  },
  {
    title: "信託業法",
    abbrev: ["信託業法"],
    group: "契約・民事",
  },

  // ── Jusetsu / Statutory restrictions (City planning) ──
  {
    title: "都市計画法",
    abbrev: ["都計法"],
    group: "重説・法令上の制限（都市計画）",
  },
  {
    title: "都市計画法施行令",
    abbrev: ["都計令"],
    group: "重説・法令上の制限（都市計画）",
  },
  {
    title: "都市計画法施行規則",
    abbrev: ["都計規則"],
    group: "重説・法令上の制限（都市計画）",
  },
  {
    title: "土地区画整理法",
    abbrev: ["区画整理法"],
    group: "重説・法令上の制限（都市計画）",
  },
  {
    title: "都市再開発法",
    abbrev: ["再開発法"],
    group: "重説・法令上の制限（都市計画）",
  },
  {
    title: "大都市地域における住宅及び住宅地の供給の促進に関する特別措置法",
    abbrev: ["大都市法"],
    group: "重説・法令上の制限（都市計画）",
  },
  {
    title: "地方拠点都市地域の整備及び産業業務施設の再配置の促進に関する法律",
    abbrev: ["地方拠点法"],
    group: "重説・法令上の制限（都市計画）",
  },
  {
    title: "被災市街地復興特別措置法",
    abbrev: ["被災市街地復興法"],
    group: "重説・法令上の制限（都市計画）",
  },
  {
    title: "新住宅市街地開発法",
    abbrev: ["新住宅市街地法"],
    group: "重説・法令上の制限（都市計画）",
  },
  {
    title: "新都市基盤整備法",
    abbrev: ["新都市基盤法"],
    group: "重説・法令上の制限（都市計画）",
  },
  {
    title: "密集市街地における防災街区の整備の促進に関する法律",
    abbrev: ["密集法"],
    group: "重説・法令上の制限（都市計画）",
  },
  {
    title: "幹線道路の沿道の整備に関する法律",
    abbrev: ["沿道整備法"],
    group: "重説・法令上の制限（都市計画）",
  },
  {
    title: "集落地域整備法",
    abbrev: ["集落整備法"],
    group: "重説・法令上の制限（都市計画）",
  },
  {
    title: "地域における歴史的風致の維持及び向上に関する法律",
    abbrev: ["歴史的風致法"],
    group: "重説・法令上の制限（都市計画）",
  },
  {
    title: "首都圏の近郊整備地帯及び都市開発区域の整備に関する法律",
    abbrev: ["首都圏整備法"],
    group: "重説・法令上の制限（都市計画）",
  },
  {
    title: "近畿圏の近郊整備区域及び都市開発区域の整備及び開発に関する法律",
    abbrev: ["近畿圏整備法"],
    group: "重説・法令上の制限（都市計画）",
  },
  {
    title: "流通業務市街地の整備に関する法律",
    abbrev: ["流通業務法"],
    group: "重説・法令上の制限（都市計画）",
  },

  // ── Jusetsu / Statutory restrictions (Building) ──
  {
    title: "建築基準法",
    abbrev: ["建基法", "基準法"],
    group: "重説・法令上の制限（建築）",
  },
  {
    title: "建築基準法施行令",
    abbrev: ["建基令", "基準法施行令"],
    group: "重説・法令上の制限（建築）",
  },

  // ── Jusetsu / Statutory restrictions (Disaster prevention / Rivers) ──
  {
    title: "宅地造成及び特定盛土等規制法",
    abbrev: ["盛土規制法", "宅造法"],
    group: "重説・法令上の制限（防災・河川）",
  },
  {
    title: "土砂災害警戒区域等における土砂災害防止対策の推進に関する法律",
    abbrev: ["土砂災害防止法"],
    group: "重説・法令上の制限（防災・河川）",
  },
  {
    title: "津波防災地域づくりに関する法律",
    abbrev: ["津波防災法"],
    group: "重説・法令上の制限（防災・河川）",
  },
  {
    title: "水防法",
    abbrev: ["水防法"],
    group: "重説・法令上の制限（防災・河川）",
  },
  {
    title: "河川法",
    abbrev: ["河川法"],
    group: "重説・法令上の制限（防災・河川）",
  },
  {
    title: "特定都市河川浸水被害対策法",
    abbrev: ["特定都市河川法"],
    group: "重説・法令上の制限（防災・河川）",
  },
  {
    title: "地すべり等防止法",
    abbrev: ["地すべり防止法"],
    group: "重説・法令上の制限（防災・河川）",
  },
  {
    title: "急傾斜地の崩壊による災害の防止に関する法律",
    abbrev: ["急傾斜地法"],
    group: "重説・法令上の制限（防災・河川）",
  },

  // ── Jusetsu / Statutory restrictions (Environment / Landscape) ──
  {
    title: "景観法",
    abbrev: ["景観法"],
    group: "重説・法令上の制限（環境・景観）",
  },
  {
    title: "古都における歴史的風土の保存に関する特別措置法",
    abbrev: ["古都保存法"],
    group: "重説・法令上の制限（環境・景観）",
  },
  {
    title: "都市緑地法",
    abbrev: ["都市緑地法"],
    group: "重説・法令上の制限（環境・景観）",
  },
  {
    title: "生産緑地法",
    abbrev: ["生産緑地法"],
    group: "重説・法令上の制限（環境・景観）",
  },
  {
    title: "自然公園法",
    abbrev: ["自然公園法"],
    group: "重説・法令上の制限（環境・景観）",
  },
  {
    title: "首都圏近郊緑地保全法",
    abbrev: ["首都圏緑地法"],
    group: "重説・法令上の制限（環境・景観）",
  },
  {
    title: "近畿圏の保全区域の整備に関する法律",
    abbrev: ["近畿圏保全法"],
    group: "重説・法令上の制限（環境・景観）",
  },
  {
    title: "文化財保護法",
    abbrev: ["文化財保護法"],
    group: "重説・法令上の制限（環境・景観）",
  },

  // ── Jusetsu / Statutory restrictions (Farmland / Land) ──
  {
    title: "農地法",
    abbrev: ["農地法"],
    group: "重説・法令上の制限（農地・土地）",
  },
  {
    title: "農地法施行規則",
    abbrev: ["農地法施行規則"],
    group: "重説・法令上の制限（農地・土地）",
  },
  {
    title: "国土利用計画法",
    abbrev: ["国土利用計画法", "国土法"],
    group: "重説・法令上の制限（農地・土地）",
  },
  {
    title: "公有地の拡大の促進に関する法律",
    abbrev: ["公拡法"],
    group: "重説・法令上の制限（農地・土地）",
  },
  {
    title: "土壌汚染対策法",
    abbrev: ["土壌汚染対策法"],
    group: "重説・法令上の制限（農地・土地）",
  },
  {
    title: "地価公示法",
    abbrev: ["地価公示法"],
    group: "重説・法令上の制限（農地・土地）",
  },
  {
    title: "不動産の鑑定評価に関する法律",
    abbrev: ["不動産鑑定評価法"],
    group: "重説・法令上の制限（農地・土地）",
  },

  // ── Jusetsu / Statutory restrictions (Roads / Transportation) ──
  {
    title: "道路法",
    abbrev: ["道路法"],
    group: "重説・法令上の制限（道路・交通）",
  },
  {
    title: "全国新幹線鉄道整備法",
    abbrev: ["新幹線法"],
    group: "重説・法令上の制限（道路・交通）",
  },
  {
    title: "航空法",
    abbrev: ["航空法"],
    group: "重説・法令上の制限（道路・交通）",
  },
  {
    title: "特定空港周辺航空機騒音対策特別措置法",
    abbrev: ["空港騒音法"],
    group: "重説・法令上の制限（道路・交通）",
  },

  // ── Jusetsu / Statutory restrictions (Other) ──
  {
    title: "港湾法",
    abbrev: ["港湾法"],
    group: "重説・法令上の制限（その他）",
  },
  {
    title: "住宅地区改良法",
    abbrev: ["住宅地区改良法"],
    group: "重説・法令上の制限（その他）",
  },
  {
    title: "海岸法",
    abbrev: ["海岸法"],
    group: "重説・法令上の制限（その他）",
  },
  {
    title: "砂防法",
    abbrev: ["砂防法"],
    group: "重説・法令上の制限（その他）",
  },
  {
    title: "森林法",
    abbrev: ["森林法"],
    group: "重説・法令上の制限（その他）",
  },
  {
    title: "都市公園法",
    abbrev: ["都市公園法"],
    group: "重説・法令上の制限（その他）",
  },
  {
    title: "廃棄物の処理及び清掃に関する法律",
    abbrev: ["廃棄物処理法", "廃掃法"],
    group: "重説・法令上の制限（その他）",
  },
  {
    title: "土地収用法",
    abbrev: ["土地収用法"],
    group: "重説・法令上の制限（その他）",
  },
  {
    title: "高齢者、障害者等の移動等の円滑化の促進に関する法律",
    abbrev: ["バリアフリー法"],
    group: "重説・法令上の制限（その他）",
  },
  {
    title: "旧公共施設の整備に関連する市街地の改造に関する法律",
    abbrev: ["市街地改造法"],
    group: "重説・法令上の制限（その他）",
  },

  // ── Condominium (Mansion) related ──
  {
    title: "マンションの管理の適正化の推進に関する法律",
    abbrev: ["マンション管理適正化法"],
    group: "マンション関連",
  },
  {
    title: "マンションの建替え等の円滑化に関する法律",
    abbrev: ["マンション建替え法"],
    group: "マンション関連",
  },

  // ── Housing quality / Defect liability ──
  {
    title: "住宅の品質確保の促進等に関する法律",
    abbrev: ["品確法", "住宅品質確保法"],
    group: "住宅品質・瑕疵",
  },
  {
    title: "特定住宅瑕疵担保責任の履行の確保等に関する法律",
    abbrev: ["住宅瑕疵担保履行法"],
    group: "住宅品質・瑕疵",
  },
  {
    title: "独立行政法人住宅金融支援機構法",
    abbrev: ["住宅金融支援機構法"],
    group: "住宅品質・瑕疵",
  },
  {
    title: "住生活基本法",
    abbrev: ["住生活基本法"],
    group: "住宅品質・瑕疵",
  },

  // ── Rental property management ──
  {
    title: "賃貸住宅の管理業務等の適正化に関する法律",
    abbrev: ["賃貸住宅管理業法"],
    group: "賃貸管理",
  },

  // ── Compliance ──
  {
    title: "犯罪による収益の移転防止に関する法律",
    abbrev: ["犯収法"],
    group: "コンプライアンス",
  },
  {
    title: "消費者契約法",
    abbrev: ["消費者契約法"],
    group: "コンプライアンス",
  },
  {
    title: "不当景品類及び不当表示防止法",
    abbrev: ["景品表示法", "景表法"],
    group: "コンプライアンス",
  },
  {
    title: "暴力団員による不当な行為の防止等に関する法律",
    abbrev: ["暴対法", "暴力団対策法"],
    group: "コンプライアンス",
  },
  {
    title: "個人情報の保護に関する法律",
    abbrev: ["個人情報保護法"],
    group: "コンプライアンス",
  },
  {
    title: "不動産特定共同事業法",
    abbrev: ["不特法", "不動産特定共同事業法"],
    group: "コンプライアンス",
  },

  // ── Tax laws (不動産取引関連税法) ──
  {
    title: "所得税法",
    abbrev: ["所得税法"],
    group: "税法",
  },
  {
    title: "租税特別措置法",
    abbrev: ["租特法", "措置法"],
    group: "税法",
  },
  {
    title: "地方税法",
    abbrev: ["地方税法"],
    group: "税法",
  },
  {
    title: "印紙税法",
    abbrev: ["印紙税法"],
    group: "税法",
  },
  {
    title: "登録免許税法",
    abbrev: ["登免税法", "登録免許税法"],
    group: "税法",
  },
  {
    title: "相続税法",
    abbrev: ["相続税法"],
    group: "税法",
  },
];
