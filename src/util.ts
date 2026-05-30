import * as vscode from 'vscode';

/** 行頭の行番号にマッチ。group1 = 先頭空白, group2 = 行番号 */
export const LEADING_LINE_NUMBER = /^(\s*)(\d+)/;

/**
 * 行番号参照を伴う文 (GOTO/GOSUB/THEN/ELSE/RESTORE/RUN/RESUME)。
 * これらの直後（カンマ・数値・空白を挟んで）に現れる数値は行番号参照とみなす。
 */
export const REFERENCE_KEYWORDS = ['GOTO', 'GOSUB', 'THEN', 'ELSE', 'RESTORE', 'RUN', 'RESUME'];

/** カーソル位置の手前テキストが行番号参照コンテキストかどうか */
const REFERENCE_CONTEXT = new RegExp(
  '(?:' + REFERENCE_KEYWORDS.join('|') + ')\\b[\\s,0-9]*$',
  'i'
);

export function leadingLineNumber(text: string): number | undefined {
  const m = LEADING_LINE_NUMBER.exec(text);
  return m ? parseInt(m[2], 10) : undefined;
}

/** ドキュメント内の「行番号 -> エディタ行index」マップを構築 */
export function buildLineNumberIndex(document: vscode.TextDocument): Map<number, number> {
  const map = new Map<number, number>();
  for (let i = 0; i < document.lineCount; i++) {
    const n = leadingLineNumber(document.lineAt(i).text);
    if (n !== undefined && !map.has(n)) {
      map.set(n, i);
    }
  }
  return map;
}

export function isReferenceContext(textBeforeToken: string): boolean {
  return REFERENCE_CONTEXT.test(textBeforeToken);
}

/**
 * 文字列・コメント (REM / ') を考慮して、コメント開始位置を返す。
 * コメントが無ければ -1。
 */
export function findCommentStart(text: string): number {
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) {
      continue;
    }
    if (ch === "'") {
      return i;
    }
    if ((ch === 'R' || ch === 'r') && /^rem\b/i.test(text.slice(i))) {
      const prev = i === 0 ? '' : text[i - 1];
      if (!/[A-Za-z0-9_]/.test(prev)) {
        return i;
      }
    }
  }
  return -1;
}

export function getConfig() {
  const c = vscode.workspace.getConfiguration('fbasic');
  return {
    increment: c.get<number>('lineNumber.increment', 10),
    start: c.get<number>('lineNumber.start', 10),
    autoEnabled: c.get<boolean>('autoLineNumber.enabled', true),
    autoUppercase: c.get<boolean>('autoUppercase', true)
  };
}
