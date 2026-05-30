import * as vscode from 'vscode';
import {
  LEADING_LINE_NUMBER,
  REFERENCE_KEYWORDS,
  buildLineNumberIndex,
  findCommentStart
} from './util';

const REFERENCE_RE = new RegExp(
  '\\b(' + REFERENCE_KEYWORDS.join('|') + ')\\b(\\s*)(\\d+(?:\\s*,\\s*\\d+)*)',
  'gi'
);

/**
 * F-BASIC ソースを検査して診断（赤波線・警告）を更新する。
 * - GOTO/GOSUB 等が参照する存在しない行番号 → エラー
 * - 行番号の重複 → エラー
 * - 行番号が昇順でない → 警告
 */
export function refreshDiagnostics(
  document: vscode.TextDocument,
  collection: vscode.DiagnosticCollection
): void {
  if (document.languageId !== 'fbasic') {
    return;
  }
  const diagnostics: vscode.Diagnostic[] = [];
  const index = buildLineNumberIndex(document);
  const seen = new Map<number, number>();
  let prev: number | undefined;

  for (let i = 0; i < document.lineCount; i++) {
    const text = document.lineAt(i).text;

    // 行頭番号: 重複・順序チェック
    const lead = LEADING_LINE_NUMBER.exec(text);
    if (lead) {
      const n = parseInt(lead[2], 10);
      const start = lead[1].length;
      const range = new vscode.Range(i, start, i, start + lead[2].length);
      if (seen.has(n)) {
        diagnostics.push(
          new vscode.Diagnostic(
            range,
            `行番号 ${n} が重複しています。`,
            vscode.DiagnosticSeverity.Error
          )
        );
      } else {
        seen.set(n, i);
        if (prev !== undefined && n <= prev) {
          diagnostics.push(
            new vscode.Diagnostic(
              range,
              `行番号 ${n} が昇順になっていません（直前は ${prev}）。`,
              vscode.DiagnosticSeverity.Warning
            )
          );
        }
        prev = n;
      }
    }

    // 参照番号: 存在チェック（コメント・文字列内は除外）
    const cs = findCommentStart(text);
    const code = cs >= 0 ? text.slice(0, cs) : text;
    REFERENCE_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = REFERENCE_RE.exec(code)) !== null) {
      const list = m[3];
      const listStart = m.index + m[0].length - list.length;
      const numRe = /\d+/g;
      let nm: RegExpExecArray | null;
      while ((nm = numRe.exec(list)) !== null) {
        const target = parseInt(nm[0], 10);
        // 0 は ON ERROR GOTO 0 / RESUME 0 等の特殊指定なので除外
        if (target === 0 || index.has(target)) {
          continue;
        }
        const s = listStart + nm.index;
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(i, s, i, s + nm[0].length),
            `行番号 ${target} は存在しません。`,
            vscode.DiagnosticSeverity.Error
          )
        );
      }
    }
  }

  checkBlocks(document, diagnostics);
  collection.set(document.uri, diagnostics);
}

const BLOCK_RE = /\b(FOR|NEXT|WHILE|WEND)\b/gi;

/** FOR/NEXT・WHILE/WEND の対応をスタックで検査（警告） */
function checkBlocks(
  document: vscode.TextDocument,
  diagnostics: vscode.Diagnostic[]
): void {
  const forStack: { line: number; char: number; len: number }[] = [];
  const whileStack: { line: number; char: number; len: number }[] = [];

  const warn = (line: number, char: number, len: number, msg: string) =>
    diagnostics.push(
      new vscode.Diagnostic(
        new vscode.Range(line, char, line, char + len),
        msg,
        vscode.DiagnosticSeverity.Warning
      )
    );

  for (let i = 0; i < document.lineCount; i++) {
    const text = document.lineAt(i).text;
    const cs = findCommentStart(text);
    const code = cs >= 0 ? text.slice(0, cs) : text;
    BLOCK_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = BLOCK_RE.exec(code)) !== null) {
      const kw = m[1].toUpperCase();
      const pos = m.index;
      const len = m[0].length;
      if (kw === 'FOR') {
        forStack.push({ line: i, char: pos, len });
      } else if (kw === 'NEXT') {
        // NEXT I,J は複数ループを閉じる
        const after = code.slice(pos + len).split(':')[0];
        const vars = after.match(/[A-Za-z][A-Za-z0-9]*/g);
        const count = vars && vars.length > 0 ? vars.length : 1;
        for (let k = 0; k < count; k++) {
          if (forStack.length === 0) {
            warn(i, pos, len, '対応する FOR がありません。');
            break;
          }
          forStack.pop();
        }
      } else if (kw === 'WHILE') {
        whileStack.push({ line: i, char: pos, len });
      } else if (kw === 'WEND') {
        if (whileStack.length === 0) {
          warn(i, pos, len, '対応する WHILE がありません。');
        } else {
          whileStack.pop();
        }
      }
    }
  }
  for (const f of forStack) {
    warn(f.line, f.char, f.len, '対応する NEXT がありません。');
  }
  for (const w of whileStack) {
    warn(w.line, w.char, w.len, '対応する WEND がありません。');
  }
}
