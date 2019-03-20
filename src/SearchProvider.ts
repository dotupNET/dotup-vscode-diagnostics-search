import * as vscode from 'vscode';
//const querystring = require('querystring');
import * as querystring from 'querystring';

// const curly = /\$\{[\w-]+\|?[\w-|\{\}:'"\s,\[\].,<>]+\}/g;
// const removeBetweenSingleQuote = /'([^' ]+)'./g;

export enum SearchProviderCommand {
  StartProcess = 'Start-Process',
  start = 'start'
}

export interface ISearchProvider {
  name: string;
  command: SearchProviderCommand
  executable: string;
  url: string;
  queryParameter: string;
  maxQueryParameterLength: number;
}

export class SearchProvider implements vscode.CodeActionProvider {

  private terminalId: string = 'Diagnostic search';
  private commandId: string = 'dotup-ts-diagnostic-search.runCodeAction';
  private command: vscode.Disposable;
  private diagnosticCollection: vscode.DiagnosticCollection;
  private terminal: vscode.Terminal;
  searchProvider: ISearchProvider[];

  constructor(context: vscode.ExtensionContext) {
    console.log('search provider activated');
    const command = vscode.commands.registerCommand(this.commandId, this.runCodeAction, this);
    context.subscriptions.push(command);
    context.subscriptions.push(this);

    // dotup.diagnostics-search.searchCommands
    const config = vscode.workspace.getConfiguration('dotup');
    this.searchProvider = config.get<ISearchProvider[]>('diagnostics-search.searchCommands');

    // maxQueryParameterLength is optional, set a default value
    this.searchProvider.forEach(p => p.maxQueryParameterLength === undefined ? 1000 : p.maxQueryParameterLength);
  }

  public dispose(): void {
    this.diagnosticCollection.clear();
    this.diagnosticCollection.dispose();
    this.command.dispose();
  }

  public provideCodeActions(document: vscode.TextDocument, range: vscode.Range, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.Command[] {
    let diagnostic: vscode.Diagnostic = context.diagnostics[0];

    // Cursor is not in diagnostic line
    if (!diagnostic.range.contains(range)) {
      return;
    }

    // No search provider
    if (this.searchProvider.length < 1) {
      return;
    }

    // Create menu
    return this.searchProvider.map(p => {
      return {
        title: p.name,
        command: this.commandId,
        arguments: [diagnostic, document.languageId, p]
      };

    });

  }

  private runCodeAction(diagnostic: vscode.Diagnostic, languageId: string, sp: ISearchProvider): any {
    //    console.log(diagnostic);
    let terminal = vscode.window.terminals.find(t => t.name === this.terminalId);

    if (terminal === undefined) {
      terminal = vscode.window.createTerminal(this.terminalId);
    }

    let queryParameter = sp.queryParameter;
    queryParameter = queryParameter
      .replace(/\$\{languageId\}/g, `${languageId}`)
      .replace(/\$\{code\}/g, `${diagnostic.code}`)
      .replace(/\$\{message\}/g, `${diagnostic.message.substr(0, sp.maxQueryParameterLength)}`);
    queryParameter = querystring.escape(queryParameter);

    let terminalText = '';

    switch (sp.command) {
      case SearchProviderCommand.StartProcess:
        terminalText = `${sp.command} ${sp.executable} "${sp.url}${queryParameter}"`;
        break;

      case SearchProviderCommand.start:
        terminalText = `${sp.command} ${sp.executable}"${sp.url}${queryParameter}"`;
        break;

      default:
        terminalText = `${sp.command} ${sp.executable} "${sp.url}${queryParameter}"`;
        break;

    }

    terminal.sendText(terminalText, true);
  }
}
