import * as vscode from 'vscode';

type Type = 'warn' | 'error';

type LogName =
    | 'showInformationMessage'
    | 'showWarningMessage'
    | 'showErrorMessage';

export default (message: string, type?: Type) => {
    const window = vscode.window;
    let logName: LogName = 'showInformationMessage';
    if (type === 'warn') {
        logName = 'showWarningMessage';
    } else if (type === 'error') {
        logName = 'showErrorMessage';
    }

    window[logName](message);
};
