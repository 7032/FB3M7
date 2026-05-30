import * as vscode from 'vscode';
import { STATEMENTS, CLAUSES, FUNCTIONS, OPERATORS } from './keywords';
import { findCommentStart } from './util';

function items(
  names: string[],
  kind: vscode.CompletionItemKind,
  detail: string
): vscode.CompletionItem[] {
  return names.map(name => {
    const item = new vscode.CompletionItem(name, kind);
    item.detail = detail;
    return item;
  });
}

const ALL_ITEMS: vscode.CompletionItem[] = [
  ...items(STATEMENTS, vscode.CompletionItemKind.Keyword, 'F-BASIC 命令'),
  ...items(CLAUSES, vscode.CompletionItemKind.Keyword, 'F-BASIC 補助語'),
  ...items(FUNCTIONS, vscode.CompletionItemKind.Function, 'F-BASIC 関数'),
  ...items(OPERATORS, vscode.CompletionItemKind.Operator, 'F-BASIC 演算子')
];

/**
 * 予約語の入力補完を提供する。コメント内・文字列内では抑制する。
 */
export class FBasicCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.CompletionItem[] | undefined {
    const text = document.lineAt(position.line).text;

    // コメント内では補完しない
    const cs = findCommentStart(text);
    if (cs >= 0 && position.character > cs) {
      return undefined;
    }
    // 文字列内では補完しない（カーソルまでの " の数が奇数）
    const quotes = (text.slice(0, position.character).match(/"/g) || []).length;
    if (quotes % 2 === 1) {
      return undefined;
    }

    return ALL_ITEMS;
  }
}
