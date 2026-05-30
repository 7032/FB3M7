import * as vscode from 'vscode';
import { STATEMENTS, CLAUSES, FUNCTIONS, OPERATORS } from './keywords';
import { findCommentStart } from './util';

/** 主要な予約語の簡易説明（F-BASIC V3.0） */
const DESCRIPTIONS: Record<string, string> = {
  // 制御
  IF: '条件分岐。`IF 条件 THEN 文 [ELSE 文]`',
  THEN: '`IF` の真の場合の処理を示す',
  ELSE: '`IF` の偽の場合の処理を示す',
  FOR: '繰り返し開始。`FOR 変数=初期 TO 終値 [STEP 増分]`',
  NEXT: '`FOR` ループの終端',
  TO: '`FOR` の終値を示す',
  STEP: '`FOR` の増分を示す',
  WHILE: '条件繰り返し開始。`WHILE 条件` 〜 `WEND`',
  WEND: '`WHILE` ループの終端',
  GOTO: '指定行番号へ無条件ジャンプ',
  GOSUB: '指定行番号のサブルーチンを呼び出す',
  RETURN: '`GOSUB` から呼び出し元へ戻る',
  ON: '`ON 式 GOTO/GOSUB 行,…` / `ON ERROR GOTO 行`',
  END: 'プログラムを終了',
  STOP: 'プログラムを一時停止',
  CONT: '`STOP` 後に実行を再開',
  ERROR: 'エラーを強制発生。`ERROR 番号`',
  RESUME: 'エラー処理から復帰。`RESUME [NEXT|行番号]`',
  // 変数・データ
  LET: '代入（`LET` は省略可）',
  DIM: '配列宣言。`DIM 配列(要素数)`',
  DATA: '`READ` で読み込む定数データ',
  READ: '`DATA` から値を読み込む',
  RESTORE: '`DATA` 読み出し位置を戻す',
  DEF: 'ユーザー関数定義。`DEF FN名(引数)=式`',
  DEFINT: '既定で整数型にする変数の頭文字を指定',
  DEFSNG: '既定で単精度実数型にする',
  DEFDBL: '既定で倍精度実数型にする',
  DEFSTR: '既定で文字列型にする',
  SWAP: '2 つの変数の値を交換',
  COMMON: '`CHAIN` 先と共有する変数を宣言',
  RANDOMIZE: '乱数系列を初期化',
  // 画面・入出力
  PRINT: '画面に出力。`PRINT [USING 書式;] 式`',
  USING: '`PRINT USING` の書式指定',
  INPUT: 'キー入力を変数へ読み込む',
  LOCATE: 'カーソル位置を指定。`LOCATE x,y[,カーソル]`',
  CONSOLE: 'テキスト画面のスクロール範囲等を設定',
  CLS: '画面を消去',
  WIDTH: '表示桁数を指定',
  KEY: 'PF キーの定義・表示',
  // グラフィック
  SCREEN: '画面モードを設定（関数では画面コード読取）',
  COLOR: '表示色を指定',
  LINE: '直線/矩形を描画。`LINE (x,y)-(x,y)[,色][,B|BF]`',
  PSET: '点を描画。`PSET (x,y)[,色]`',
  PRESET: '点を消去',
  PAINT: '閉領域を塗りつぶす',
  CIRCLE: '円・円弧を描画',
  SYMBOL: '拡大文字を表示',
  GCURSOR: 'グラフィックカーソル位置を指定',
  // サウンド
  PLAY: 'MML で音楽を演奏。`PLAY "文字列"`',
  SOUND: 'PSG レジスタを直接制御',
  BEEP: 'ブザーを鳴らす',
  // メモリ・拡張
  POKE: 'メモリへ書き込む。`POKE アドレス,値`',
  EXEC: '機械語ルーチンを実行',
  INTERVAL: 'タイマ割込を設定（`ON INTERVAL`）',
  // ファイル・テープ・ディスク
  OPEN: 'ファイル/デバイスを開く',
  CLOSE: 'ファイルを閉じる',
  FIELD: 'ランダムファイルのバッファを定義',
  GET: 'ランダムレコード読込／グラフィック転送',
  PUT: 'ランダムレコード書込／グラフィック転送',
  LSET: 'フィールドへ左詰め代入',
  RSET: 'フィールドへ右詰め代入',
  WRITE: 'カンマ区切りで出力',
  CSAVE: 'プログラムをテープへ保存',
  CLOAD: 'プログラムをテープから読込',
  CLOADM: '機械語をテープから読込',
  SAVE: 'プログラムを保存',
  LOAD: 'プログラムを読込',
  SAVEM: '機械語を保存',
  LOADM: '機械語を読込',
  MOTOR: 'テープのモーターを制御',
  VERIFY: '保存内容を照合',
  MERGE: '別プログラムを併合読込',
  CHAIN: '別プログラムを連鎖呼び出し',
  FILES: 'ディスクのファイル一覧',
  KILL: 'ファイルを削除',
  NAME: 'ファイル名を変更',
  COPY: 'ファイルを複写',
  DSKINI: 'ディスクを初期化',
  // 通信
  COM: 'RS-232C デバイスの入出力',
  TERM: '通信ターミナルモード',
  CONNECT: '回線を接続',
  // 編集系
  AUTO: '自動行番号入力',
  RENUM: '行番号を振り直す',
  LIST: 'プログラムを表示',
  DELETE: '行を削除',
  EDIT: '行を編集',
  NEW: 'プログラムを消去',
  RUN: 'プログラムを実行',
  CLEAR: '変数を初期化し領域を確保',
  TRON: 'トレースを有効化',
  TROFF: 'トレースを無効化',
  MON: 'モニタを起動',
  // 関数
  ABS: '絶対値', SGN: '符号(-1/0/1)', INT: '小数切り捨て(床)', FIX: '小数切り捨て(0方向)',
  SQR: '平方根', SIN: '正弦', COS: '余弦', TAN: '正接', ATN: '逆正接',
  EXP: '指数関数', LOG: '自然対数', RND: '乱数', CINT: '整数化', CSNG: '単精度化', CDBL: '倍精度化',
  ASC: '文字コード', CHR$: 'コード→文字', LEN: '文字列長', LEFT$: '左から n 文字',
  RIGHT$: '右から n 文字', MID$: '部分文字列', STR$: '数値→文字列', VAL: '文字列→数値',
  STRING$: '同一文字の繰り返し', SPACE$: '空白文字列', HEX$: '16進文字列', OCT$: '8進文字列',
  INSTR: '文字列検索位置', INKEY$: '押下キーを 1 文字取得', INPUT$: 'n 文字読込',
  PEEK: 'メモリ読出', POS: 'カーソル桁位置', CSRLIN: 'カーソル行位置', FRE: '空きメモリ',
  VARPTR: '変数のアドレス', USR: '機械語関数呼出', 'TIME$': '時刻', 'DATE$': '日付',
  ERL: '直近エラーの行番号', ERR: '直近エラーの番号', TAB: '指定桁へ移動', SPC: 'n 個の空白',
  POINT: '指定座標の色', PEN: 'ライトペン情報', ANPORT: 'アナログ入力ポート',
  EOF: 'ファイル終端か', LOC: '現在レコード位置', LOF: 'ファイル長',
  DSKF: 'ディスク空き', 'DSKI$': 'セクタ読出', 'DSKO$': 'セクタ書込',
  CVI: '文字列→整数', CVS: '文字列→単精度', CVD: '文字列→倍精度',
  'MKI$': '整数→文字列', 'MKS$': '単精度→文字列', 'MKD$': '倍精度→文字列'
};

