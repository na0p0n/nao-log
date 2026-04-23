# Blog — AI-assisted Japanese tech blog

Claude を相棒に運用する日本語技術ブログ。このファイルは毎セッションの冒頭で読み込まれるので、常に最新・簡潔に保つこと。

## スタック

- **Astro 5** + TypeScript + Markdown（Content Collections）
- **GitHub** `na0p0n/nao-log` でソース・Issues・PR を管理
- **GitHub Pages** `https://na0p0n.github.io/nao-log/` + GitHub Actions で自動デプロイ
- **textlint**（preset-ja-technical-writing）+ **astro check** を品質ゲートに
- `astro.config.mjs`: `site: 'https://na0p0n.github.io'`, `base: '/nao-log'`（内部リンクは `BASE_URL` プレフィックス必須）

## ディレクトリ

```
src/
  content/posts/       # 記事本体（Markdown）
  layouts/             # ページレイアウト
  pages/               # ルーティング
public/assets/<slug>/  # 記事の画像
.claude/
  skills/              # タスク別スキル（new-post が主フロー、他は個別呼び出し）
  agents/              # サブエージェント（post-reviewer, fact-checker, seo-optimizer）
  hooks/               # PostToolUse で textlint を走らせるスクリプト
  settings.json        # 権限と Hooks
.github/workflows/     # CI（deploy, lint）
```

## 記事の書き方

- 日本語メイン、**ですます調**で統一
- 一文 80 字前後を目安（`textlint` で 100 字超は警告）
- 技術用語は原語またはカタカナで可。初出は括弧書きで補足
- 見出しは `##` から（`#` はページタイトルが自動で担う）
- 半角英数と日本語の間は半角スペース（textlint で強制）
- frontmatter 必須項目: `title`, `description`, `pubDate`, `tags`, `draft`

## 運用ワークフロー

### 主フロー: 「ブログ記事を作成して」

この一言で `new-post` スキルが起動し、以下 7 フェーズを案内する:

1. **トピック決定** — 指定なしなら `trend-scan` で候補提示
2. **プラン合意** — タイトル 3 案 / 読者 / 目的 / 一次・副次キーワード / 章立て
3. **執筆** — `write-post` が `draft: true` で生成
4. **自己レビュー並列** — `post-reviewer` + `fact-checker` + `seo-optimizer` を **並列起動**
5. **修正ループ** — Must-fix は全反映、Suggestion はユーザー判断
6. **ユーザーレビュー** — `npm run dev` でプレビュー案内
7. **公開** — ユーザー GO で `draft:false` → commit → push → Actions 自動デプロイ

詳細は [`.claude/skills/new-post/SKILL.md`](.claude/skills/new-post/SKILL.md) 参照。

### 個別スキル

単独でも呼べる:

- `write-post` — 下書き生成のみ
- `trend-scan` — トレンド調査のみ
- `deploy` — ビルド + 本番反映
- `release` — CHANGELOG + GitHub Release
- `triage` — Issue ラベル付け
- `fix-issue` — Issue 修正 PR

## トレンドのソース

X / Zenn / Qiita / はてなブックマーク / Hacker News / Reddit（詳細は `trend-scan` スキル参照）。

## Claude が守ること

- 記事は必ず `draft: true` で作成。`draft: false` への変更はユーザー指示があったときだけ
- 事実情報（数値・バージョン・API 仕様）には必ず一次情報の URL を添える
- `git push` / PR 作成 / GitHub Release は **実行前にユーザーに確認**
- 画像・バイナリは `public/assets/<slug>/` に配置
- 生成 AI を利用した旨は、記事末尾に「本記事は Claude の支援を受けて作成しています」と明記

## ローカルコマンド

```bash
npm install       # 初回
npm run dev       # 開発サーバー
npm run check     # 型・コンテンツ検証
npm run lint      # textlint
npm run lint:fix  # 自動修正
npm run build     # 本番ビルド
```

## メンテナンス

- 依存の更新は `minor` 単位でまとめる。`major` は独立 PR
- Astro のメジャー更新は breaking の調査 → 専用 Issue で管理
