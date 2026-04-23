---
name: triage
description: Triage GitHub Issues — read the issue, apply labels (type/area/priority/status), suggest a first-response comment, and assign milestone. Use when the user asks to triage, label, categorize, sort Issues, or 整理して / ラベル付けて.
---

# triage — Issue のラベル付けと優先度判定

## いつ使うか

- 「Issue 整理して」「#N 見て」「ラベル付けて」
- 新規 Issue の初動対応
- 定期的な棚卸し（週次など）

## 既定ラベル

プロジェクトでは以下のラベル体系を使う。不足していれば `gh label create` で追加すること。

### type:

- `type:post` — 記事追加・更新
- `type:bug` — 動作不良
- `type:feature` — 新機能
- `type:docs` — ドキュメント
- `type:chore` — 雑務（依存更新など）

### area:

- `area:content` — 記事本体
- `area:design` — 見た目・CSS
- `area:infra` — ビルド・デプロイ
- `area:ci` — GitHub Actions
- `area:claude` — `.claude/` 配下

### priority:

- `priority:p0` — 即対応（公開サイトが壊れている等）
- `priority:p1` — 近日中
- `priority:p2` — いつか

### status:

- `status:triaged` — 分類済み
- `status:in-progress` — 作業中
- `status:blocked` — ブロック中
- `status:needs-info` — 情報待ち

### その他

- `good-first-issue`
- `help-wanted`

## 手順

1. `gh issue view <n> --comments` で全文取得
2. 次を判断:
   - type / area / priority
   - 情報が不足していれば `status:needs-info` + 質問コメント案
3. 実行コマンドを **ユーザーに提示してから** 実行:

   ```bash
   gh issue edit <n> --add-label "type:X,area:Y,priority:Z,status:triaged"
   ```

4. 一次コメントを提案する場合:

   ```bash
   gh issue comment <n> --body "..."
   ```

5. マイルストーンが明確なら `--milestone "..."` で付与
6. 結果をユーザーに報告

## 初回セットアップ（ラベルがまだ無い場合）

```bash
# 既存確認
gh label list

# 不足分を作成（色は適宜）
gh label create "type:post"        --color "0E8A16"
gh label create "type:bug"         --color "D73A4A"
gh label create "type:feature"     --color "A2EEEF"
gh label create "type:docs"        --color "0075CA"
gh label create "type:chore"       --color "CFD3D7"
gh label create "area:content"     --color "FBCA04"
gh label create "area:design"      --color "C5DEF5"
gh label create "area:infra"       --color "5319E7"
gh label create "area:ci"          --color "5319E7"
gh label create "area:claude"      --color "BFD4F2"
gh label create "priority:p0"      --color "B60205"
gh label create "priority:p1"      --color "D93F0B"
gh label create "priority:p2"      --color "FBCA04"
gh label create "status:triaged"   --color "C2E0C6"
gh label create "status:in-progress" --color "0E8A16"
gh label create "status:blocked"   --color "E99695"
gh label create "status:needs-info" --color "D876E3"
```

## やらないこと

- ラベル変更やコメント投稿の無確認実行
- Issue のクローズ（`gh issue close`）は明示指示があるときだけ
