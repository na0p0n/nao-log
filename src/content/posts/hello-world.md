---
title: "はじめての AI ブログ"
description: "Claude Code をワークフローの中心に据えた、日本語技術ブログを立ち上げたので全体像を紹介します。"
pubDate: 2026-04-23
tags: ["meta", "claude", "astro"]
draft: false
---

## このブログについて

本ブログは Claude Code を中心にしたワークフローで運用しています。トレンドスキャン、下書き生成、レビュー、デプロイ、リリースまでを、スキルとサブエージェントに分解して自動化していきます。

## スタック

- **Astro 5** + TypeScript で静的サイトを生成
- **textlint**（preset-ja-technical-writing）で日本語文体を守る
- **GitHub Actions** で自動デプロイ

## 運用の流れ

1. 週に一度、`trend-scan` スキルで話題を集める
2. 面白そうなものは `write-post` スキルで下書きへ
3. `post-reviewer` サブエージェントに文体レビューを依頼
4. `fact-checker` サブエージェントに事実確認を依頼
5. `main` にマージして自動デプロイ

これから少しずつ育てていきます。

---

本記事は Claude の支援を受けて作成しています。
