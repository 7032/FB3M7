import * as vscode from 'vscode';
import { LEADING_LINE_NUMBER, getConfig } from './util';

/**
 * Enter キー押下時のハンドラ。
 * 現在行が行番号で始まっていれば、改行に続けて「次の行番号」を自動挿入する。
 * それ以外は通常の改行として振る舞う。
 */
export async function onEnter(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== 'fbasic') {
    await defaultEnter();
    return;
  }

  const cfg = getConfig();
  if (!cfg.autoEnabled) {
    await defaultEnter();
    return;
  }

  const pos = editor.selection.active;
  const lineText = editor.document.lineAt(pos.line).text;
  const m = LEADING_LINE_NUMBER.exec(lineText);

  // 行番号で始まっていない、または空行 → 通常の改行
  if (!m || lineText.trim() === '') {
    await defaultEnter();
    return;
  }

  // カーソルが行番号自身の中／手前にある場合は自動採番しない（途中編集を妨げない）
  const numberEnd = m[1].length + m[2].length;
  if (pos.character <= numberEnd) {
    await defaultEnter();
    return;
  }

  const current = parseInt(m[2], 10);
  let next = current + cfg.increment;

  // 既存の次行番号と衝突するなら自動採番せず通常改行に委ねる
  if (existsLineNumber(editor.document, next)) {
    await defaultEnter();
    return;
  }

  const insert = '\n' + next + ' ';
  await editor.edit(eb => {
    // 選択範囲があれば置換、なければカーソル位置に挿入
    eb.replace(editor.selection, insert);
  });
}

function existsLineNumber(document: vscode.TextDocument, n: number): boolean {
  for (let i = 0; i < document.lineCount; i++) {
    const m = LEADING_LINE_NUMBER.exec(document.lineAt(i).text);
    if (m && parseInt(m[2], 10) === n) {
      return true;
    }
  }
  return false;
}

async function defaultEnter(): Promise<void> {
  await vscode.commands.executeCommand('default:type', { text: '\n' });
}
