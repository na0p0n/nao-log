---
name: deploy
description: Build and deploy the Astro blog via GitHub Actions, or run a local preview. Use when the user asks to deploy, publish, release the site, or preview locally.
---

# deploy — ビルドと公開

## いつ使うか

- 「デプロイして」「公開して」「サイトに反映して」
- 「ローカルで確認したい」「プレビューして」

## 本番デプロイ（GitHub Actions 経由）

1. `git status` で作業ツリーがクリーンか確認（dirty なら commit / stash の指示を仰ぐ）
2. `git branch --show-current` で `main` に居ることを確認
3. `npm run check` で型・コンテンツ検証を通す
4. `npm run lint` で textlint を通す（失敗したら修正案を提示）
5. `npm run build` でローカルビルドが成功することを確認
6. **ユーザーに push してよいか確認**した上で `git push origin main`
7. `gh run watch` または `gh run list --limit 1` で Actions を監視
8. 完了後、公開 URL をユーザーに報告

## ローカルプレビュー

```bash
npm run build && npm run preview
```

`http://localhost:4321` をユーザーに案内。

## Actions が失敗した場合

1. `gh run list --limit 5` で失敗ラン特定
2. `gh run view <id> --log-failed` でログ取得
3. 原因を要約してユーザーに報告
4. 修正方針をユーザーと合意してから再 push

## やらないこと

- ユーザーの確認なしに `git push`
- `--force` push（`main` には絶対に行わない）
- 失敗したワークフローの再試行を無闇に繰り返す（原因特定が先）
