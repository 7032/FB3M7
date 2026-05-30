import * as vscode from 'vscode';
import { LEADING_LINE_NUMBER, REFERENCE_KEYWORDS, findCommentStart, getConfig } from './util';

const REFERENCE_RE = new RegExp(
  '\\b(' + REFERENCE_KEYWORDS.join('|') + ')\\b(\\s*)(\\d+(?:\\s*,\\s*\\d+)*)?',
  'gi'
);

/** GOTO 等の後続行番号参照を新番号に置き換える */
function remapReferences(code: string, map: Map<number, number>): string {
  return code.replace(REFERENCE_RE, (whole, kw, sp, list) => {
    if (!list) {
      return whole;
    }
    const remapped = list.replace(/\d+/g, (num: string) => {
      const mapped = map.get(parseInt(num, 10));
      return mapped !== undefined ? String(mapped) : num;
    });
    return kw + sp + remapped;
  });
}

export async function renumber(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== 'fbasic') {
    return;
  }
  const document = editor.document;
  const cfg = getConfig();

  // 1. 既存の行番号を出現順に収集し、旧->新マップを構築
  const oldToNew = new Map<number, number>();
  let newNo = cfg.start;
  const order: number[] = [];
  for (let i = 0; i < document.lineCount; i++) {
    const m = LEADING_LINE_NUMBER.exec(document.lineAt(i).text);
    if (m) {
      const old = parseInt(m[2], 10);
      if (!oldToNew.has(old)) {
        oldToNew.set(old, newNo);
        order.push(old);
        newNo += cfg.increment;
      }
    }
  }
  if (oldToNew.size === 0) {
    vscode.window.showInformationMessage('F-BASIC: 行番号付きの行がありません。');
    return;
  }

  // 2. 各行を書き換え（コメント部はそのまま温存）
  const newLines: string[] = [];
  const unresolved = new Set<number>();
  for (let i = 0; i < document.lineCount; i++) {
    const text = document.lineAt(i).text;
    const commentStart = findCommentStart(text);
    let code = commentStart >= 0 ? text.slice(0, commentStart) : text;
    const comment = commentStart >= 0 ? text.slice(commentStart) : '';

    // 行頭番号の置換
    code = code.replace(LEADING_LINE_NUMBER, (_w, ws, num) => {
      const mapped = oldToNew.get(parseInt(num, 10));
      return ws + (mapped !== undefined ? mapped : num);
    });

    // 参照番号の置換（未解決を記録）
    REFERENCE_RE.lastIndex = 0;
    let mm: RegExpExecArray | null;
    while ((mm = REFERENCE_RE.exec(code)) !== null) {
      if (mm[3]) {
        for (const numStr of mm[3].match(/\d+/g) || []) {
          if (!oldToNew.has(parseInt(numStr, 10))) {
            unresolved.add(parseInt(numStr, 10));
          }
        }
      }
    }
    code = remapReferences(code, oldToNew);

    newLines.push(code + comment);
  }

  // 3. ドキュメント全体を置換
  const fullRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(document.getText().length)
  );
  await editor.edit(eb => {
    eb.replace(fullRange, newLines.join('\n'));
  });

  if (unresolved.size > 0) {
    vscode.window.showWarningMessage(
      'F-BASIC: 参照先が存在しない行番号がありました: ' +
        [...unresolved].sort((a, b) => a - b).join(', ')
    );
  } else {
    vscode.window.showInformationMessage(
      `F-BASIC: ${oldToNew.size} 行を ${cfg.start} から ${cfg.increment} 刻みで振り直しました。`
    );
  }
}

/**
 * 番号なし行に行番号を一括付与する（既存の番号付き行はそのまま）。
 * 直前の番号 + increment を割り当て、衝突する場合は次の空き番号を探す。
 */
export async function addLineNumbers(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== 'fbasic') {
    return;
  }
  const document = editor.document;
  const cfg = getConfig();

  const used = new Set<number>();
  for (let i = 0; i < document.lineCount; i++) {
    const m = LEADING_LINE_NUMBER.exec(document.lineAt(i).text);
    if (m) {
      used.add(parseInt(m[2], 10));
    }
  }

  const newLines: string[] = [];
  let last = 0;
  for (let i = 0; i < document.lineCount; i++) {
    const text = document.lineAt(i).text;
    const m = LEADING_LINE_NUMBER.exec(text);
    if (m) {
      last = parseInt(m[2], 10);
      newLines.push(text);
      continue;
    }
    if (text.trim() === '') {
      newLines.push(text);
      continue;
    }
    let candidate = last + cfg.increment;
    while (used.has(candidate)) {
      candidate += cfg.increment;
    }
    used.add(candidate);
    last = candidate;
    newLines.push(candidate + ' ' + text);
  }

  const fullRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(document.getText().length)
  );
  await editor.edit(eb => {
    eb.replace(fullRange, newLines.join('\n'));
  });
}
