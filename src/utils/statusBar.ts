import { StatusBarItem, window, StatusBarAlignment } from 'vscode';
export default class StatusBar {
    private static changed: boolean = false;
    private static _statusBarItem: StatusBarItem;

    private static get statusbar() {
        if (!StatusBar._statusBarItem) {
            StatusBar._statusBarItem = window.createStatusBarItem(
                StatusBarAlignment.Right,
                500
            );
        }
        StatusBar._statusBarItem.show();

        return StatusBar._statusBarItem;
    }

    static init() {
        StatusBar.working('loading...');
        setTimeout(function () {
            if (StatusBar.changed) {
                return;
            }
            StatusBar.live();
        }, 1000);
    }

    static working(workingMsg: string = 'Working on it...') {
        StatusBar.statusbar.text = `$(pulse) ${workingMsg}`;
        StatusBar.statusbar.tooltip =
            'In case if it takes long time, try to close all browser window.';
        StatusBar.statusbar.command = undefined;
    }

    public static live() {
        StatusBar.statusbar.text = '$(broadcast) start mock';
        StatusBar.statusbar.command = 'api-complete.mock';
        StatusBar.statusbar.tooltip = 'Click to run mock server';
    }

    public static offline(port: Number) {
        if (!StatusBar.changed) {
            StatusBar.changed = true;
        }
        StatusBar.statusbar.text = `$(circle-slash) Port : ${port}`;
        StatusBar.statusbar.command = 'api-complete.mock';
        StatusBar.statusbar.tooltip = 'Click to close server';
    }

    // public static dispose() {
    //     StatusBar.statusbar.dispose();
    // }
}
