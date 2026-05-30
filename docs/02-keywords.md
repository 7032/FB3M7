# F-BASIC V3.0 予約語一覧

本拡張のシンタックスハイライトが対応する FM-7 **F-BASIC V3.0** の予約語一覧。
富士通純正の公開資料（`../FM7docs/`：F-BASIC 文法書 1982年、ユーザーズマニュアル システム解説 第5〜13章、F-BASIC 解析マニュアル）に基づき整理した。

## 凡例・方針

- **大文字小文字は区別しない**（実機同様）。ハイライトは大小どちらでも有効。
- `$` で終わる語は文字列を返す関数。
- `(` 付き（`TAB(` `SPC(`）は構文上 `(` を伴うが、本表では語のみ記す。
- **対象外（サポートしない）**:
  - プリンタ … `LPRINT` `LLIST` `LPOS` `HARDCOPY`（`HARDC`）
  - 漢字ROM … 漢字表示・JIS コード関連命令
- **V3.0 に非搭載のため除外**: `STICK` `STRIG` `PAD`（ジョイスティック関数）、`INP` `OUT` `WAIT`（ポート I/O。6809 はメモリマップ I/O のため `POKE`/`PEEK` を使う）、`ERASE`（動的配列消去）。

---

## 1. 命令・コマンド（statement / command）

TextMate スコープ: `keyword.control.fbasic`

### プログラム編集・制御
`AUTO` `RENUM` `LIST` `UNLIST` `DELETE` `EDIT` `NEW` `RUN` `CONT` `STOP` `END` `CLEAR` `TRON` `TROFF` `MON`

### 制御構造・分岐
`IF` `THEN` `ELSE` `FOR` `TO` `STEP` `NEXT` `GOTO` `GOSUB` `GO` `SUB` `RETURN` `ON` `WHILE` `WEND` `ERROR` `RESUME`

> `GOTO`/`GOSUB` は `GO TO`/`GO SUB` と分かち書きしても可（`GO` `TO` `SUB` も予約語）。
> `WHILE` 〜 `WEND` は V3.0 に搭載されている構造化ループ。

### 変数・データ・定義
`LET` `DIM` `SWAP` `DATA` `READ` `RESTORE` `DEF` `FN` `DEFINT` `DEFSNG` `DEFDBL` `DEFSTR` `COMMON` `RANDOMIZE`

> `DEF FN` でユーザー関数定義。`COMMON` は `CHAIN` 間で共有する変数の宣言。

### 画面・コンソール入出力
`PRINT` `USING` `INPUT` `LOCATE` `CONSOLE` `CLS` `WIDTH` `KEY`

> `PRINT USING` で書式付き出力。`KEY` は PF キー定義・表示（`KEY ON/OFF/LIST`）。

### グラフィック
`SCREEN` `COLOR` `LINE` `PSET` `PRESET` `PAINT` `CIRCLE` `SYMBOL` `GCURSOR` `GET` `PUT`

> `LINE` は `B`（枠）/`BF`（塗りつぶし）オプションを取る。`GCURSOR` はグラフィックカーソル位置指定。`GET`/`PUT` はグラフィック矩形転送（ファイル用 `GET`/`PUT` と同綴）。

### サウンド
`PLAY` `SOUND` `BEEP`

> `PLAY` は MML（第4節）、`SOUND` は PSG レジスタ直接制御。

### メモリ・システム・拡張
`POKE` `EXEC` `INTERVAL` `BUBINI` `BUBW` `BUBR`

> `INTERVAL` はタイマ割込（`INTERVAL ON/OFF/STOP`）。`BUBINI`/`BUBW`/`BUBR` はバブルメモリ I/O（FM-7 拡張）。メモリ書き込みは `POKE`、読み出しは関数 `PEEK`。

### ファイル（逐次・ランダム共通）
`OPEN` `CLOSE` `FIELD` `GET` `PUT` `LSET` `RSET` `WRITE`

> `INPUT`/`PRINT`/`WRITE` はファイル番号付き（`INPUT#` `PRINT#` `WRITE#`）でファイル入出力にもなる。`FIELD`/`LSET`/`RSET` はランダムファイル用。

