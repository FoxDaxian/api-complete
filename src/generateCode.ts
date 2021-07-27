import * as vscode from 'vscode';
import parse from './utils/parse';
import showLog from './utils/showLog';
import { apiStart, apiEnd } from './utils/getCode';
import { acStart } from './addApi';

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
            if (!vscode.window.activeTextEditor) {
                return;
            }
            const document = vscode.window.activeTextEditor.document;
            if (!document) {
                return;
            }
            for (let i: number = endLen; i >= 0; --i) {
                let lineContent: string = document.lineAt(i).text;
                if (lineContent.indexOf('@ac-start') >= 0) {
                    const { textStr, info } = parse(
                        document.getText(
                            new vscode.Range(i, 0, endLen, lineContent.length)
                        ),
                        state
                    );
                    // get replace position
                    const restTextArr = document
                        .getText(
                            new vscode.Range(endLen, 0, document.lineCount, 0)
                        )
                        .split('\n');
                    let apiStartIndex = -1;
                    let apiEndIndex = -1;
                    for (let i = 0, len = restTextArr.length; i < len; ++i) {
                        if (restTextArr[i].includes(apiStart)) {
                            apiStartIndex = endLen + i;
                        }
                        if (restTextArr[i].includes(apiEnd)) {
                            apiEndIndex = endLen + i;
                        }
                        if (restTextArr[i].includes(acStart)) {
                            if (apiEndIndex === -1) {
                                apiStartIndex = apiEndIndex = endLen;
                            }
                            break;
                        }
                    }
                    if (apiEndIndex === -1 || apiStartIndex === -1) {
                        apiStartIndex = apiEndIndex = endLen;
                    }

                    vscode.window.activeTextEditor?.insertSnippet(
                        new vscode.SnippetString(
                            textStr +
                                document.getText(
                                    new vscode.Range(
                                        apiEndIndex + 1,
                                        0,
                                        document.lineCount,
                                        0
                                    )
                                )
                        ),
                        new vscode.Range(endLen, 0, document.lineCount, 0) // todo
                    );
                    // how to move cursor to suitable position?
                    // setTimeout(function () {
                    //     const editor = vscode.window.activeTextEditor;
                    //     const position = editor?.selection.active;

                    //     var newPosition = position?.with(apiStartIndex, 0);
                    //     var newSelection = new vscode.Selection(
                    //         newPosition,
                    //         newPosition
                    //     );
                    //     editor.selection = newSelection;
                    // }, 500);
                    break;
                }
            }
        }
    );
};
