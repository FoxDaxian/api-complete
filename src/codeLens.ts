import {
    CodeLensProvider,
    TextDocument,
    CancellationToken,
    ProviderResult,
    CodeLens,
    Range,
} from 'vscode';
import * as vscode from 'vscode';

class MyCodeLens implements CodeLensProvider {
    provideCodeLenses(
        document: TextDocument,
        token: CancellationToken
    ): ProviderResult<CodeLens[]> {
        if (!vscode.window.activeTextEditor) {
            return;
        }
        const codeLensRes: CodeLens[] = [];
        let used: boolean = false;
        let range: Range;
        const codeLensLine: number = document.lineCount - 1;
        for (let i: number = 0; i < codeLensLine; ++i) {
            const lineContent: string = document.lineAt(i).text;
            if (lineContent.indexOf('@ac-end') >= 0) {
                used = true;
                range = new Range(i, 0, i, 0);
                codeLensRes.push(
                    new CodeLens(range, {
                        title: 'convert code',
                        command: 'api-complete.generateCode',
                        arguments: [document.uri, i + 1],
                    }),
                    // new CodeLens(range, {
                    //     title: 'turn mock on',
                    //     command: 'api-complete.generateCode',
                    //     arguments: [document.uri, i],
                    // })
                );
            }
        }
        if (used) {
            range = new Range(codeLensLine, 0, codeLensLine, 0);
            codeLensRes.push(
                new CodeLens(range, {
                    title: 'add new api(+)',
                    command: 'api-complete.addApi',
                    arguments: [document.uri],
                }),
                // new CodeLens(range, {
                //     title: 'turn mock on',
                //     command: 'api-complete.addApi',
                //     arguments: [document.uri],
                // })
            );
        }
        return codeLensRes;
    }
}
export default new MyCodeLens();