const STATEMENT_SET = new Set(STATEMENTS);
const CLAUSE_SET = new Set(CLAUSES);
const FUNCTION_SET = new Set(FUNCTIONS);
const OPERATOR_SET = new Set(OPERATORS);

export class FBasicHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.Hover | undefined {
    const line = document.lineAt(position.line).text;
    const cs = findCommentStart(line);
    if (cs >= 0 && position.character >= cs) {
      return undefined;
    }
    const range = document.getWordRangeAtPosition(position, /[A-Za-z]+\$?/);
    if (!range) {
      return undefined;
    }
    const word = document.getText(range).toUpperCase();

    let category: string | undefined;
    if (STATEMENT_SET.has(word)) {
      category = '命令';
    } else if (CLAUSE_SET.has(word)) {
      category = '補助語';
    } else if (FUNCTION_SET.has(word)) {
      category = '関数';
    } else if (OPERATOR_SET.has(word)) {
      category = '演算子';
    }
    if (!category) {
      return undefined;
    }

    const md = new vscode.MarkdownString();
    const desc = DESCRIPTIONS[word];
    md.appendMarkdown(`**${word}** — F-BASIC ${category}`);
    if (desc) {
      md.appendMarkdown(`\n\n${desc}`);
    }
    return new vscode.Hover(md, range);
  }
}
