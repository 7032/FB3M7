import * as vscode from 'vscode';
import {
  REFERENCE_KEYWORDS,
  buildLineNumberIndex,
  isReferenceContext
} from './util';

const NUMBER_TOKEN = /\d+/g;

/** GOTO 等の後に続く行番号参照を見つける正規表現 */
const REFERENCE_RE = new RegExp(
  '\\b(?:' + REFERENCE_KEYWORDS.join('|') + ')\\b[\\s,0-9]*',
  'gi'
);

/**
 * F12 / Ctrl+Click でジャンプ先（行番号定義行）へ移動する DefinitionProvider。
 */
export class FBasicDefinitionProvider implements vscode.DefinitionProvider {
  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.Definition | undefined {
    const range = document.getWordRangeAtPosition(position, /\d+/);
    if (!range) {
      return undefined;
    }
    const textBefore = document.lineAt(position.line).text.slice(0, range.start.character);
    if (!isReferenceContext(textBefore)) {
      return undefined;
    }
    const target = parseInt(document.getText(range), 10);
    const index = buildLineNumberIndex(document);
    const lineIdx = index.get(target);
    if (lineIdx === undefined) {
      return undefined;
    }
    return new vscode.Location(document.uri, new vscode.Position(lineIdx, 0));
  }
}

/**
 * GOTO/GOSUB 等の行番号を下線リンク化し、クリックでジャンプできるようにする。
 */
export class FBasicDocumentLinkProvider implements vscode.DocumentLinkProvider {
  provideDocumentLinks(document: vscode.TextDocument): vscode.DocumentLink[] {
    const links: vscode.DocumentLink[] = [];
    const index = buildLineNumberIndex(document);

    for (let line = 0; line < document.lineCount; line++) {
      const text = document.lineAt(line).text;
      REFERENCE_RE.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = REFERENCE_RE.exec(text)) !== null) {
        const segment = m[0];
        const segStart = m.index;
        NUMBER_TOKEN.lastIndex = 0;
        let nm: RegExpExecArray | null;
        while ((nm = NUMBER_TOKEN.exec(segment)) !== null) {
          const target = parseInt(nm[0], 10);
          if (!index.has(target)) {
            continue;
          }
          const startChar = segStart + nm.index;
          const range = new vscode.Range(line, startChar, line, startChar + nm[0].length);
          const args = encodeURIComponent(JSON.stringify([target]));
          const link = new vscode.DocumentLink(
            range,
            vscode.Uri.parse(`command:fbasic.revealLine?${args}`)
          );
          link.tooltip = `行 ${target} へジャンプ`;
          links.push(link);
        }
      }
    }
    return links;
  }
}

/** DocumentLink から呼ばれる：指定した行番号の定義行へカーソルを移動 */
export function revealLine(lineNumber: number): void {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const index = buildLineNumberIndex(editor.document);
  const lineIdx = index.get(lineNumber);
  if (lineIdx === undefined) {
    vscode.window.showWarningMessage(`F-BASIC: 行番号 ${lineNumber} は見つかりません。`);
    return;
  }
  const pos = new vscode.Position(lineIdx, 0);
  editor.selection = new vscode.Selection(pos, pos);
  editor.revealRange(
    new vscode.Range(pos, pos),
    vscode.TextEditorRevealType.InCenterIfOutsideViewport
  );
}
