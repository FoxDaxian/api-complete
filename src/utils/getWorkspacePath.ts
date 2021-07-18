import * as vscode from 'vscode';

export default (): string => {
    const curFilePath = vscode.window.activeTextEditor?.document.fileName;
    const key = vscode.workspace.workspaceFolders?.filter((folder: vscode.WorkspaceFolder) =>
        curFilePath?.includes(folder.uri.path)
    )[0].uri.path;
    return key || 'ac-default-key';
};
