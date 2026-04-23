---
name: release
description: Cut a new release — bump CHANGELOG, tag main, and create a GitHub Release with auto-generated notes. Use when the user asks to release, cut a tag, or update the changelog.
---

# release — リリースノートとタグ発行

## いつ使うか

- 「リリースして」「タグ切って」「CHANGELOG 更新して」
- 節目のマイルストーン（記事 10 本到達、デザイン刷新など）

## 前提

- Semantic Versioning（`MAJOR.MINOR.PATCH`）
- `CHANGELOG.md` は Keep a Changelog 形式

## 手順

1. 前回タグ: `git describe --tags --abbrev=0 2>/dev/null || echo "none"`
2. 差分: `git log <prev>..HEAD --oneline` を取得
3. 次バージョンを判断して **ユーザーに提案**:
   - **major**: URL 構造変更 / feed 互換破壊 / 大規模リデザイン
   - **minor**: 新セクション・新機能（タグページ追加など）
   - **patch**: 記事追加 / 誤字修正 / 軽微な調整
4. `CHANGELOG.md` に追記:

   ```markdown
   ## [X.Y.Z] - YYYY-MM-DD

   ### Added
   - 記事: 「タイトル」
   ### Changed
   - ...
   ### Fixed
   - ...
   ```

5. コミット: `chore(release): vX.Y.Z`
6. タグ: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
7. **ユーザー確認の上で** `git push && git push origin vX.Y.Z`
8. `gh release create vX.Y.Z --generate-notes --verify-tag`
9. URL をユーザーに報告

## やらないこと

- 既存タグを上書き（`-f` や delete + recreate）
- リリースノートの自動編集（`--generate-notes` の出力に手を入れる場合はユーザー承認）
- push とリリース作成の無確認実行
