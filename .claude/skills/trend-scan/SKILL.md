---
name: trend-scan
description: Scan X / Zenn / Qiita / はてなブックマーク / Hacker News / Reddit for trending tech topics and propose blog-worthy ideas for a Japanese audience. Use when the user asks for trends, topic ideas, ネタ探し, or what to write.
---

# trend-scan — 技術トレンドの集約と記事化提案

## いつ使うか

- 「ネタ探し」「今のトレンドは？」「何を書けばいい？」
- 週次 or 月次の定期収集指示
- 空いた時間で話題を仕込みたいとき

## 対象ソース

| ソース | URL 例 | 特徴 | アクセス |
| --- | --- | --- | --- |
| Zenn | `https://zenn.dev/` (Trending) | 日本語技術記事 | WebFetch |
| Qiita | `https://qiita.com/` (週間ランキング) | 日本語技術記事 | WebFetch |
| はてなブックマーク | `https://b.hatena.ne.jp/hotentry/it` | 日本の IT 話題全般 | WebFetch |
| Hacker News | `https://news.ycombinator.com/` | 英語・技術トレンド | WebFetch |
| Reddit | `/r/programming` `/r/LocalLLaMA` `/r/webdev` など | コミュニティの声 | WebFetch（`.json` サフィックスも可） |
| X | ユーザー指定 URL / 検索結果 | 速報性高 | WebFetch は制限あり。ユーザーに URL 依頼可 |

## 手順

1. **期間確認**：今日・今週・今月・カスタム、どれか
2. **ソース並行取得**：WebFetch を並列で。取得失敗は `⚠️` マーク付きで続行
3. **重複統合**：同じトピックは 1 件にまとめ、ソース数が多いものを優先
4. **日本語読者適合性**を判断：
   - 英語圏の話題は「翻訳 + 日本語コンテキストでの補足」が必要か
   - 既に日本語解説記事が飽和しているものは優先度を下げる
5. **結果をテーブルで提示**：

```
| # | トピック | ソース | 日本語既出 | アングル案 |
| - | -------- | ------ | --------- | --------- |
| 1 | Astro 5 Content Layer | Zenn / HN | 少 | 触ってわかった使い所 |
```

6. **上位 3 件を記事候補として推薦**し、「どれを `write-post` に渡しますか？」と尋ねる

## レポート出力ルール

- 上位 10〜20 件を出す（選択の余地を残す）
- 各項目に URL を 1 件以上添える（ユーザーが元ネタを確認できるように）
- 速報性が高いもの（24 時間以内）は `🔥` マーク
- 炎上系・ポジショントーク系は `⚠️` マーク付きで別記

## やらないこと

- SNS 個人アカウントの特定・属性推定
- 有料コンテンツ本文の複製（タイトル + 要約 + リンクに留める）
- 不確かな速報の断定的な引用
