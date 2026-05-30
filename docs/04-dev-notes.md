# 開発メモ

## ディレクトリ構成
```
VSPlugIn/
├── .vscode/                 # launch.json / tasks.json（F5 デバッグ用）
├── docs/                    # 仕様・設計・メモ（本フォルダ）
├── examples/sample.BAS      # 動作確認用サンプル
├── src/
│   ├── extension.ts         # activate: コマンド/プロバイダ登録
│   ├── autoNumber.ts        # Enter 自動採番
│   ├── renumber.ts          # Auto Renumber / 一括採番
│   ├── jumpProvider.ts      # GOTO/GOSUB ジャンプ（Link/Definition）
│   ├── diagnostics.ts       # 行番号の重複/順序/未定義参照の検査
│   ├── outline.ts           # アウトライン（コメント見出し/サブルーチン）
│   ├── completion.ts        # 予約語の入力補完
│   ├── hover.ts             # 予約語のホバー説明
│   ├── uppercase.ts         # 予約語の自動大文字化（入力時/コマンド）
│   ├── keywords.ts          # 予約語データ
│   └── util.ts              # 行番号パース・コメント判定等の共通処理
├── syntaxes/fbasic.tmLanguage.json  # シンタックス定義
├── language-configuration.json
├── package.json             # 拡張マニフェスト
└── tsconfig.json
```

## ビルド / 実行
```bash
npm install
npm run compile      # out/ へ出力
# VS Code でフォルダを開き F5 → 拡張機能開発ホストで sample.BAS を開いて確認
```

## 動作確認チェックリスト
- [ ] `.BAS` を開くと色分けされる
- [ ] 行番号付き行の末尾で Enter → 次番号が自動挿入される
- [ ] `F-BASIC: Auto Renumber` で番号と GOTO/GOSUB 参照が振り直される
- [ ] GOTO/GOSUB の番号をクリック → 対象行へジャンプ
- [ ] F12 / Ctrl+Click でも同様にジャンプ

## 実装済み（追加分）
- 診断: 未定義行番号参照・重複・順序（[diagnostics.ts](../src/diagnostics.ts)）
- アウトライン: コメント見出し・サブルーチン（[outline.ts](../src/outline.ts)）
- 補完: 予約語（[completion.ts](../src/completion.ts) / [keywords.ts](../src/keywords.ts)）

## TODO / 既知の課題
- ホバーでキーワード説明、シグネチャヘルプ
- `FOR`/`NEXT`・`WHILE`/`WEND`・`GOSUB`/`RETURN` の対応関係チェック
- Shift-JIS 入出力対応の検討
- グラフィック/サウンド命令の引数書式ハイライト強化（`LINE` の B/BF、`PLAY` MML 全コマンド等）
- テスト（vscode-test）の整備

## 補足
- `command:fbasic.revealLine` を DocumentLink のターゲットに使用。コマンド URI は登録済みコマンドのみ有効。
- F-BASIC は大文字小文字を区別しない想定で grammar / 正規表現は `(?i)` / `i` フラグを使用。
