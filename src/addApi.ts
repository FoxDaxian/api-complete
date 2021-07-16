import * as vscode from 'vscode';

export default () => {
    return vscode.commands.registerCommand('api-complete.addApi', (uri) => {
        if (!uri) {
            return;
        }
        const document = vscode.window.activeTextEditor?.document;
        if (!document) {
            return;
        }

        vscode.window.activeTextEditor?.insertSnippet(
            new vscode.SnippetString(
                `// @ac-start
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
            new vscode.Range(0, 0, 0, 0)
        );
    });
};