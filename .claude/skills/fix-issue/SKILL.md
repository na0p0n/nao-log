---
name: fix-issue
description: Implement a fix for a GitHub Issue — create a branch, make the minimal change, run checks, commit, and open a PR that closes the issue. Use when the user asks to fix / address / resolve issue #N.
---

# fix-issue — Issue 起点の修正 PR を作る

## いつ使うか

- 「Issue #N を修正して」「#N 直して」「#N 対応して」
- バグレポートへの即応

## 手順

### 1. Issue の把握

```bash
gh issue view <n> --comments
```

- 再現手順があれば実行して問題を再現
- 仕様が曖昧なら、コメントで確認してから作業開始

### 2. ブランチ作成

命名規則:

- `fix/<n>-<slug>` — バグ修正
- `feat/<n>-<slug>` — 機能追加
- `docs/<n>-<slug>` — ドキュメント
- `chore/<n>-<slug>` — その他

```bash
git checkout main && git pull
git checkout -b fix/<n>-<short-slug>
```

### 3. 最小変更で修正

- Issue の範囲外のリファクタ・整形はしない（見つけたら別 Issue を提案）
- テスト or 再現手順を残す

### 4. チェック

```bash
npm run check
npm run lint
npm run build   # 挙動が変わる可能性があるときだけ
```

失敗したら原因を特定して修正。lint 警告は可能な限り解消。

### 5. コミット

Conventional Commits 準拠:

- `fix: <概要> (#<n>)`
- `feat: <概要> (#<n>)`
- `docs: <概要> (#<n>)`
- `chore: <概要> (#<n>)`

### 6. PR を作る（ユーザー確認の上で）

```bash
gh pr create --title "fix: <概要> (#<n>)" --body "$(cat <<'EOF'
Closes #<n>

## 変更内容
- ...

## 動作確認
- ...
EOF
)"
```

### 7. ラベル更新

```bash
gh issue edit <n> --add-label "status:in-progress" --remove-label "status:triaged"
```

マージ後は `status:in-progress` を外す（PR マージで Issue は自動クローズ）。

## やらないこと

- `git push` / PR 作成の無確認実行
- Issue で明示されていない改善の同時投入
- `--force-with-lease` を含む force push（履歴が必要な場合のみユーザー相談）
