# 公開手順（VS Code Marketplace）

VS Code Marketplace に公開するための手順とチェックリスト。

## 前提（初回のみ）

1. **Azure DevOps organization** を作成（無料）: https://dev.azure.com/
2. **Personal Access Token (PAT)** を発行
   - Organization: All accessible organizations
   - Scopes: **Marketplace → Manage**
3. **Publisher** を作成: https://marketplace.visualstudio.com/manage
   - Publisher ID を `package.json` の `"publisher"` に合わせる（現在: `7032`）。
   - ※ID が異なる場合は `package.json` の `publisher` を実際の ID に変更すること。

## 公開メタデータ（設定済み）

`package.json`:
- `name` / `displayName` / `description` / `version`
- `publisher` … 要・実 Publisher ID 整合
- `icon` … `assets/icon.png`（256×256）
- `categories` … Programming Languages, Linters
- `keywords` … 検索用
- `galleryBanner` … 一覧バナー色
- `repository` / `bugs` / `homepage` / `license`

ストア掲載本文 = `README.md`、変更履歴 = `CHANGELOG.md`。

## パッケージと公開

```bash
# パッケージ（ローカル .vsix を生成して動作確認）
npx @vscode/vsce package

# ログイン（PAT を入力）
npx @vscode/vsce login 7032

# 公開
npx @vscode/vsce publish
# バージョンを上げて公開する場合:
npx @vscode/vsce publish patch   # 0.0.1 -> 0.0.2
```

## 公開前チェックリスト

- [ ] `README.md` の内容・スクリーンショットが最新
- [ ] `CHANGELOG.md` に当バージョンの項目がある
- [ ] `package.json` の `version` を更新した
- [ ] `publisher` が実在の Publisher ID と一致
- [ ] `.vsix` を実機 VS Code でインストールし主要機能を確認
- [ ] `.vscodeignore` によりソース・開発ファイル・ローカル専用ファイルが同梱されていない
- [ ] アイコンが正しく表示される

## 注意

- README 内の相対パス画像（`assets/icon.png` 等）は、リポジトリが **public** の場合に Marketplace 上で解決される。private のままだと画像が表示されないため、公開時はリポジトリ公開設定も確認する。
- 画像を確実に表示したい場合は、README の画像 URL を GitHub の raw 絶対 URL にする。
