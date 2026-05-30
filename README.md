<p align="center">
  <img src="https://raw.githubusercontent.com/7032/FB3M7/main/assets/icon.png" width="128" height="128" alt="FB3M7 icon">
</p>

<h1 align="center">FB3M7</h1>

<p align="center">
  富士通 FM-7 <b>F-BASIC V3.0</b> のプログラミングを、現代の VS Code で快適に。<br>
  <i>FB3M7 — language support for Fujitsu FM-7 F-BASIC V3.0: syntax highlighting, line numbering, renumber, jump, diagnostics and more.</i>
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=7032.fb3m7"><img src="https://img.shields.io/visual-studio-marketplace/v/7032.fb3m7?label=Marketplace&color=2C68C3&logo=visualstudiocode" alt="Marketplace Version"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=7032.fb3m7"><img src="https://img.shields.io/visual-studio-marketplace/i/7032.fb3m7?label=Installs&color=2C68C3" alt="Installs"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=7032.fb3m7"><img src="https://img.shields.io/visual-studio-marketplace/r/7032.fb3m7?label=Rating&color=2C68C3" alt="Rating"></a>
  <a href="https://github.com/7032/FB3M7/releases"><img src="https://img.shields.io/github/v/release/7032/FB3M7?label=Release" alt="GitHub Release"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-green" alt="License: MIT"></a>
</p>

---

**FB3M7** は、レトロ機 FM-7 の F-BASIC V3.0 ソース（`.BAS`）を、行番号ベースの古典 BASIC ならではの操作感を保ちつつ、最新エディタの支援機能つきで編集できる言語拡張です。

## ✨ 機能

| 機能 | 説明 |
|---|---|
| 🎨 **シンタックスハイライト** | 命令・関数・演算子・文字列・コメント（`REM` / `'`）・数値（`&H` / `&O`）・行番号、`PLAY` の MML を色分け |
| 🔢 **行番号の自動割り振り** | 行番号で始まる行の末尾で Enter すると、増分（既定 10）で次番号を自動挿入 |
| ♻️ **Auto Renumber** | 全行を振り直し。`GOTO` / `GOSUB` / `THEN` / `ELSE` / `RESTORE` / `RESUME` / `RUN` の参照先も自動追従 |
| 🧮 **番号なし行への一括採番** | 番号なしで書いた行へ後からまとめて行番号を付与 |
| 🔗 **GOTO / GOSUB ジャンプ** | 行番号参照が下線リンクに。クリック／F12／Ctrl+Click で定義行へ移動 |
| 🩺 **診断** | 存在しない行番号参照、行番号の重複・逆順、`FOR`/`NEXT`・`WHILE`/`WEND` の不一致を検出 |
| 🗂️ **アウトライン** | `REM` / `'` のコメント見出しと `GOSUB` の飛び先（サブルーチン）を一覧表示 |
| ⌨️ **入力補完** | 予約語（命令・関数・演算子）の補完候補 |
| 💡 **ホバー** | 予約語の分類と簡易説明をポップアップ |
| 🔠 **自動大文字化** | 実機同様、入力中にコード（予約語・変数名・関数名など）を自動で大文字へ。コマンドで一括変換も可（文字列リテラルとコメント本文は原文保持） |

対象拡張子は `.BAS`、文字コードは UTF-8 を基本とします（対象方言: FM-7 F-BASIC V3.0）。

## 🚀 インストール

VS Code の拡張機能ビュー（`Ctrl+Shift+X`）で「**FB3M7**」を検索し、**インストール** を押してください。

## 🎮 使い方

1. `.BAS` ファイルを開く（言語が自動で「F-BASIC 3.0」になります）。
2. 行番号付きの行末で **Enter** すると次の行番号が自動で入ります。
3. コマンドパレット（`Ctrl+Shift+P`）から:
   - **FB3M7: Auto Renumber (行番号を振り直す)**
   - **FB3M7: 番号なし行に行番号を一括付与**
4. `GOTO 100` の `100` を **クリック** すると行 100 へジャンプします。
5. 小文字で書いた予約語・変数を**まとめて大文字化**するには `Ctrl+Shift+U`（mac: `Cmd+Shift+U`）。コマンド「**FB3M7: コードを大文字に変換**」と同じ。

## ⌨️ ショートカット

| 操作 | キー |
|---|---|
| コードを大文字に変換（予約語・変数名を一括） | `Ctrl+Shift+U`（mac: `Cmd+Shift+U`） |
| 次の行番号を自動挿入 | `Enter`（行番号付きの行末で） |

## ⚙️ 設定

| 設定キー | 既定値 | 説明 |
|---|---|---|
| `fbasic.lineNumber.increment` | `10` | 自動採番・Renumber の増分 |
| `fbasic.lineNumber.start` | `10` | Renumber の開始行番号 |
| `fbasic.autoLineNumber.enabled` | `true` | Enter での自動採番の有効/無効 |
| `fbasic.autoUppercase` | `true` | 入力時にコード（予約語・変数名等）を自動で大文字化 |

## 📌 対象範囲・制限

- 対象: **FM-7 F-BASIC V3.0** 標準。
- 非対応: プリンタ命令（`LPRINT` / `LLIST` / `HARDCOPY` 等）、漢字 ROM 関連。
- 文字コードは UTF-8 を基本とします。

## 📄 ライセンス

本拡張のコード・アイコン・ドキュメントは [MIT License](./LICENSE) のもとで提供されます。

## ⚖️ 商標・免責事項 / Trademarks & Disclaimer

- 「FM-7」「FM-77」「FM77AV」「F-BASIC」および「富士通 / FUJITSU」は、富士通株式会社の商標または登録商標です。
- 「Microsoft」「Visual Studio Code」「VS Code」は、米国 Microsoft Corporation の商標です。
- その他、本ドキュメントに記載の会社名・製品名は、各社の商標または登録商標です。

本拡張は有志による **非公式かつ独立した** ソフトウェアであり、富士通株式会社、Microsoft Corporation、その他の権利者と、提携・後援・承認・出資その他いかなる関係もありません。製品名・商標は、対応する機種および言語を識別する目的（**指名的使用 / nominative use**）でのみ使用しており、権利者による推奨を示すものではありません。

本拡張は、原機種の **ROM・ファームウェア・その他の著作物を一切含みません**。提供するのは、独自に作成したエディタ支援機能（シンタックス定義・編集ツール）のみです。参照する言語の予約語名は、言語ツールを提供するための事実情報として用いています。

本ソフトウェアは MIT ライセンスのもと「現状有姿（AS IS）」で提供され、明示黙示を問わずいかなる保証もありません。商標に関する権利はすべて各権利者に帰属します。権利者から要請があった場合、名称・表記を変更することがあります。

> **English:** "FM-7", "FM-77", "FM77AV", "F-BASIC", and "Fujitsu" are trademarks or registered trademarks of Fujitsu Limited. "Microsoft", "Visual Studio Code", and "VS Code" are trademarks of Microsoft Corporation. This is an **unofficial, independent** extension and is **not** affiliated with, endorsed, sponsored by, or associated with Fujitsu Limited, Microsoft Corporation, or any other rights holder. All product and company names are used for identification (**nominative**) purposes only and do not imply endorsement. This extension contains **no ROM, firmware, or other copyrighted material** from the original system; it provides only independently authored editor tooling. Provided "AS IS" under the MIT License, without warranty of any kind. All trademarks are the property of their respective owners.

詳細は同梱の [NOTICE](./NOTICE.md) を参照してください。
