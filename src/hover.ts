import * as vscode from 'vscode';

export default () => {
    vscode.languages.registerHoverProvider('javascript', {
        provideHover(document, position, token) {
            const lineConent = document.lineAt(position.line);
            const word = document.getText(
                document.getWordRangeAtPosition(position)
            );

            // return new vscode.Hover('I am a hover!');
            return new vscode.Hover(
                new vscode.MarkdownString(`[地址](${lineConent.text})`)
            );
        },
    });
};
