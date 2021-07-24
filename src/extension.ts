import * as vscode from 'vscode';
import hover from './hover';
import codeLens from './codeLens';
import generateCode from './generateCode';
import addApi from './addApi';
import mock from './mock';
import getWorkspacePath from './utils/getWorkspacePath';

export function activate(context: vscode.ExtensionContext) {
    const state: vscode.Memento = context.workspaceState;
    const apiKey = getWorkspacePath();

    // hover();


    vscode.languages.registerCodeLensProvider({ scheme: 'file' }, codeLens);
    
    context.subscriptions.push(generateCode(context));
    context.subscriptions.push(addApi());
    context.subscriptions.push(mock(context));
    
    context.subscriptions.push(
        vscode.commands.registerCommand('api-complete.clearMockData', () => {
            state.update(apiKey, {});
        })
    );
}

export function deactivate() {}
