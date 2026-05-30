import * as vscode from 'vscode';
import { findCommentStart, getConfig } from './util';

/**
 * F-BASIC は、文字列リテラルとコメント本文を除き、コード（予約語・変数名・関数名・
 * 16進数など）をすべて大文字で扱う。本モジュールはその挙動を再現する。
 */

/** 自前の編集で再入しないためのフラグ */
let applying = false;

/** コード片（コメント除外済み）を、二重引用符の文字列内を除いて大文字化する */
function upperOutsideStrings(code: string): string {
  // " で分割。偶数インデックス=文字列の外、奇数=文字列の中
  const parts = code.split('"');
  for (let i = 0; i < parts.length; i += 2) {
    parts[i] = parts[i].toUpperCase();
  }
  return parts.join('"');
}

/** 1 行を大文字化する。文字列内とコメント本文は原文を保持し、REM 語のみ大文字化 */
function uppercaseLine(text: string): string {
  const cs = findCommentStart(text);
  if (cs < 0) {
    return upperOutsideStrings(text);
  }
  const code = text.slice(0, cs);
  // コメント部: 先頭が REM ならその語だけ大文字化し、本文は保持
  const comment = text.slice(cs).replace(/^(\s*)(rem)\b/i, (_m, ws, r) => ws + r.toUpperCase());
  return upperOutsideStrings(code) + comment;
}

/**
 * 入力時、コード領域（文字列・コメント本文の外）に打たれた英小文字を即座に大文字化する。
 * 実機 BASIC のように 1 文字ごとに大文字化される。
 */
export async function onTypeUppercase(event: vscode.TextDocumentChangeEvent): Promise<void> {
  if (applying) {
    return;
  }
  if (!getConfig().autoUppercase) {
    return;
  }
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document !== event.document) {
    return;
  }
  if (event.document.languageId !== 'fbasic') {
    return;
  }
  if (event.contentChanges.length !== 1) {
    return;
  }
  const change = event.contentChanges[0];
  const inserted = change.text;
  // 単一の ASCII 英小文字のみ対象（大文字・記号・日本語・貼り付けは対象外）
  if (inserted.length !== 1 || inserted < 'a' || inserted > 'z') {
    return;
  }

  const lineNo = change.range.start.line;
  const col = change.range.start.character; // 挿入された文字の桁（編集後もこの位置）
  const line = event.document.lineAt(lineNo).text;

  // 文字列内なら対象外（手前の " の数が奇数）
  if ((line.slice(0, col).match(/"/g) || []).length % 2 === 1) {
    return;
  }
  // コメント本文内なら対象外。ただし REM 語の内部は大文字化する
  const cs = findCommentStart(line);
  if (cs >= 0 && col >= cs) {
    const inRemKeyword = /^rem/i.test(line.slice(cs)) && col < cs + 3;
    if (!inRemKeyword) {
      return;
    }
  }

  const range = new vscode.Range(lineNo, col, lineNo, col + 1);
  applying = true;
  try {
    await editor.edit(
      eb => eb.replace(range, inserted.toUpperCase()),
      { undoStopBefore: false, undoStopAfter: false }
    );
  } finally {
    applying = false;
  }
}

/** コマンド: ドキュメント全体を大文字化（文字列・コメント本文は保持） */
export async function uppercaseDocumentCommand(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== 'fbasic') {
    return;
  }
  const document = editor.document;
  const newLines: string[] = [];
  for (let i = 0; i < document.lineCount; i++) {
    newLines.push(uppercaseLine(document.lineAt(i).text));
  }
  const fullRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(document.getText().length)
  );
  await editor.edit(eb => eb.replace(fullRange, newLines.join('\n')));
}
