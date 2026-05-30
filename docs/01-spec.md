# 機能仕様

## 対象

- **エディタ**: VS Code 拡張機能（TypeScript 実装）
- **対象言語**: FM-7 F-BASIC V3.0
- **ファイル拡張子**: `.BAS`
- **文字コード**: UTF-8 を基本（実機の Shift-JIS は将来課題）

## 機能一覧

### 1. シンタックスハイライト
TextMate grammar (`syntaxes/fbasic.tmLanguage.json`, scope `source.fbasic`) で実現。

| 要素 | スコープ | 備考 |
|---|---|---|
| 行頭の行番号 | `entity.name.function.line-number.fbasic` | ジャンプ先として強調 |
| ステートメント | `keyword.control.fbasic` | GOTO, PRINT, FOR ... |
| 組み込み関数 | `support.function.fbasic` | CHR$, LEN, RND ... |
| 語演算子 | `keyword.operator.word.fbasic` | AND, OR, NOT, MOD ... |
| 記号演算子 | `keyword.operator.fbasic` | `<=`, `<>`, `+` ... |
| 文字列 | `string.quoted.double.fbasic` | `"..."`（行末で自動終端） |
| コメント | `comment.line.rem.fbasic` / `comment.line.apostrophe.fbasic` | `REM` / `'` |
| 数値 | `constant.numeric.*` | `&H`, `&O`, 浮動小数 |

### 2. 行番号の自動割り振り（Enter）
- 実装: `src/autoNumber.ts`、コマンド `fbasic.onEnter`、`enter` キーにバインド。
- 行番号で始まる行の**番号より後ろ**にカーソルがある状態で Enter すると、改行に続けて「現在番号 + 増分」を自動挿入。
- 次番号が既存行と衝突する場合・空行・番号なし行・番号内編集中は通常改行にフォールバック。
- 増分は `fbasic.lineNumber.increment`（既定 10）。`fbasic.autoLineNumber.enabled` で無効化可。

### 3. Auto Renumber
- 実装: `src/renumber.ts`、コマンド `fbasic.renumber`。
- 出現順に旧行番号を収集し、`start`（既定 10）から `increment`（既定 10）刻みで新番号を割当て。
- 行頭番号に加え、`GOTO` / `GOSUB` / `THEN` / `ELSE` / `RESTORE` / `RUN` / `RESUME` の後続行番号（`ON 〜 GOTO/GOSUB` のカンマ区切りリストを含む）も追従して書き換え。
- 文字列・コメント部分は書き換え対象から除外（`findCommentStart` で判定）。
- 参照先が存在しない番号があれば警告表示（値は温存）。

### 4. 番号なし行への一括採番
- 実装: `src/renumber.ts`、コマンド `fbasic.addLineNumbers`。
- 既存の番号付き行は温存し、番号なしの非空行へ「直前番号 + 増分」を付与（衝突は次の空き番号へ）。

### 5. GOTO / GOSUB ジャンプ
- 実装: `src/jumpProvider.ts`。
- **DocumentLinkProvider**: 参照行番号を下線リンク化し、クリックで `fbasic.revealLine` 経由ジャンプ。
- **DefinitionProvider**: F12 / Ctrl+Click でジャンプ先（その番号で始まる行）へ移動。
- ジャンプ対象は「参照キーワードの後続にある数値」かつ「その番号で始まる行が存在する」場合のみ。

### 6. 診断（Diagnostics）
- 実装: `src/diagnostics.ts`。
- 存在しない行番号への参照（`GOTO`/`GOSUB`/`THEN`/`ELSE`/`RESTORE`/`RESUME`/`RUN`）→ エラー。`0`（`ON ERROR GOTO 0`/`RESUME 0`）は除外。
- 行番号の重複 → エラー。行番号が昇順でない → 警告。
- `onDidOpen`/`onDidChange`/`onDidClose` で更新。

### 7. アウトライン（DocumentSymbol）
- 実装: `src/outline.ts`。
- `REM`/`'` のコメント見出し（`SymbolKind.String`）と、`GOSUB` の飛び先行（`SymbolKind.Function`「サブルーチン N」）を表示。

### 8. 入力補完（Completion）
- 実装: `src/completion.ts`、予約語データは `src/keywords.ts`。
- 命令・補助語・関数・演算子を補完。コメント内・文字列内では抑制。

### 9. 自動大文字化（Uppercase）
- 実装: `src/uppercase.ts`。実機同様、コード（予約語・変数名・関数名・16進数など）を大文字で扱う。
- 入力時: コード領域に打たれた英小文字を 1 文字ごとに即時大文字化（設定 `fbasic.autoUppercase`、既定 true）。
- コマンド `fbasic.uppercase`「FB3M7: コードを大文字に変換」でドキュメント全体を一括変換。ショートカット `Ctrl+Shift+U`（mac: `Cmd+Shift+U`、`editorLangId == fbasic` 限定）。
- **文字列リテラル**（`"..."` の中）と**コメント本文**（`REM` / `'` の後ろ）は原文を保持。REM 語自体は大文字化（`"` の数で文字列内を判定、`findCommentStart` でコメント境界を判定）。

## 今後の検討事項（非スコープ）
- Shift-JIS の入出力対応
- ホバー表示（キーワードの説明）、シグネチャヘルプ
- `FOR`/`NEXT`・`WHILE`/`WEND`・`GOSUB`/`RETURN` の対応チェック
