# Change Log

本拡張のすべての主要な変更を記録します。フォーマットは [Keep a Changelog](https://keepachangelog.com/) に準拠します。

## [Unreleased]
### Added
- 自動大文字化（実機同様、コード＝予約語・変数名・関数名等を入力時に大文字化 `fbasic.autoUppercase`、および「FB3M7: コードを大文字に変換」コマンド）。文字列リテラルとコメント本文は原文保持。
- コードを一括大文字化するショートカット `Ctrl+Shift+U`（mac: `Cmd+Shift+U`）。

## [0.0.1]
### Added
- FM-7 F-BASIC V3.0 のシンタックスハイライト（命令・関数・演算子・文字列・コメント・行番号・数値、`PLAY` の MML）
- 行番号の自動割り振り（行末 Enter で増分採番）
- Auto Renumber（`GOTO`/`GOSUB` 等の参照も追従）／番号なし行への一括採番
- `GOTO`/`GOSUB` の行番号クリック・F12 でのジャンプ
- 診断: 存在しない行番号参照・行番号の重複/順序・`FOR`/`NEXT`・`WHILE`/`WEND` の対応
- アウトライン（コメント見出し・サブルーチン）
- 予約語の入力補完
- 予約語のホバー説明
- 設定: 採番の増分・開始番号・自動採番の有効化
- 商標表記・免責事項（README の「商標・免責事項」節および同梱 `NOTICE.md`）
