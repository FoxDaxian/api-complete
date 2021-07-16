import getCamelCase from './getCamelCase';
import json2interface from './json2interface';
import getCode from './getCode';
import getWorkspacePath from './getWorkspacePath';
import * as vscode from 'vscode';

const commonMethod: string[] = [
    'get',
    'post',
    'delete',
    'head',
    'options',
    'put',
    'patch',
];
const space =
    '[\t|\n|\v|\f|\r| |\u00a0|\u2000|\u2001|\u2002|\u2003|\u2004|\u2005|\u2006|\u2007|\u2008|\u2009|\u200a|\u200b|\u2028|\u2029|\u3000]';
const comment = new RegExp(`\/\/${space}`, 'g');
const startFlag = '@ac-start';

const requestInfo = {
    name: 'fetchData',
    method: 'get',
    url: '',
    request: '',
    response: '',
};
export type RequestInfo = typeof requestInfo;

type RequestInfoKey = keyof typeof requestInfo;
export default (text: string, state: vscode.Memento) => {
    const apiKey = getWorkspacePath();
    const textArr = text
        .replace(startFlag, '')
        .replace(comment, '')
        .split(/\n/g)
        .filter((_) => _);
    const stack: string[] = [];

    let curText: string;
    for (let i = 0, len = textArr.length; i < len; ++i) {
        let partText = '';
        curText = textArr[i];
        if (curText.startsWith('@ac-')) {
            while (stack.length) {
                curText = stack.pop() as string;
                if (curText.startsWith('@ac-')) {
                    curText = curText.replace('@ac-', '');
                    if (curText.includes('method-url')) {
                        let [method, url] = partText.split(' ');
                        if (!commonMethod.includes(method)) {
                            [method, url] = [url, method];
                        }
                        requestInfo.method = method;
                        requestInfo.url = url;
                        requestInfo.name = `fetch${getCamelCase(
                            url.split('/').slice(-2).join('/')
                        )}`;
                    } else {
                        // 有可能还没获取到name
                        requestInfo[curText as RequestInfoKey] = partText;
                    }
                    break;
                } else {
                    partText = curText + partText;
                }
            }
        }

        stack.push(textArr[i]);
    }

    state.update(apiKey, {
        ...state.get(apiKey, {}),
        [requestInfo.url]: {...requestInfo},
    });
    requestInfo.request = json2interface(
        JSON.parse(`${requestInfo.request}`),
        requestInfo.name
    );
    requestInfo.response = json2interface(
        JSON.parse(`${requestInfo.response}`),
        requestInfo.name,
        'Res'
    );

    return getCode(requestInfo);
};