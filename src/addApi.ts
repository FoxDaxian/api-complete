import * as vscode from 'vscode';

export const acStart = '// @ac-start';

function generateCode (document: vscode.TextDocument) {
    vscode.window.activeTextEditor?.insertSnippet(
        new vscode.SnippetString(
            `
${acStart}
// @ac-method-url
// post /demo/url
//
// @ac-request
// { "demo": "123" }
//
// @ac-response
// {
//     "data":{
//         "name": "api-complete",
//         "demo": [{
//              "test": "123"
//          }]
//     },
//     "result":"1",
//     "message":"success"
// }
// @ac-end
`
        ),
        new vscode.Range(document.lineCount - 1, 0, document.lineCount - 1, 0)
    );
}

export default () => {
    return vscode.commands.registerCommand('api-complete.addApi', (uri) => {
        const document = vscode.window.activeTextEditor?.document;
        if (!uri) {
            if (document) {
                generateCode(document);
            }
            return;
        }
        
        if (!document) {
            return;
        }
        generateCode(document);
        
    });
};
