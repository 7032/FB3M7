import * as vscode from 'vscode';
import { onEnter } from './autoNumber';
import { renumber, addLineNumbers } from './renumber';
import {
  FBasicDefinitionProvider,
  FBasicDocumentLinkProvider,
  revealLine
} from './jumpProvider';
import { refreshDiagnostics } from './diagnostics';
import { FBasicDocumentSymbolProvider } from './outline';
import { FBasicCompletionProvider } from './completion';
import { FBasicHoverProvider } from './hover';
import { onTypeUppercase, uppercaseDocumentCommand } from './uppercase';

const SELECTOR: vscode.DocumentSelector = { language: 'fbasic' };

export function activate(context: vscode.ExtensionContext): void {
  const diagnostics = vscode.languages.createDiagnosticCollection('fbasic');

  context.subscriptions.push(
    diagnostics,

    // 行番号関連コマンド
    vscode.commands.registerCommand('fbasic.onEnter', onEnter),
    vscode.commands.registerCommand('fbasic.renumber', renumber),
    vscode.commands.registerCommand('fbasic.addLineNumbers', addLineNumbers),
    vscode.commands.registerCommand('fbasic.uppercase', uppercaseDocumentCommand),

    // DocumentLink からの内部ジャンプコマンド
    vscode.commands.registerCommand('fbasic.revealLine', (lineNumber: number) =>
      revealLine(lineNumber)
    ),

    // GOTO/GOSUB ジャンプ機能
    vscode.languages.registerDefinitionProvider(SELECTOR, new FBasicDefinitionProvider()),
    vscode.languages.registerDocumentLinkProvider(SELECTOR, new FBasicDocumentLinkProvider()),

    // アウトライン・補完
    vscode.languages.registerDocumentSymbolProvider(SELECTOR, new FBasicDocumentSymbolProvider()),
    vscode.languages.registerCompletionItemProvider(SELECTOR, new FBasicCompletionProvider()),
    vscode.languages.registerHoverProvider(SELECTOR, new FBasicHoverProvider()),

    // 診断（行番号の重複・順序・未定義参照）
    vscode.workspace.onDidOpenTextDocument(doc => refreshDiagnostics(doc, diagnostics)),
    vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, diagnostics)),
    vscode.workspace.onDidCloseTextDocument(doc => diagnostics.delete(doc.uri)),

    // 入力時の予約語自動大文字化
    vscode.workspace.onDidChangeTextDocument(e => { void onTypeUppercase(e); })
  );

  // 起動時に開いている F-BASIC 文書を検査
  for (const doc of vscode.workspace.textDocuments) {
    refreshDiagnostics(doc, diagnostics);
  }
}

export function deactivate(): void {
  // no-op
}
