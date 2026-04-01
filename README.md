# real-estate-brokerage-act-mcp

[![npm version](https://img.shields.io/npm/v/real-estate-brokerage-act-mcp)](https://www.npmjs.com/package/real-estate-brokerage-act-mcp)
[![CI](https://github.com/Sora-bluesky/real-estate-brokerage-act-mcp/actions/workflows/cross-platform-test.yml/badge.svg)](https://github.com/Sora-bluesky/real-estate-brokerage-act-mcp/actions/workflows/cross-platform-test.yml)
[![Node.js](https://img.shields.io/node/v/real-estate-brokerage-act-mcp)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

不動産取引実務に必要な法令・通達を e-Gov 法令 API からリアルタイム取得する MCP サーバー。

AI の不動産法規回答に含まれるハルシネーションを、条文原文との照合によって防ぐ。

## 特徴

- **法令取得** — e-Gov 法令 API v2 から条文を Markdown 形式で取得
- **法令検索** — キーワードで法令を横断検索
- **通達・告示取得** — 報酬額告示・原状回復 GL・事故物件 GL・IT 重説マニュアル等 10 件の実務頻出資料を国交省 PDF から取得
- **検索ファースト** — e-Gov API 検索による動的な法令解決。プリセットに限らず、e-Gov 収録の全法令を取得可能
- **略称マップ** — 宅建業法・都市計画法・建築基準法・所得税法ほか 85 法令の略称を登録済み。施行令第 3 条（重説・法令上の制限）の全 48 法令 + 税法 6 法令 + 暴対法・個人情報保護法等を含む
- **キャッシュ** — 検索 30 分・法令データ 24 時間の TTL キャッシュ
- **API 耐障害性** — 自動リトライ（exponential backoff）+ サーキットブレーカー
- **運用可視化** — 構造化 JSON ログ + 使用量メトリクス（`get_metrics` ツール）+ セキュリティ監査ログ

## Web で使う（Vercel デプロイ）

Vercel にデプロイすると、Claude.ai からすぐに使えます。環境変数の設定は不要です（e-Gov API は公開 API）。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSora-bluesky%2Freal-estate-brokerage-act-mcp)

### Claude.ai でのセットアップ（Free/Pro/Max/Team/Enterprise）

1. 上の「Deploy with Vercel」ボタンでデプロイ（ワンクリック）
2. [claude.ai](https://claude.ai) → プロフィールアイコン → Settings → Connectors
3. 「Add custom connector」をクリック
4. URL に `https://your-app.vercel.app/api/mcp`（your-app をデプロイ先に置換）を入力
5. チャットで「+」→「Connectors」→ real-estate-brokerage-act を有効化
6. 「宅建業法第35条を教えて」と質問

---

## ローカルで使う（stdio）

### npx（推奨）

```bash
npx -y real-estate-brokerage-act-mcp
```

### Claude Desktop

`claude_desktop_config.json` に以下を追加してください。

```json
{
  "mcpServers": {
    "real-estate-brokerage-act": {
      "command": "npx",
      "args": ["-y", "real-estate-brokerage-act-mcp"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add real-estate-brokerage-act -- npx -y real-estate-brokerage-act-mcp
```

### ローカル（ソースから）

```bash
git clone https://github.com/Sora-bluesky/real-estate-brokerage-act-mcp.git
cd real-estate-brokerage-act-mcp
npm install
npm run build
```

```json
{
  "mcpServers": {
    "real-estate-brokerage-act": {
      "command": "node",
      "args": ["/path/to/real-estate-brokerage-act-mcp/dist/index.js"]
    }
  }
}
```

## MCP ツール

| ツール              | 説明                                                                     |
| ------------------- | ------------------------------------------------------------------------ |
| `get_law`           | 条番号を指定して法令の条文を取得する。略称・正式名称のいずれでも指定可能 |
| `get_full_law`      | 法令の全文を取得する                                                     |
| `search_law`        | キーワードで不動産関連法令を横断検索する                                 |
| `get_tsutatsu`      | 国交省の通達・ガイドライン・告示を取得する（報酬額告示、原状回復 GL 等） |
| `check_law_updates` | 法令の改正状況を e-Gov API で確認する                                    |
| `get_laws_batch`    | 複数の法令・条文を一括取得する（最大 20 件）                             |
| `verify_citation`   | AI の回答に含まれる法令引用を検証する                                    |
| `suggest_related`   | 指定した条文の関連法令・委任先を自動抽出して提案する                     |
| `analyze_article`   | 条文の構造解析メタデータを JSON 形式で返す                               |
| `get_metrics`       | サーバーの使用量メトリクスを返す                                         |

## 使用例

### 条文取得

```
宅建業法第35条を取得して
→ get_law(law_name="宅建業法", article_number="35")
```

### 通達取得

```
報酬額告示を取得して
→ get_tsutatsu(tsutatsu_name="報酬額告示")
```

### 法令検索

```
重要事項説明に関する法令を検索して
→ search_law(keyword="重要事項説明")
```

## 対応法令

施行令第 3 条（重要事項説明における法令上の制限）の全 48 法令を含む、85 法令（14 グループ）の略称を登録済み。

## 通達・告示プリセット

| 略称                | 正式名称                                                                           |
| ------------------- | ---------------------------------------------------------------------------------- |
| 報酬額告示          | 宅地建物取引業者が宅地又は建物の売買等に関して受けることができる報酬の額           |
| 解釈・運用の考え方  | 宅地建物取引業法の解釈・運用の考え方                                               |
| 原状回復 GL         | 原状回復をめぐるトラブルとガイドライン                                             |
| 標準媒介契約約款    | 標準媒介契約約款                                                                   |
| 重説様式            | 重要事項説明書の様式例                                                             |
| 事故物件 GL         | 宅地建物取引業者による人の死の告知に関するガイドライン                             |
| サブリース GL       | サブリース事業に係る適正な業務のためのガイドライン                                 |
| 賃管法通達          | 賃貸住宅の管理業務等の適正化に関する法律の解釈・運用の考え方                       |
| IT 重説             | 重要事項説明書等の電磁的方法による提供及び IT を活用した重要事項説明実施マニュアル |
| インスペクション GL | 既存住宅インスペクション・ガイドライン                                             |

## セキュリティ

- Zod スキーマによる全入力バリデーション（長さ制限付き）
- PDF URL ホワイトリスト（SSRF 対策: mlit.go.jp / e-gov.go.jp のみ許可）
- エラーメッセージのサニタイズ（内部 URL・パスの非露出）
- セキュリティ監査ログ（ツール呼び出し・SSRF 拒否イベントを JSONL で記録）
- キャッシュサイズ制限（DoS 対策）
- 読み取り専用 + 公開データのみ

## データソース

- [e-Gov 法令検索](https://laws.e-gov.go.jp/)（デジタル庁）
- [国土交通省 不動産業](https://www.mlit.go.jp/totikensangyo/const/)

## ライセンス

[MIT](LICENSE)
