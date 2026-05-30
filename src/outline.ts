import * as vscode from 'vscode';
import { LEADING_LINE_NUMBER, findCommentStart } from './util';

const GOSUB_RE = /\bGOSUB\b\s*(\d+(?:\s*,\s*\d+)*)/gi;

/**
 * アウトライン（パンくず／シンボル）を提供する。
 * - REM / ' のコメント行 → セクション見出し
 * - GOSUB の飛び先となっている行 → サブルーチン
 */
export class FBasicDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  provideDocumentSymbols(document: vscode.TextDocument): vscode.DocumentSymbol[] {
    // GOSUB の飛び先行番号を収集
    const subroutines = new Set<number>();
    for (let i = 0; i < document.lineCount; i++) {
      const text = document.lineAt(i).text;
      const cs = findCommentStart(text);
      const code = cs >= 0 ? text.slice(0, cs) : text;
      GOSUB_RE.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = GOSUB_RE.exec(code)) !== null) {
        for (const num of m[1].match(/\d+/g) || []) {
          subroutines.add(parseInt(num, 10));
        }
      }
    }

    const symbols: vscode.DocumentSymbol[] = [];
    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      const text = line.text;
      const lead = LEADING_LINE_NUMBER.exec(text);
      const lineNo = lead ? parseInt(lead[2], 10) : undefined;

      // コメント見出し（REM / '）
      const cs = findCommentStart(text);
      if (cs >= 0) {
        const commentText = text
          .slice(cs)
          .replace(/^\s*(REM|')\s?/i, '')
          .trim();
        if (commentText.length > 0) {
          symbols.push(
            new vscode.DocumentSymbol(
              commentText,
              lineNo !== undefined ? `行 ${lineNo}` : '',
              vscode.SymbolKind.String,
              line.range,
              line.range
            )
          );
          continue;
        }
      }

      // サブルーチン入口
      if (lineNo !== undefined && subroutines.has(lineNo)) {
        symbols.push(
          new vscode.DocumentSymbol(
            `サブルーチン ${lineNo}`,
            '',
            vscode.SymbolKind.Function,
            line.range,
            line.range
          )
        );
      }
    }
    return symbols;
  }
}