補助語（ファイルモード等、スコープ `storage.modifier.fbasic`）:
`AS` `OUTPUT` `APPEND` `RANDOM` `OFF` `ALL`

### カセットテープ
`CSAVE` `CLOAD` `CLOADM` `SAVE` `LOAD` `SAVEM` `LOADM` `MOTOR` `VERIFY` `SKIPF`

> `SKIPF` はテープのファイルスキップ。`SAVEM`/`LOADM`/`CLOADM` は機械語の保存・読込。

### シリアル通信（RS-232C）・通信ターミナル
`COM` `TERM` `CONNECT`

> `COM`（`COM0:`）は RS-232C デバイスの汎用 I/O。`TERM` は通信ターミナルモード、`CONNECT` は回線接続。

### ディスク
`FILES` `KILL` `NAME` `COPY` `SET` `MERGE` `CHAIN` `DSKINI` `VOLCOPY` `MCOPY`

> `CHAIN` は別プログラム連鎖呼び出し、`MERGE` は併合。`DSKINI` 初期化、`VOLCOPY`/`MCOPY` は複写系。

---

## 2. 組み込み関数（function）

TextMate スコープ: `support.function.fbasic`

### 数値
`ABS` `SGN` `INT` `FIX` `SQR` `SIN` `COS` `TAN` `ATN` `EXP` `LOG` `RND` `CINT` `CSNG` `CDBL`

### 文字列
`ASC` `CHR$` `LEN` `LEFT$` `RIGHT$` `MID$` `STR$` `VAL` `STRING$` `SPACE$` `HEX$` `OCT$` `INSTR` `INKEY$` `INPUT$`

### システム・画面・入力
`PEEK` `POS` `CSRLIN` `FRE` `VARPTR` `USR` `TIME$` `DATE$` `ERL` `ERR` `TAB` `SPC` `POINT` `SCREEN` `PEN` `ANPORT`

> `SCREEN(x,y)` は画面コード読取り関数（命令 `SCREEN` と同綴）。`PEN` はライトペン、`ANPORT` はアナログ入力ポート。

### ファイル・ディスク
`EOF` `LOC` `LOF` `DSKF` `DSKI$` `DSKO$`

### 数値⇔文字列変換（ランダムファイル用）
`CVI` `CVS` `CVD` `MKI$` `MKS$` `MKD$`

---

## 3. 演算子（operator）

- **語演算子** (`keyword.operator.word.fbasic`): `AND` `OR` `NOT` `XOR` `EQV` `IMP` `MOD`
- **記号演算子** (`keyword.operator.fbasic`): `=` `<>` `<` `>` `<=` `>=` `+` `-` `*` `/` `^` `\`（整数除算）

---

## 4. PLAY 文の MML（Music Macro Language）

`PLAY "..."` の文字列内コマンド。スコープ `*.mml.*.fbasic` で色分け。

| 記号 | 意味 |
|---|---|
| `C D E F G A B` | 音符 |
| `R` | 休符 |
| `#` `+` / `-` | シャープ / フラット |
| `O`n | オクターブ指定 |
| `<` `>` | オクターブ上げ下げ |
| `L`n | 音長 |
| `T`n | テンポ |
| `V`n | 音量 |
| `S`n | エンベロープ形状 |
| `M`n | エンベロープ周期 |
| `N`n | 音番号指定 |
| `.` | 付点 |

---

## 5. 対象外（サポートしない予約語）

ユーザー指定により、以下は色分け対象に**含めない**:

- **プリンタ**: `LPRINT` `LLIST` `LPOS` `HARDCOPY`（`HARDC`）
- **漢字ROM**: 漢字表示・JIS コード関連

また V3.0 に存在しないため `STICK` `STRIG` `PAD` `INP` `OUT` `WAIT` `ERASE` も対象外。

---

## 6. 補足

- グラフィック/サウンド命令の引数書式（`LINE` の `B`/`BF`、`PAINT` の境界色、`SOUND` のレジスタ番号、`PLAY` MML の全コマンド網羅）は今後の精査で構文ハイライトを強化する余地がある。
- `SCREEN` のようにステートメントと関数で同綴の語は、本表ではステートメント側に分類している（ハイライトはどちらの用法でも有効）。
