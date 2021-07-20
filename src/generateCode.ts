import * as vscode from 'vscode';
import parse from './utils/parse';
import showLog from './utils/showLog';

export default (context: vscode.ExtensionContext) => {
    const state: vscode.Memento = context.workspaceState;
    return vscode.commands.registerCommand(
        'api-complete.generateCode',
        (uri, endLen) => {
            if (!vscode.workspace.workspaceFolders) {
                return showLog(
                    `Open a folder or workspace... (File -> Open Folder)`
                );
            }

            if (!vscode.workspace.workspaceFolders.length) {
                return showLog(`You've not added any folder in the workspace`);
            }
            if (!uri || !endLen) {
                return;
            }
            const document = vscode.window.activeTextEditor?.document;
            if (!document) {
                return;
            }
            for (let i: number = endLen; i >= 0; --i) {
                let lineContent: string = document.lineAt(i).text;
                if (lineContent.indexOf('@ac-start') >= 0) {
                    vscode.window.activeTextEditor?.insertSnippet(
                        new vscode.SnippetString(
                            parse(
                                document.getText(
                                    new vscode.Range(
                                        i,
                                        0,
                                        endLen,
                                        lineContent.length
                                    )
                                ),
                                state
                            )
                        ),
                        new vscode.Range(endLen + 1, 0, endLen + 1, 0)
                    );
                    break;
                }
            }
        }
    );
};
