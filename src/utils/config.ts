import * as vscode from 'vscode';

// (^http[s]?://)(.[^(\\|\\s)]+)$
export default class Config {
    private static configuration() {
        return vscode.workspace.getConfiguration('apiComplete.settings');
    }
    private static getSettings<T>(val: string): T {
        return Config.configuration().get(val) as T;
    }
    public static get getProxy() {
        const proxy = Config.getSettings<string>('proxy');
        if (/(^http[s]?:\/\/)([^(\|\s)]+)$/.test(proxy)) {
            return proxy;
        }
        return '';
    }
}
