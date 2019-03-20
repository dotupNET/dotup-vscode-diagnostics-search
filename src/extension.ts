import * as vscode from 'vscode';
import { SearchProvider } from './SearchProvider';

export const id = 'dotup-ts-diagnostic-search';

export function activate(context: vscode.ExtensionContext) {

  console.log('Congratulations, your extension "dotup-vscode-diagnostics-search" is now active!');

  const dis = vscode.languages.registerCodeActionsProvider(
    { scheme: 'file', language: 'typescript' },
    new SearchProvider(context)
  );

  context.subscriptions.push(dis);
}

// this method is called when your extension is deactivated
export function deactivate() { }
