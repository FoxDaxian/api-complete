import * as vscode from 'vscode';
import * as koa from 'koa';
import getWorkspacePath from './utils/getWorkspacePath';
import { RequestInfo } from './utils/parse';
import randomRes from './utils/randomRes';

interface MockApi {
    [key: string]: RequestInfo;
}

export default (context: vscode.ExtensionContext) => {
    const state: vscode.Memento = context.workspaceState;
    return vscode.commands.registerCommand('api-complete.mock', (uri) => {
        if (!vscode.workspace.workspaceFolders?.length) {
            return vscode.window.showInformationMessage(
                `Need folder in the workspace`
            );
        }
        const apiKey = getWorkspacePath();
        

        const app = new koa();

        app.use(async (ctx) => {
            const mockApi: MockApi = state.get(apiKey, {});
            const {url, method} = ctx;
            if (url === '/favicon.ico') {
                return ctx.status = 204;
            }
            // 解析respone，生成随机对象即可
            if (mockApi[url] && mockApi[url].method === method.toLowerCase()) {
                ctx.body = randomRes(mockApi[url].response);
            } else {
                ctx.body = 'fail';
            }
        });

        app.listen(3000);
    });
};
