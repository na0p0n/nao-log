---
name: new-post
description: End-to-end blog post creation orchestrator — runs trend-scan → writes a draft → self-reviews (style, facts, SEO) in parallel → iterates → prepares for user review → publishes. Use when the user asks to create / write / draft a blog post or article (「ブログ記事を作成して」「記事書いて」「新しい投稿」「今日のトレンドから1本」).
---

# new-post — 記事作成フロー全体のオーケストレーション

「ブログ記事を作成して」という 1 行から公開直前までを案内するオーケストレーションスキル。以下 7 フェーズを順に進め、**各フェーズの区切りでユーザーの合意を得てから** 次へ進む。

## Phase 1 — トピック決定

1. ユーザー発話にトピックが含まれるか確認
2. **無い場合**: `trend-scan` スキルを呼び、候補一覧から上位 3 件を推薦。ユーザーに選ばせる
3. **有る場合**: そのトピックで進める前に、ねらいどころを 1〜2 行で確認
4. 決定したらスラッグ候補を 1 つ提示（英数ハイフン区切り、主要キーワードを含む短さ）

## Phase 2 — 記事プラン合意

ユーザーに次をまとめて提示し、承認を取る:

- **タイトル案 3 つ**（いずれも主要キーワードを含み 30〜60 字）
- **ターゲット読者**（例: 「Astro を触り始めた人」）
- **記事の目的**（入門／体験記／比較／速報／チュートリアル）
- **一次キーワード** 1 個、**副次キーワード** 2〜3 個（SEO 設計の起点）
- **章立て**（`##` / `###` のみ、最終まとめを含める）
- **想定読み時間**（分）

ユーザー修正があれば反映して再確認。OK が出るまで Phase 3 へ進まない。

## Phase 3 — 執筆

`write-post` スキルのルールに従い `src/content/posts/<slug>.md` を `draft: true` で生成。

- Phase 2 で決めたキーワードを意識して配置（タイトル / 導入 / H2 / 結論）
- 事実情報には一次情報 URL を添える
- 内部リンク候補は `Grep` で `src/content/posts/` を検索し、自然に挿入できる場所に置く
- 末尾に「本記事は Claude の支援を受けて作成しています」を残す

## Phase 4 — 自己レビュー（3 エージェント並列）

**Agent ツールで同時に起動** する。1 メッセージの中に 3 つの Agent 呼び出しを並べて並列実行させること:

- `post-reviewer` — 文体・構成・可読性・外部リンク健全性
- `fact-checker` — 数値・仕様・バージョン・日付の一次情報裏取り
- `seo-optimizer` — タイトル／description／キーワード配置／内部リンク／OG

3 件の報告を受け取ったら、次のフォーマットに統合してユーザーへ:

```markdown
## 自己レビューまとめ: <title>

### 🚨 Must-fix (<件数>)
- [post-reviewer] L12: ...
- [fact-checker] L34: 数値の出典が欠落
- [seo-optimizer] タイトル主要キーワード不足

### 💡 Suggestions (<件数>)
- ...

### SEO スコア
- タイトル: ✅ / ⚠️  (現状 <N>字)
- Meta description: ✅ / ⚠️  (現状 <N>字)
- 主要キーワード配置: <OK/不足>
- 内部リンク: N 本
- OG image: 設定済み / 未設定
```

## Phase 5 — 修正ループ

- **Must-fix はすべて反映**（反映内容をユーザーに報告）
- Suggestions は 1 件ずつユーザー判断を仰ぐ（まとめて却下も可）
- 反映後、**重要な書き換えがあった場合のみ** 再レビュー。軽微修正では再レビュー不要

## Phase 6 — ユーザーレビュー依頼

Claude の自己レビューが完了したら、ユーザーに次を案内:

```
レビュー完了しました。プレビューで確認してください。

  npm run dev

ただし `draft: true` の記事は一覧・個別ページどちらにも出ません。
以下のいずれかで確認してください:

  a) frontmatter を `draft: false` に一時変更（公開時は再度 true に戻す必要あり）
  b) src/pages/index.astro と [...slug].astro の `!data.draft` フィルタを外す
  c) Claude に「プレビュー用に一時公開」と指示（Claude が (a) を行い、確認後に元へ戻す）

内容 OK なら「公開して」と伝えてください。修正したい点があれば指示してください。
```

## Phase 7 — 公開

ユーザーが「公開して」と指示したら:

1. frontmatter を更新:
   - `draft: true` → `draft: false`
   - `pubDate` を公開日に合わせる（未来日付だったら今日に差し替え）
   - 過去に公開した記事を再公開するときは `updatedDate` を今日に追加
2. `npm run check && npm run lint` をパスするか最終確認
3. `git add src/content/posts/<slug>.md public/assets/<slug>/` 相当を stage
4. コミット: `post: <title>`（Conventional Commits 準拠の独自タイプ `post:`）
5. **ユーザーに最終確認**:
   > `git push origin main` しますか？ Actions が自動デプロイします。
6. 承認後 push、`gh run watch` で Actions 完了を待つ
7. 完了したら公開 URL をユーザーに報告
8. 節目のリリース（10 本到達など）なら `release` スキルを提案

## 中断と再開

- Phase 2 / 5 / 6 でユーザーが「後で」と言ったら、`src/content/posts/<slug>.md` に `draft: true` のまま残して撤退。再開時は同スキルをもう一度起動してスラッグを指定する
- Phase 4 のレビュー結果は一時ファイルに残さない（会話文脈に収める）。再開時は再レビュー

## トリガーとなる表現

- 「ブログ記事を作成して」「記事書いて」「新しい投稿」「1本書こう」
- 「〇〇について記事にして」
- 「今日のトレンドから 1 本」
- "write a blog post", "create an article"

## やらないこと

- フェーズを飛ばして執筆や公開へ進む
- 自己レビューの Must-fix を残したまま Phase 6 へ進む
- ユーザー確認なしに `git push` / `draft: false` への変更
- 3 エージェントを直列で呼び出す（並列が原則）
