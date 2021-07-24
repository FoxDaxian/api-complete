import * as vscode from 'vscode';
import * as koa from 'koa';
import getWorkspacePath from './utils/getWorkspacePath';
import { RequestInfo } from './utils/parse';
import randomRes from './utils/randomRes';
import showLog from './utils/showLog';
import * as Net from 'net';
import StatusBar from './utils/statusBar';
import Config from './utils/config';
import request, { Method } from 'axios';
import cookies, { cookies2String } from './utils/koa-cookies';
import * as bodyParser from 'koa-bodyparser';

interface MockApi {
    [key: string]: RequestInfo;
}

interface Sockets {
    [key: string]: Net.Socket;
}

let working = false;
export default (context: vscode.ExtensionContext) => {
    let port = 3000;
    let server: Net.Server;
    const apiKey = getWorkspacePath();
    const app = new koa();
    const state: vscode.Memento = context.workspaceState;

    var sockets: Sockets = {};
    let nextSocketId = 0;

    function startServe(port: number) {
        StatusBar.working('starting...');
        server = app.listen(port);
        server.on('connection', (socket: Net.Socket) => {
            // Add a newly connected socket
            var socketId = nextSocketId++;
            sockets[socketId] = socket;

            // Remove the socket when it closes
            socket.on('close', function () {
                delete sockets[socketId];
            });

            // Extend socket lifetime for demo purposes
            socket.setTimeout(4000);
        });
        server.on('error', (e: NodeJS.ErrnoException) => {
            if (e.code === 'EADDRINUSE') {
                startServe(++port);
            }
        });
        server.on('listening', () => {
            working = true;
            StatusBar.offline(port);
            showLog(`service has been startd on port: ${port}.`);
        });
        server.on('close', () => {
            StatusBar.live();
            showLog('stop server successed.');
        });
    }
    StatusBar.init();
    return vscode.commands.registerCommand('api-complete.mock', (uri) => {
        if (working) {
            StatusBar.working('stoping...');
            server.close((e?: Error) => {
                if (e) {
                    showLog(
                        'stop server failed, please reload vscode.',
                        'error'
                    );
                }
            });
            for (var socketId in sockets) {
                sockets[socketId].destroy();
            }
            working = false;
            return;
        }
        if (!vscode.workspace.workspaceFolders?.length) {
            return showLog(`Need folder in the workspace`);
        }

        app.use(cookies);
        app.use(bodyParser());

        app.use(async (ctx) => {
            const mockApi: MockApi = state.get(apiKey, {});
            const { url, method } = ctx;

            if (url === '/favicon.ico') {
                return (ctx.status = 204);
            }
            if (mockApi[url] && mockApi[url].method === method.toLowerCase()) {
                ctx.body = randomRes(mockApi[url].response);
            } else if (Config.getProxy) {
                try {
                    const response = await request({
                        method: method.toLowerCase() as Method,
                        url: url,
                        baseURL: Config.getProxy,
                        headers: {
                            // eslint-disable-next-line
                            Cookie: cookies2String(ctx.allCookies),
                        },
                        data: ctx.request.body,
                    });
                    ctx.body = response.data;
                } catch (e) {
                    ctx.body = e.message;
                    ctx.status = 502;
                }
            } else {
                ctx.body = 'mock path are not exist!';
            }
        });

        startServe(port);
    });
};
